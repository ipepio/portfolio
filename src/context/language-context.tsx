import { createContext, useContext } from "react";

export type Language = "es" | "en" | "ca";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguageContext must be used within LanguageProvider");
  return context;
}
