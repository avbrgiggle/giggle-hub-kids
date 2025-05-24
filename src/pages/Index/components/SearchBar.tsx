
import React, { useState } from "react";
import { Search, MapPin, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface SearchBarProps {
  onSearch: (term: string) => void;
  onLocationSearch: (location: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onLocationSearch }) => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
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
      <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <PopoverTrigger asChild>
          <Button size="lg" className="rounded-full h-12 bg-primary hover:bg-primary/90">
            <Filter className="mr-2" />
            {t("search.filters")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h3 className="font-medium">Filters</h3>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="price">
                <AccordionTrigger>Price</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="free" />
                      <label htmlFor="free" className="text-sm">Free</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-1" />
                      <label htmlFor="price-1" className="text-sm">$1 - $25</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-2" />
                      <label htmlFor="price-2" className="text-sm">$25 - $50</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-3" />
                      <label htmlFor="price-3" className="text-sm">Above $50</label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="duration">
                <AccordionTrigger>Duration</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">&lt; 1 hour</SelectItem>
                        <SelectItem value="1-2">1-2 hours</SelectItem>
                        <SelectItem value="2-3">2-3 hours</SelectItem>
                        <SelectItem value="3+">&gt; 3 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="date">
                <AccordionTrigger>Date</AccordionTrigger>
                <AccordionContent>
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="pointer-events-auto"
                  />
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="activityType">
                <AccordionTrigger>Activity Type</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="type-sports" />
                      <label htmlFor="type-sports" className="text-sm">Sports</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="type-arts" />
                      <label htmlFor="type-arts" className="text-sm">Arts & Crafts</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="type-stem" />
                      <label htmlFor="type-stem" className="text-sm">STEM</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="type-nature" />
                      <label htmlFor="type-nature" className="text-sm">Nature</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="type-music" />
                      <label htmlFor="type-music" className="text-sm">Music</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="type-dance" />
                      <label htmlFor="type-dance" className="text-sm">Dance</label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="flex justify-end pt-2">
              <Button 
                variant="outline" 
                className="mr-2"
                onClick={() => setIsFiltersOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setIsFiltersOpen(false)}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
