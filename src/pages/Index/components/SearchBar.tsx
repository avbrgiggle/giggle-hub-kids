
import React, { useState } from "react";
import { Search, MapPin, Filter } from "lucide-react";
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

interface SearchBarProps {
  onSearch: (term: string) => void;
  onLocationSearch: (location: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onLocationSearch }) => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
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
            <h3 className="font-medium">{t("filters.title")}</h3>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="price">
                <AccordionTrigger>{t("filters.price")}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span>{t("filters.free")}</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span>$1 - $25</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span>$25 - $50</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span>{t("filters.above")} $50</span>
                    </label>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="duration">
                <AccordionTrigger>{t("filters.duration")}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("filters.selectDuration")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">&lt; 1 {t("filters.hour")}</SelectItem>
                        <SelectItem value="1-2">1-2 {t("filters.hours")}</SelectItem>
                        <SelectItem value="2-3">2-3 {t("filters.hours")}</SelectItem>
                        <SelectItem value="3+">&gt; 3 {t("filters.hours")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="capacity">
                <AccordionTrigger>{t("filters.capacity")}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-2">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("filters.selectCapacity")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5">1-5 {t("filters.participants")}</SelectItem>
                        <SelectItem value="6-10">6-10 {t("filters.participants")}</SelectItem>
                        <SelectItem value="11-20">11-20 {t("filters.participants")}</SelectItem>
                        <SelectItem value="20+">&gt; 20 {t("filters.participants")}</SelectItem>
                      </SelectContent>
                    </Select>
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
                {t("filters.cancel")}
              </Button>
              <Button onClick={() => setIsFiltersOpen(false)}>
                {t("filters.apply")}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
