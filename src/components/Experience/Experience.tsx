import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import {locales} from "@/data/locales";
import { experienceData } from "@/data/ExperienceData";
import { FaArrowRight } from "react-icons/fa";
import { XIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ScrollArrow from "@/components/ui/ScrollArrow";
import "./Experience.css";

interface ModalProps {
  experience: typeof experienceData[0];
  onClose: () => void;
  theme: "light" | "dark";
  language: "es" | "en" | "ca";
  t: typeof locales[keyof typeof locales];
}

const ExperienceModal = ({ experience, onClose, theme, language }: ModalProps) => {
  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className={`modal-container ${theme}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`modal-header ${theme}`}>
          <div>
            <h3 className="modal-title">{experience.position[language]}</h3>
            <p className={`modal-company ${theme}`}>{experience.company}</p>
          </div>
          <button className={`modal-close ${theme}`} onClick={onClose}>
            <XIcon size={24} />
          </button>
        </div>
        <div className="modal-body">
          <p className={`modal-description ${theme}`}>{experience.fullDescription[language]}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Experience() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [selectedExperience, setSelectedExperience] = useState<typeof experienceData[0] | null>(null);
  
  // Get localized texts
  const t = locales[language];

  return (
    <section className={`experience-section ${theme}`} id="experience">
      <div className="experience-container">
        {/* Encabezado */}
        <div className="experience-header">
          <h2 className="experience-title">{t.experienceTitle}</h2>
          <div className={`experience-underline ${theme}`}></div>
        </div>

        {/* Timeline */}
        <div className={`timeline ${theme}`}>
          {experienceData.map((experience, index) => (
            <motion.div 
              key={experience.id}
              className="timeline-item"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div 
                className={`timeline-dot ${experience.isCurrent ? 'timeline-dot-current' : 'timeline-dot-previous'} ${theme}`}
              ></div>
              <div 
                className={`timeline-card ${experience.isCurrent ? 'timeline-card-current' : 'timeline-card-previous'} ${theme}`}
              >
                <div className="timeline-header">
                  <div className="timeline-info">
                    <h3 className="timeline-position">{experience.position[language]}</h3>
                    <p className="timeline-company">{experience.company}</p>
                  </div>
                  <p className={`timeline-period ${theme}`}>{experience.period[language]}</p>
                </div>
                <p className={`timeline-description ${theme}`}>
                  {experience.description[language]}
                </p>
                <div className="timeline-more">
                  <button 
                    className={`more-button ${theme}`}
                    onClick={() => setSelectedExperience(experience)}
                  >
                    {t.viewMore} <FaArrowRight className="more-icon" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal para mostrar descripción completa */}
      <AnimatePresence>
        {selectedExperience && (
          <ExperienceModal 
            experience={selectedExperience}
            onClose={() => setSelectedExperience(null)}
            theme={theme}
            language={language}
            t={t}
          />
        )}
      </AnimatePresence>

      <ScrollArrow targetId="projects" />
    </section>
  );
}