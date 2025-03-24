
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Loader2 } from 'lucide-react';

interface LocationMapProps {
  address: string;
  className?: string;
}

const LocationMap = ({ address, className = "" }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  useEffect(() => {
    // For demo purposes, prompt for token
    // In production, this should come from environment variables
    const token = prompt("Please enter your Mapbox public token (You can find this at mapbox.com in your account dashboard)");
    if (token) {
      setMapboxToken(token);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !address) return;
    
    // Geocode the address to get coordinates
    const geocodeAddress = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}`
        );
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setCoordinates([lng, lat]);
        }
      } catch (error) {
        console.error("Error geocoding address:", error);
      }
    };

    geocodeAddress();
  }, [address, mapboxToken]);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !coordinates) return;

    // Initialize the map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: coordinates,
      zoom: 14
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add a marker at the location
    new mapboxgl.Marker()
      .setLngLat(coordinates)
      .addTo(map.current);
    
    // Add a popup with the address
    new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(coordinates)
      .setHTML(`<p>${address}</p>`)
      .addTo(map.current);

    setLoading(false);

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [coordinates, mapboxToken, address]);

  if (!mapboxToken) {
    return (
      <div className={`rounded-md border p-4 text-center ${className}`}>
        <p>Mapbox token is required to display the map.</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="h-full w-full rounded-md overflow-hidden" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};

export default LocationMap;
