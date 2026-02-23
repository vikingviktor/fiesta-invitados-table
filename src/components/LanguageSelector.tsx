import React from "react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const flags: Record<Language, string> = {
  es: "🇪🇸",
  en: "🇮🇪",
  it: "🇮🇹",
  zh: "🇨🇳",
  de: "🇩🇪",
};

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
      <SelectTrigger className="w-16 h-10 border-none bg-transparent hover:bg-primary/10 focus:ring-0 focus:ring-offset-0">
        <SelectValue>
          <span className="text-xl">{flags[language]}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="es">
          <span className="flex items-center gap-2">
            <span className="text-xl">🇪🇸</span>
            <span>Español</span>
          </span>
        </SelectItem>
        <SelectItem value="en">
          <span className="flex items-center gap-2">
            <span className="text-xl">🇮🇪</span>
            <span>English</span>
          </span>
        </SelectItem>
        <SelectItem value="it">
          <span className="flex items-center gap-2">
            <span className="text-xl">🇮🇹</span>
            <span>Italiano</span>
          </span>
        </SelectItem>
        <SelectItem value="zh">
          <span className="flex items-center gap-2">
            <span className="text-xl">🇨🇳</span>
            <span>中文</span>
          </span>
        </SelectItem>
        <SelectItem value="de">
          <span className="flex items-center gap-2">
            <span className="text-xl">🇩🇪</span>
            <span>Deutsch</span>
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
