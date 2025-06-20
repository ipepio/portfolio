import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { locales } from "@/data/locales";
import { Project, mockProjects } from "@/data/ProjectsData";
import { motion, AnimatePresence } from "framer-motion";
import { Code, ExternalLink, ChevronDown, X } from "lucide-react";
import ScrollArrow from "@/components/ui/ScrollArrow";
import "./Projects.css";

interface ProjectCardProps {
    project: Project;
    theme: "light" | "dark";
    language: "es" | "en" | "ca";
    t: typeof locales["es"];
    onOpenModal: (project: Project) => void;
    expanded: boolean;
    onToggleExpand: () => void;
}

interface ProjectModalProps {
    project: Project;
    theme: "light" | "dark";
    language: "es" | "en" | "ca";
    t: typeof locales["es"];
    onClose: () => void;
}

const ProjectCard = ({ project, theme, language, t, onOpenModal, expanded, onToggleExpand }: ProjectCardProps) => {
    return (
        <div className="project-card-container">
            <motion.div
                className={`project-card ${theme} ${expanded ? 'expanded' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className={`project-image ${theme}`}>
                    {project.image ? (
                        <img src={project.image} alt={project.title[language]} />
                    ) : (
                        <div className="project-placeholder">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                        </div>
                    )}
                </div>

                <div className="project-content">
                    <h3 className="project-title">{project.title[language]}</h3>
                    <p className={`project-description ${theme}`}>{project.description[language]}</p>

                    <div className="project-technologies">
                        {project.technologies.slice(0, 4).map((tech, index) => (
                            <span
                                key={index}
                                className="tech-tag"
                                style={{ backgroundColor: tech.color || "#666" }}
                            >
                                {tech.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className={`project-details ${theme} ${expanded ? 'expanded' : ''}`}>
                    <h4 className="features-title">{t.keyFeatures}</h4>
                    <ul className="features-list">
                        {project.features[language].map((feature, index) => (
                            <li key={index} className={theme}>{feature}</li>
                        ))}
                    </ul>
                    <div className="project-buttons">
                        <button
                            className={`project-button ${project.githubUrl ? `demo ${theme}` : `disabled ${theme}`}`}
                            disabled={!project.githubUrl}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (project.githubUrl) {
                                    window.open(project.githubUrl, "_blank");
                                }
                            }}
                        >
                            <Code size={16} />
                            {project.githubUrl ? t.viewCode : t.noRepoAvailable}
                        </button>

                        <button
                            className={`project-button ${project.demoUrl ? `demo ${theme}` : `disabled ${theme}`}`}
                            disabled={!project.demoUrl}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (project.demoUrl) {
                                    window.open(project.demoUrl, "_blank");
                                }
                            }}
                        >
                            <ExternalLink size={16} />
                            {project.demoUrl ? t.liveDemo : t.noDemoAvailable}
                        </button>

                        <button
                            className={`project-button more ${theme}`}
                            onClick={() => onOpenModal(project)}
                        >
                            {t.learnMore}
                        </button>
                    </div>
                </div>

                <button
                    className={`project-expand-button ${theme} ${expanded ? 'active' : ''}`}
                    onClick={onToggleExpand}
                    aria-label={expanded ? t.close : t.learnMore}
                >
                    <ChevronDown size={20} />
                </button>
            </motion.div>
        </div>
    );
};

const ProjectModal = ({ project, theme, language, t, onClose }: ProjectModalProps) => {
    return (
        <motion.div
            className="project-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className={`project-modal ${theme}`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 20 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`modal-header ${theme}`}>
                    <h2 className="modal-title">{project.title[language]}</h2>
                    <button className={`modal-close ${theme}`} onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className={`modal-image ${theme}`}>
                    {project.image ? (
                        <img src={project.image} alt={project.title[language]} />
                    ) : (
                        <div className="project-placeholder">
                            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                        </div>
                    )}
                </div>

                <div className="modal-content">
                    <p className={`modal-description ${theme}`}>{project.fullDescription[language]}</p>

                    <div className="modal-technologies">
                        <h3 className="modal-technologies-title">{t.technologies}</h3>
                        <div className="modal-tech-tags">
                            {project.technologies.map((tech, index) => (
                                <span
                                    key={index}
                                    className="tech-tag"
                                    style={{ backgroundColor: tech.color || "#666" }}
                                >
                                    {tech.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="modal-features">
                        <h3 className="modal-features-title">{t.keyFeatures}</h3>
                        <ul className="modal-features">
                            {project.features[language].map((feature, index) => (
                                <li key={index} className={theme}>{feature}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="modal-buttons">
                        <button
                            className={`modal-button primary ${theme}`}
                            disabled={!project.githubUrl}
                            onClick={() => {
                                if (project.githubUrl) {
                                    window.open(project.githubUrl, "_blank");
                                }
                            }}
                        >
                            <Code size={18} />
                            {project.githubUrl ? t.viewCode : t.noRepoAvailable}
                        </button>

                        <button
                            className={`modal-button primary ${theme}`}
                            disabled={!project.demoUrl}
                            onClick={() => {
                                if (project.demoUrl) {
                                    window.open(project.demoUrl, "_blank");
                                }
                            }}
                        >
                            <ExternalLink size={18} />
                            {project.demoUrl ? t.liveDemo : t.noDemoAvailable}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default function Projects() {
    const { language } = useLanguage();
    const { theme } = useTheme();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Obtener textos traducidos
    const t = locales[language];

    // En un entorno real, estos datos vendrían de una API o CMS
    const projects = mockProjects;

    // Cerrar cualquier proyecto expandido cuando se hace clic fuera
    const handleBackdropClick = () => {
        setExpandedId(null);
    };

    const handleOpenProject = (projectId: string) => {
        if (expandedId === projectId) {
            setExpandedId(null);
        } else {
            setExpandedId(projectId);
        }
    };

    return (
        <section className={`projects-section ${theme}`} id="projects">
            <div className="projects-container">
                {/* Encabezado */}
                <div className="projects-header">
                    <h2 className="projects-title">{t.featuredProjects}</h2>
                    <div className={`projects-underline ${theme}`}></div>
                </div>

                {/* Descripción de proyectos - NUEVO */}
                <p className={`projects-description ${theme}`}>{t.projectsDescription}</p>

                {/* Grid de proyectos */}
                <div className="projects-grid">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            theme={theme}
                            language={language}
                            t={t}
                            onOpenModal={(project) => setSelectedProject(project)}
                            expanded={expandedId === project.id}
                            onToggleExpand={() => handleOpenProject(project.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Backdrop para cerrar proyectos expandidos */}
            <div
                className={`project-expand-backdrop ${expandedId ? 'visible' : ''}`}
                onClick={handleBackdropClick}
            />

            {/* Modal para mostrar detalles completos */}
            <AnimatePresence>
                {selectedProject && (
                    <ProjectModal
                        project={selectedProject}
                        theme={theme}
                        language={language}
                        t={t}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </AnimatePresence>

            <ScrollArrow targetId="contacto"/>
        </section>
    );
}