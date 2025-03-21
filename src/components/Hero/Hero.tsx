import { useState, useEffect, useRef } from "react";
import isaacImage from "@/assets/isaac.jpg";
import ScrollArrow from "@/components/ui/ScrollArrow";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { locales } from "@/data/locales";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

import "./Hero.css";

const roles = {
    es: ["Ingeniero de Software"],
    en: ["Software Engineer"],
    ca: ["Enginyer de Software"]
};

export default function Hero() {
    const { language } = useLanguage();
    const { theme } = useTheme();
    const t = locales[language];
    const roleList = roles[language];

    const [index, setIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && !hasAnimated) {
                setIsAnimating(true);
                setHasAnimated(true);
                setDisplayedText("");
            }
        }, { threshold: 0.5 });

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, [hasAnimated]);

    useEffect(() => {
        const currentRole = roleList[index];

        if (!isAnimating && displayedText === "") {
            setDisplayedText(currentRole);
            return;
        }
        if (!isAnimating) {
            return;
        }

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
            setIsAnimating(false);
        }

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, index, language, isAnimating, roleList]);

    useEffect(() => {
        if (hasAnimated) {
            setDisplayedText(roleList[0]);
            setIndex(0);
        }
    }, [language, roleList]);

    return (
        <section className={`hero ${theme}`} id="hero" ref={sectionRef}>
            <div className={`hero-content ${theme}`}>
                <h1 className={`hero-title ${theme}`}>{t.saludo}</h1>
                <h2 className={`hero-subtitle ${theme}`}>
                    {displayedText}
                    <span className={`animate-blink ${theme}`}>|</span>
                </h2>
                <p className={`hero-text ${theme}`}>{t.descripcion}</p>
                <div className={`hero-buttons ${theme}`}>
                    <a href="/CV_Isaac_Pepió.pdf" download className={`hero-button cv ${theme}`}>{t.descargarCV}</a>
                    <a href="mailto:hola@ipepio.dev" className={`hero-button contact ${theme}`}>{t.contactame}</a>
                </div>
                <div className={`hero-links ${theme}`}>
                    <a href="https://github.com/ipepio" target="_blank" rel="noopener noreferrer">
                        <FaGithub className={`hero-icon ${theme}`} />
                    </a>
                    <a href="https://www.linkedin.com/in/ipepio" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin className={`hero-icon ${theme}`} />
                    </a>
                </div>
            </div>

            <div className={`hero-image ${theme}`}>
                <img src={isaacImage} alt="Isaac" className={`hero-img ${theme}`} />
            </div>

            <ScrollArrow targetId="about" />
        </section>
    );
}