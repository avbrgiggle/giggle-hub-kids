
import React from "react";
import { Search, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

export const SearchBar = () => {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-2xl mx-auto flex gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("search.activities")}
          className="pl-10 h-12 rounded-full bg-white/90 border-0"
        />
      </div>
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("search.location")}
          className="pl-10 h-12 rounded-full bg-white/90 border-0"
        />
      </div>
      <Button size="lg" className="rounded-full h-12 bg-primary hover:bg-primary/90">
        <Filter className="mr-2" />
        {t("search.filters")}
      </Button>
    </div>
  );
};
