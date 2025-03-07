
import React, { useState } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  onSearch: (term: string) => void;
  onLocationSearch: (location: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onLocationSearch }) => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    onSearch(e.target.value);
  };
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationInput(e.target.value);
    onLocationSearch(e.target.value);
  };
  
  return (
    <div className="max-w-2xl mx-auto flex gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("search.activities")}
          className="pl-10 h-12 rounded-full bg-white/90 border-0"
          value={searchInput}
          onChange={handleSearchChange}
        />
      </div>
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("search.location")}
          className="pl-10 h-12 rounded-full bg-white/90 border-0"
          value={locationInput}
          onChange={handleLocationChange}
        />
      </div>
      <Button size="lg" className="rounded-full h-12 bg-primary hover:bg-primary/90">
        <Filter className="mr-2" />
        {t("search.filters")}
      </Button>
    </div>
  );
};
