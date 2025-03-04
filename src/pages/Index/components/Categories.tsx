
import React from "react";
import { useTranslation } from "react-i18next";

interface CategoriesProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const Categories = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoriesProps) => {
  const { t } = useTranslation();

  const getCategoryTranslationKey = (category: string) => {
    if (category === "Arts & Crafts") return "artsCrafts";
    return category.toLowerCase();
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`filter-chip whitespace-nowrap ${
            selectedCategory === category ? "active" : ""
          }`}
        >
          {t(`categories.${getCategoryTranslationKey(category)}`)}
        </button>
      ))}
    </div>
  );
};
