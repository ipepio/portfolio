import { useState, useEffect } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
// import { locales } from "@/data/locales";
import { useLanguage } from "@/context/LanguageContext"; // 👈 Importamos el contexto

import "./UnderConstruction.css";

const roles = {
    es: ["En construcción"],
    en: ["Under Construction",],
    ca: ["En construcció"]
};

export default function Hero() {
    const { language } = useLanguage();
    // const t = locales[language]; // 👈 Obtenemos los textos traducidos
    const roleList = roles[language];

    const [index, setIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentRole = roleList[index];
        let timeout;

        if (isDeleting) {
            timeout = setTimeout(() => {
                setDisplayedText((prev) => prev.slice(0, -1));
            }, 50);
        } else {
            timeout = setTimeout(() => {
                setDisplayedText((prev) => currentRole.slice(0, prev.length + 1));
            }, 100);
        }

        if (!isDeleting && displayedText === currentRole) {
            timeout = setTimeout(() => setIsDeleting(true), 1500);
        } else if (isDeleting && displayedText === "") {
            setIsDeleting(false);
            setIndex((prev) => (prev + 1) % roleList.length);
        }

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, index, language]); // 🔥 Dependemos del idioma para actualizar dinámicamente

    return (
        <section className="hero" id="">
            <div className="hero-content">
                <h2 className="hero-title">
                    {displayedText}
                    <span className="animate-blink">|</span>
                </h2>
                <div className="hero-links">
                    <a href="https://github.com/ipepio" target="_blank" rel="noopener noreferrer">
                        <FaGithub />
                    </a>
                    <a href="https://www.linkedin.com/in/ipepio" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin />
                    </a>
                </div>
            </div>
        </section>
    );
}
