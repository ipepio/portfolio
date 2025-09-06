import { useState, useEffect } from "react";
import { LanguageContext, type Language } from "@/lib/language-context";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const storedLanguage = localStorage.getItem("language") as Language | null;
  const [language, setLanguage] = useState<Language>(storedLanguage || "es");

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
