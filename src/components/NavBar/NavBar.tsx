import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon, GlobeIcon, MenuIcon, XIcon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { locales } from "@/data/locales";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import "./NavBar.css";

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [showMenu, setShowMenu] = useState(window.innerWidth <= 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // Estado para animar el cierre
  const [languageOpen, setLanguageOpen] = useState(false);
  const [languageOpenMobile, setLanguageOpenMobile] = useState(false);

  const t = locales[language];

  useEffect(() => {
    const handleResize = () => {
      setShowMenu(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Añadir controlador para cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isMenuButton = target.closest('.menu-button');
      const isInsideMenu = target.closest('.mobile-menu');
      
      if (isMenuOpen && !isMenuButton && !isInsideMenu) {
        closeMenuWithAnimation();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    event.preventDefault();
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      closeMenuWithAnimation();
    }
  };

  // Función para cerrar con animación
  const closeMenuWithAnimation = () => {
    if (!isMenuOpen) return;
    
    setIsClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsClosing(false);
    }, 300); // Tiempo de la transición CSS
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenuWithAnimation();
    } else {
      setIsMenuOpen(true);
    }
  };

  return (
    <>
      <header className={`navbar ${theme} ${isMenuOpen ? 'menu-open' : ''}`}>
        <nav className="nav-container">
          {showMenu ? (
            <Button variant="ghost" size="icon" className="menu-button" onClick={toggleMenu}>
              {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </Button>
          ) : (
            <div className="nav-right">
              <ul className="nav-links">
                <li><a href="" onClick={(e) => scrollToSection(e, "hero")}>{t.inicio}</a></li>
                <li><a href="" onClick={(e) => scrollToSection(e, "about")}>{t.sobreMi}</a></li>
                <li><a href="" onClick={(e) => scrollToSection(e, "experience")}>{t.experiencia}</a></li>
                <li><a href="" onClick={(e) => scrollToSection(e, "projects")}>{t.proyectos}</a></li>
                <li><a href="" onClick={(e) => scrollToSection(e, "contacto")}>{t.contacto}</a></li>
              </ul>

              <Popover open={languageOpen} onOpenChange={setLanguageOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="language-button">
                    {language.toUpperCase()} ▼
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={`language-dropdown ${theme}`}>
                  <button onClick={() => { setLanguage("es"); setLanguageOpen(false); }}>Español</button>
                  <button onClick={() => { setLanguage("en"); setLanguageOpen(false); }}>English</button>
                  <button onClick={() => { setLanguage("ca"); setLanguageOpen(false); }}>Català/Valencià</button>
                </PopoverContent>
              </Popover>

              <Button className="theme-button" onClick={toggleTheme}>
                {theme === "light" ? <MoonIcon /> : <SunIcon color="white" />}
              </Button>
            </div>
          )}
        </nav>
      </header>

      {/* Siempre renderizamos el menú, pero lo controlamos con clases */}
      <div className={`mobile-menu ${theme} ${isMenuOpen ? 'open' : ''} ${isClosing ? 'closing' : ''}`}>
        <ul className="mobile-nav-links">
          <li><a onClick={(e) => scrollToSection(e, "hero")}>{t.inicio}</a></li>
          <li><a onClick={(e) => scrollToSection(e, "about")}>{t.sobreMi}</a></li>
          <li><a onClick={(e) => scrollToSection(e, "experience")}>{t.experiencia}</a></li>
          <li><a onClick={(e) => scrollToSection(e, "projects")}>{t.proyectos}</a></li>
          <li><a onClick={(e) => scrollToSection(e, "contacto")}>{t.contacto}</a></li>
        </ul>

        <Popover open={languageOpenMobile} onOpenChange={setLanguageOpenMobile}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="language-button">
              <GlobeIcon size={20} /> {language.toUpperCase()} ▼
            </Button>
          </PopoverTrigger>
          <PopoverContent className="language-dropdown-mobile">
            <button onClick={() => { setLanguage("es"); setLanguageOpenMobile(false); }}>Español</button>
            <button onClick={() => { setLanguage("en"); setLanguageOpenMobile(false); }}>English</button>
            <button onClick={() => { setLanguage("ca"); setLanguageOpenMobile(false); }}>Català/Valencià</button>
          </PopoverContent>
        </Popover>

        <Button onClick={toggleTheme} className="mobile-theme">
          {theme === "light" ? <MoonIcon /> : <SunIcon color="white" />}
        </Button>
      </div>
    </>
  );
};

export default NavBar;