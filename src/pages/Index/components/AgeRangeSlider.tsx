
import { Slider } from "@/components/ui/slider";
import { useTranslation } from "react-i18next";

interface AgeRangeSliderProps {
  value: number[];
  onChange: (newValue: number[]) => void;
}

export const AgeRangeSlider = ({ value, onChange }: AgeRangeSliderProps) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-md mx-auto">
      <p className="text-center mb-2 text-white/90">
        {t("ageRange.label")} {value[0]} - {value[1]} {t("ageRange.years")}
      </p>
      <Slider
        defaultValue={[0, 18]}
        min={0}
        max={18}
        step={1}
        value={value}
        minStepsBetweenThumbs={1}
        onValueChange={onChange}
        className="my-4"
      />
    </div>
  );
};
