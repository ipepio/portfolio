import { useLanguage } from "@/hooks/useLanguageHook";
import { useTheme } from "@/hooks/useThemeHook";
import { ArrowUpIcon } from "lucide-react";
import { locales } from "@/data/locales";
import "./Footer.css";

export default function Footer() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const t = locales[language];
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className={`footer ${theme}`}>
      <div className="footer-container">
        {/* Línea divisoria */}
        <div className={`footer-divider ${theme}`}></div>

        {/* Copyright */}
        <p className={`footer-copyright ${theme}`}>
          &copy; {currentYear} Isaac Pepió - {t.derechos}
        </p>
      </div>

      {/* Botón volver arriba */}
      <button
        className={`back-to-top ${theme}`}
        onClick={scrollToTop}
        aria-label="Volver arriba"
      >
        <ArrowUpIcon size={20} />
      </button>
    </footer>
  );
}