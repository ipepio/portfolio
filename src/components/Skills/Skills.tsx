"use client";

import { useState } from "react";
import { useTheme } from "@/hooks/useThemeHook";
import { useLanguage } from "@/hooks/useLanguageHook";
import { skillsData } from "@/data/skillsData";
import { motion, AnimatePresence } from "framer-motion";
import Progress from "@/components/ui/Progress/Progress"
import "./Skills.css";

export default function Skills() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <section className={`skills-section ${theme}`} id="skills">
      <h2 className="skills-title">
        {language === "es" ? "Experiencia Técnica" : language === "en" ? "Technical Expertise" : "Experiència Tècnica"}
      </h2>

      <div className="skills-container">
        {skillsData.map((category) => {
          const isSelected = selectedCategory === category.category;
          const displayedSkills = category.skills.slice(0, 3);
          const remainingSkills = category.skills.length - displayedSkills.length;

          return (
            <motion.div
              key={category.category}
              className={`skills-card ${isSelected ? "expanded" : ""}`}
              onClick={() => setSelectedCategory(isSelected ? null : category.category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="card-header">
                <span className="card-icon">{category.icon}</span>
                <div>
                  <h3 className="card-title">{category.title[language]}</h3>
                  <p className="card-description">{category.description[language]}</p>
                </div>
              </div>

              {/* Contenido cuando la card NO está seleccionada */}
              {!isSelected && (
                <div className="skills-tags">
                  {displayedSkills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill.name}</span>
                  ))}
                  {remainingSkills > 0 && <span className="skill-tag">+{remainingSkills} más</span>}
                </div>
              )}

              {/* Contenido cuando la card ESTÁ seleccionada */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="skills-list"
                  >
                    {category.skills.map((skill, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="skill-bar"
                      >
                        <div className="skill-info">
                          <span className="skill-name">{skill.name}</span>
                          <span className="skill-percentage">{skill.percentage}%</span>
                        </div>
                        <div> 
                          {/* <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.percentage}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="progress"
                            style={{ maxWidth: `${skill.percentage}%` }} // 🔥 Ajusta el ancho según el % 🔥
                          /> */}
                        <Progress value={skill.percentage} />

                        </div> 

                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
