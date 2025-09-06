import { FaRocket, FaTrophy } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { useLanguage } from "@/hooks/useLanguageHook";
import { useTheme } from "@/hooks/useThemeHook";
import { locales } from "@/data/locales";
import ScrollArrow from "@/components/ui/ScrollArrow";
import "./About.css";

export default function AboutMe() {
    const { language } = useLanguage();
    const { theme } = useTheme();
    const t = locales[language];

    return (
        <section className={`about-section ${theme}`} id="about">
            <div className={`about-container ${theme}`}>
                {/* Encabezado */}
                <div className={`about-header ${theme}`}>
                    <h2 className={`about-title ${theme}`}>{t.aboutTitle}</h2>
                    <div className={`about-underline ${theme}`}></div>
                </div>

                <div className={`about-content ${theme}`}>
                    {/* Texto de presentación */}
                    <div className={`about-text ${theme}`}>
                        <h3>{t.aboutSubtitle}</h3>
                        <p>{t.aboutDescription1}</p>
                        <p>{t.aboutDescription2}</p>
                        <p>{t.aboutDescription3}</p>
                        <p>{t.aboutDescription4}</p>
                    </div>

                    {/* Tarjetas de características */}
                    <div className={`about-cards ${theme}`}>
                        <div className={`about-card ${theme}`}>
                            <GoGraph className={`about-icon ${theme}`} />
                            <h4>{t.aboutTag1}</h4>
                            <p>{t.aboutTag1Desc}</p>
                        </div>

                        <div className={`about-card ${theme}`}>
                        <FaRocket className={`about-icon ${theme}`} />
                        <h4>{t.aboutTag2}</h4>
                            <p>{t.aboutTag2Desc}</p>
                        </div>

                        <div className={`about-card ${theme}`}>
                            <FaTrophy className={`about-icon ${theme}`} />
                            <h4>{t.aboutTag3}</h4>
                            <p>{t.aboutTag3Desc}</p>
                        </div>
                    </div>
                </div>
            </div>
            <ScrollArrow targetId="experience" />
        </section>
    );
}