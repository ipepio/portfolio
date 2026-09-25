import { useEffect, useState, useRef } from "react";
import {
  ArrowUpRight,
  Menu,
  X,
  Github,
  Linkedin,
  Mail,
  Moon,
  Send,
  Sun,
  Building2,
  GraduationCap,
  Languages,
  Globe,
  Code2,
  Cloud,
  Sparkles,
  ShieldCheck,
  Database,
  Briefcase,
  Cpu,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguageHook";
import { useTheme } from "@/hooks/useThemeHook";
import isaacImage from "@/assets/isaac.png";
import {
  experienceData,
  skillsByCategory,
  education,
  languages,
} from "@/data/ExperienceData";
import useContactForm from "@/hooks/useContactForm";
import "./App.css";

/* ───────── data constants ───────── */

type Project = {
  number: string;
  name: string;
  eyebrow: string;
  context: string;
  description: string;
  stack: string[];
  href?: string;
};

const projects: Project[] = [
  {
    number: "01",
    name: "pi-hub",
    eyebrow: "Open source · Developer tooling",
    context:
      "A practical home for Pi workflows, extensions and experiments.",
    description:
      "A public project built around making AI-assisted development more useful, repeatable and easier to share.",
    stack: ["TypeScript", "React", "Open source"],
    href: "https://github.com/ipepio/pi-hub",
  },
  {
    number: "02",
    name: "Clash Hub",
    eyebrow: "Community platform · Product engineering",
    context:
      "A public web experience for connecting people around communities and events.",
    description:
      "A product-focused web platform where clear information architecture, accessible interaction and reliable delivery matter as much as the code behind them.",
    stack: ["TypeScript", "Web platform", "Product"],
    href: "https://github.com/clash-hub-org",
  },
];

type NavItem = [string, { es: string; en: string; ca: string }];

const navItems: NavItem[] = [
  ["hero", { es: "Inicio", en: "Home", ca: "Inici" }],
  ["experience", { es: "Experiencia", en: "Experience", ca: "Experiència" }],
  ["skills", { es: "Habilidades", en: "Skills", ca: "Habilitats" }],
  ["work", { es: "Proyectos", en: "Work", ca: "Projectes" }],
  ["about", { es: "Sobre mí", en: "About", ca: "Sobre mi" }],
  ["contact", { es: "Contacto", en: "Contact", ca: "Contacte" }],
];

/* ─── copy tables (es / en / ca) ─── */

const copy = {
  es: {
    role: "CTO · Ingeniero de software",
    years: "8+ años",
    based: "Desde Vinaròs",
    current: "Actualidad",
    heroStart: "Convierto ideas y problemas complejos en",
    heroAccent: "productos que funcionan.",
    lede:
      "CTO y Tech Lead con 8+ años en desarrollo de software, arquitectura de sistemas y liderazgo técnico. Foco actual: incorporar IA al ciclo de desarrollo y procesos internos.",
    experienceTitle: "De la implementación al liderazgo técnico.",
    experienceIntro:
      "He trabajado en industria, consultoría y empresas de producto. Ese recorrido me permite conectar negocio, producto, arquitectura, equipos y operaciones sin perder de vista lo importante: resolver bien el problema.",
    work: "Algunos proyectos en los que he colaborado",
    workTitle: "Una muestra del trabajo que sí puedo compartir.",
    workNote:
      "He participado y liderado muchos más productos, integraciones y plataformas. Por confidencialidad y propiedad intelectual no puedo enseñar gran parte de ese trabajo.",
    view: "Ver proyecto",
    selected: "proyecto público",
    skillsEyebrow: "Lo que hago",
    skillsTitle: "Habilidades técnicas por área.",
    skillsIntro:
      "Un perfil transversal que abarca desde el código hasta la infraestructura, pasando por la IA, la calidad y la seguridad.",
    aboutEyebrow: "Sobre mí",
    aboutTitle: "Pienso en sistemas y construyo producto.",
    aboutLede:
      "Ingeniero de telecomunicaciones con 8+ años de experiencia. He trabajado en consultoría, industria y empresas de producto donde el software es el centro.",
    aboutText:
      "Me gusta entender sistemas complejos y convertir requisitos ambiguos en soluciones prácticas y fiables. He liderado equipos, introducido metodologías ágiles y explorado cómo la IA puede transformar nuestra forma de construir software.",
    contactEyebrow: "Contacto",
    contactTitle: "¿Hablamos?",
    contactText:
      "Si tienes una idea, un reto técnico o simplemente quieres saludar, escríbeme.",
    cv: "Descargar CV",
    getInTouch: "Escríbeme",
    place: "Vinaròs, España",
    rights: "Todos los derechos reservados",
    educationTitle: "Formación",
    languagesTitle: "Idiomas",
    highlights: [
      ["8+", "años en software"],
      ["~20", "personas lideradas"],
      [">80%", "menos tiempo de despliegue"],
      ["5", "etapas profesionales"],
    ],
    systemMapLabels: ["IA", "Backend", "Cloud", "Ops", "Data", "QA"],
    projectLabels: ["Open source · Developer tooling", "Community platform · Product engineering"],
  },
  en: {
    role: "CTO · Software engineer",
    years: "8+ years",
    based: "Based in Vinaròs",
    current: "Present",
    heroStart: "I turn ideas and complex problems into",
    heroAccent: "products that work.",
    lede:
      "CTO and Tech Lead with 8+ years in software development, system architecture and technical leadership. Current focus: bringing AI into development cycles and internal processes.",
    experienceTitle: "From implementation to technical leadership.",
    experienceIntro:
      "I have worked across industry, consulting and product companies. That path helps me connect business, product, architecture, teams and operations while staying focused on solving the right problem.",
    work: "A few projects I've worked on",
    workTitle: "A small sample of the work I can share.",
    workNote:
      "I have contributed to and led many more products, integrations and platforms. Confidentiality and intellectual property mean most of that work cannot be shown publicly.",
    view: "View project",
    selected: "public project",
    skillsEyebrow: "Capabilities",
    skillsTitle: "Technical skills by area.",
    skillsIntro:
      "A cross-functional profile spanning code to infrastructure, via AI, quality and security.",
    aboutEyebrow: "About me",
    aboutTitle: "Systems thinker, product builder.",
    aboutLede:
      "Telecommunications engineer with 8+ years of experience. I have worked in consulting, industry and product companies where software is at the core.",
    aboutText:
      "I enjoy understanding complex systems and turning ambiguous requirements into practical, reliable solutions. I have led teams, introduced agile methodologies and explored how AI can transform the way we build software.",
    contactEyebrow: "Contact",
    contactTitle: "Let's talk.",
    contactText:
      "Have an idea, a technical challenge or just want to say hello? Drop me a line.",
    cv: "Download CV",
    getInTouch: "Get in touch",
    place: "Vinaròs, Spain",
    rights: "All rights reserved",
    educationTitle: "Education",
    languagesTitle: "Languages",
    highlights: [
      ["8+", "years in software"],
      ["~20", "people led"],
      [">80%", "less deployment time"],
      ["5", "career stages"],
    ],
    systemMapLabels: ["AI", "Backend", "Cloud", "Ops", "Data", "QA"],
    projectLabels: ["Open source · Developer tooling", "Community platform · Product engineering"],
  },
  ca: {
    role: "CTO · Enginyer de software",
    years: "8+ anys",
    based: "Des de Vinaròs",
    current: "Actualitat",
    heroStart: "Convertisc idees i problemes complexos en",
    heroAccent: "productes que funcionen.",
    lede:
      "CTO i Tech Lead amb 8+ anys en desenvolupament de software, arquitectura de sistemes i lideratge tècnic. Foc actual: incorporar IA al cicle de desenvolupament i processos interns.",
    experienceTitle: "De la implementació al lideratge tècnic.",
    experienceIntro:
      "He treballat en indústria, consultoria i empreses de producte. Este recorregut em permet connectar negoci, producte, arquitectura, equips i operacions sense perdre de vista el problema.",
    work: "Alguns projectes en què he col·laborat",
    workTitle: "Una mostra del treball que puc compartir.",
    workNote:
      "He participat i liderat molts més productes, integracions i plataformes. Per confidencialitat i propietat intel·lectual, gran part d'eixe treball no es pot mostrar públicament.",
    view: "Veure projecte",
    selected: "projecte públic",
    skillsEyebrow: "Què faig",
    skillsTitle: "Habilitats tècniques per àrea.",
    skillsIntro:
      "Un perfil transversal que abarca des del codi fins a la infraestructura, passant per la IA, la qualitat i la seguretat.",
    aboutEyebrow: "Sobre mi",
    aboutTitle: "Pense en sistemes i construïsc producte.",
    aboutLede:
      "Enginyer de telecomunicacions amb 8+ anys d'experiència. He treballat en consultoria, indústria i empreses de producte on el software és el centre.",
    aboutText:
      "M'agrada entendre sistemes complexos i convertir requisits ambigus en solucions pràctiques i fiables. He liderat equips, introduït metodologies àgils i explorat com la IA pot transformar la nostra manera de construir software.",
    contactEyebrow: "Contacte",
    contactTitle: "Parlem?",
    contactText:
      "Tens una idea o un repte tècnic? Escriu-me. Sempre m'agrada conéixer projectes interessants.",
    cv: "Descarregar CV",
    getInTouch: "Escriu-me",
    place: "Vinaròs, Espanya",
    rights: "Tots els drets reservats",
    educationTitle: "Formació",
    languagesTitle: "Idiomes",
    highlights: [
      ["8+", "anys en software"],
      ["~20", "persones liderades"],
      [">80%", "menys temps de desplegament"],
      ["5", "etapes professionals"],
    ],
    systemMapLabels: ["IA", "Backend", "Cloud", "Ops", "Data", "QA"],
    projectLabels: ["Open source · Developer tooling", "Community platform · Product engineering"],
  },
} as const;

/* ── formCopy (es / en / ca) ── */

const formCopy = {
  es: {
    name: "Nombre",
    namePlaceholder: "¿Cómo te llamas?",
    email: "Email",
    emailPlaceholder: "tu@email.com",
    subject: "Asunto",
    subjectPlaceholder: "¿De qué quieres hablar?",
    message: "Mensaje",
    messagePlaceholder: "Cuéntame un poco...",
    send: "Enviar mensaje",
    sending: "Enviando...",
    success: "Mensaje enviado. Te responderé lo antes posible.",
    error:
      "No se ha podido enviar. Puedes escribirme directamente a isaac@ipepio.dev.",
    validation: {
      nameRequired: "Escribe tu nombre",
      emailRequired: "Escribe tu email",
      emailInvalid: "Revisa el formato del email",
      subjectRequired: "Escribe un asunto",
      messageRequired: "Escribe un mensaje",
    },
  },
  en: {
    name: "Name",
    namePlaceholder: "What's your name?",
    email: "Email",
    emailPlaceholder: "you@email.com",
    subject: "Subject",
    subjectPlaceholder: "What would you like to discuss?",
    message: "Message",
    messagePlaceholder: "Tell me a little more...",
    send: "Send message",
    sending: "Sending...",
    success: "Message sent. I'll get back to you shortly.",
    error:
      "The message could not be sent. You can email me directly at isaac@ipepio.dev.",
    validation: {
      nameRequired: "Enter your name",
      emailRequired: "Enter your email",
      emailInvalid: "Check the email format",
      subjectRequired: "Enter a subject",
      messageRequired: "Enter a message",
    },
  },
  ca: {
    name: "Nom",
    namePlaceholder: "Com et dius?",
    email: "Email",
    emailPlaceholder: "tu@email.com",
    subject: "Assumpte",
    subjectPlaceholder: "De què vols parlar?",
    message: "Missatge",
    messagePlaceholder: "Conta'm un poc...",
    send: "Enviar missatge",
    sending: "Enviant...",
    success: "Missatge enviat. Et respondré prompte.",
    error:
      "No s'ha pogut enviar. Pots escriure'm directament a isaac@ipepio.dev.",
    validation: {
      nameRequired: "Escriu el teu nom",
      emailRequired: "Escriu el teu email",
      emailInvalid: "Revisa el format de l'email",
      subjectRequired: "Escriu un assumpte",
      messageRequired: "Escriu un missatge",
    },
  },
};

/* ── icon map for skill categories ── */

const categoryIcons: Record<string, React.ReactNode> = {
  "Backend & Architecture": <Code2 size={18} />,
  "Cloud & DevOps": <Cloud size={18} />,
  "Artificial Intelligence": <Sparkles size={18} />,
  "Quality & Security": <ShieldCheck size={18} />,
  Databases: <Database size={18} />,
  "Enterprise & SAP": <Briefcase size={18} />,
  Engineering: <Cpu size={18} />,
};

/* ── section component ── */

function RevealSection({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section className="reveal-section" id={id} aria-label={id}>
      <div className="section-inner">{children}</div>
    </section>
  );
}

/* ── main app ── */

function App() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const t = copy[language];
  const f = formCopy[language];

  /* ── theme sync: apply data-theme to documentElement ── */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const {
    formData,
    formErrors,
    formStatus,
    handleChange,
    handleSubmit,
  } = useContactForm(f.validation);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [progress, setProgress] = useState(0);
  const [navHidden, setNavHidden] = useState(false);

  const scrollYRef = useRef(0);
  const NAV_HIDE_THRESHOLD = 100;
  const SECTION_OFFSET = 140;

  /* scroll tracking (uses ref, no dep array churn) */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (y / max) * 100 : 0);

      /* sticky nav hide/show — guard when mobile menu is open */
      if (!menuOpen) {
        if (y > NAV_HIDE_THRESHOLD && y > scrollYRef.current) {
          setNavHidden(true);
        } else {
          setNavHidden(false);
        }
      }
      scrollYRef.current = y;

      /* active section */
      const sections = [
        "hero",
        ...navItems.map(([id]) => id),
      ];
      let visible = "hero";
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el && y >= el.offsetTop - SECTION_OFFSET) visible = id;
      });
      setActiveSection(visible);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  /* reveal observer */
  useEffect(() => {
    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            reveal.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px" }
    );
    document
      .querySelectorAll(".reveal")
      .forEach((el) => reveal.observe(el));
    return () => reveal.disconnect();
  }, []);

  /* body scroll lock when mobile menu is open */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site" data-theme={theme}>
      {/* scroll progress */}
      <div className="scroll-progress" style={{ width: `${progress}%` }} />

      {/* ────── NAV ────── */}
      <nav
        className={`site-nav ${navHidden ? "nav-hidden" : ""}`}
        aria-label="Main navigation"
      >
        <div className="nav-inner">
          <a className="brand" href="#hero" onClick={closeMenu}>
            <span className="brand-text">Isaac P.</span>
          </a>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className={`nav-links ${menuOpen ? "is-open" : ""}`}>
            {navItems.map(([id, labels]) => (
              <a
                key={id}
                className={activeSection === id ? "active" : ""}
                href={`#${id}`}
                onClick={closeMenu}
              >
                {labels[language]}
              </a>
            ))}

            <label className="language-picker" aria-label="Select language">
              <span className="sr-only">Idioma</span>
              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value as "es" | "en" | "ca")
                }
              >
                <option value="es">ES</option>
                <option value="en">EN</option>
                <option value="ca">CA</option>
              </select>
            </label>

            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <a
              className="nav-cta"
              href="#contact"
              onClick={closeMenu}
            >
              {t.getInTouch}{" "}
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </nav>

      {/* ────── MAIN CONTENT ────── */}
      <main>
        {/* ────── HERO ────── */}
        <RevealSection id="hero">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                {t.based} · {t.role}
              </p>
              <h1>
                {t.heroStart}{" "}
                <em className="gradient-text">{t.heroAccent}</em>
              </h1>
              <p className="hero-lede">{t.lede}</p>

              <div className="hero-meta">
                {t.highlights.map(([val, label]) => (
                  <span key={label} className="meta-chip">
                    <strong>{val}</strong>
                    <span>{label}</span>
                  </span>
                ))}
              </div>

              <div className="actions">
                <a
                  className="button button-dark"
                  href="#experience"
                  onClick={closeMenu}
                >
                  {t.experienceTitle.split(".")[0]}{" "}
                  <ArrowUpRight size={14} strokeWidth={2.5} />
                </a>
                <a
                  className="button button-soft"
                  href="#contact"
                  onClick={closeMenu}
                >
                  {t.getInTouch}
                </a>
              </div>
            </div>

            {/* system diagram */}
            <div className="system-map" aria-label="System diagram">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="orbit orbit-three" />
              {/* connecting lines */}
              <svg
                className="map-lines"
                viewBox="0 0 400 400"
                fill="none"
              >
                <line x1="200" y1="60" x2="200" y2="340" stroke="var(--line)" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4" />
                <line x1="80" y1="160" x2="320" y2="240" stroke="var(--line)" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4" />
                <line x1="320" y1="160" x2="80" y2="240" stroke="var(--line)" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4" />
              </svg>
              {/* nodes */}
              <div className="map-node node-ai" aria-label="AI">
                <Sparkles size={14} />
              </div>
              <div className="map-node node-backend" aria-label="Backend">
                <Code2 size={14} />
              </div>
              <div className="map-node node-cloud" aria-label="Cloud">
                <Cloud size={14} />
              </div>
              <div className="map-node node-ops" aria-label="Ops">
                <Cpu size={14} />
              </div>
              <div className="map-node node-data" aria-label="Data">
                <Database size={14} />
              </div>
              <div className="map-node node-quality" aria-label="Quality">
                <ShieldCheck size={14} />
              </div>
              <div className="map-core" aria-hidden="true" />
              {/* labels — trilingual from copy */}
              <div className="map-label label-ai">{t.systemMapLabels[0]}</div>
              <div className="map-label label-backend">{t.systemMapLabels[1]}</div>
              <div className="map-label label-cloud">{t.systemMapLabels[2]}</div>
              <div className="map-label label-ops">{t.systemMapLabels[3]}</div>
              <div className="map-label label-data">{t.systemMapLabels[4]}</div>
              <div className="map-label label-quality">{t.systemMapLabels[5]}</div>
            </div>
          </div>
        </RevealSection>

        {/* ────── EXPERIENCE ────── */}
        <RevealSection id="experience">
          <div className="experience-header">
            <p className="eyebrow">
              {navItems[1][1][language]}
            </p>
            <h2>{t.experienceTitle}</h2>
            <p className="section-subtitle">{t.experienceIntro}</p>
          </div>

          <div className="experience-timeline">
            {experienceData.map((exp, idx) => (
              <article
                key={exp.id}
                className={`experience-card reveal ${
                  exp.isCurrent ? "is-current" : ""
                }`}
                style={{ animationDelay: `${idx * 0.12}s` }}
              >
                <div className="exp-marker">
                  {exp.isCurrent && <span className="pulse" />}
                </div>
                <div className="exp-content">
                  <div className="exp-header">
                    <h3>{exp.company}</h3>
                    {exp.isCurrent && (
                      <span className="current-badge">
                        {t.current}
                      </span>
                    )}
                  </div>
                  <p className="exp-role">{exp.position[language]}</p>
                  <div className="exp-meta">
                    {exp.location && (
                      <span className="exp-location">
                        <Globe size={12} />{" "}
                        {exp.location[language]}
                      </span>
                    )}
                    <span className="exp-date">
                      {exp.period[language]}
                    </span>
                  </div>
                  <p className="exp-desc">{exp.description[language]}</p>
                </div>
              </article>
            ))}
          </div>
        </RevealSection>

        {/* ────── SKILLS ────── */}
        <RevealSection id="skills">
          <div className="skills-header">
            <p className="eyebrow">
              {t.skillsEyebrow}
            </p>
            <h2>{t.skillsTitle}</h2>
            <p className="section-subtitle">
              {t.skillsIntro}
            </p>
          </div>

          <div className="skills-grid">
            {Object.entries(skillsByCategory).map(
              ([cat, items]) => (
                <div
                  key={cat}
                  className={`skill-category reveal`}
                >
                  <div className="skill-cat-header">
                    <span className="skill-cat-icon">
                      {categoryIcons[cat] || <Code2 size={18} />}
                    </span>
                    <h3>{cat}</h3>
                  </div>
                  <div className="skill-tags">
                    {items.map((item) => (
                      <span key={item} className="skill-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </RevealSection>

        {/* ────── WORK / PROJECTS ────── */}
        <RevealSection id="work">
          <div className="work-header">
            <p className="eyebrow">{t.work}</p>
            <h2>{t.workTitle}</h2>
            <p className="section-subtitle">{t.workNote}</p>
          </div>

          {projects.map((project) => (
            <article
              key={project.number}
              className={`project-card reveal project-${project.number}`}
            >
              <div className="project-info">
                <span className="project-number">
                  {project.number}
                </span>
                <p className="project-eyebrow">
                  {project.eyebrow}
                </p>
                <h3>{project.name}</h3>
                <p className="project-context">
                  {project.context}
                </p>
                <p className="project-description">
                  {project.description}
                </p>
                <div className="stack">
                  {project.stack.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
                {project.href && (
                  <a
                    className="text-link"
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t.view}{" "}
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </a>
                )}
              </div>
              <div className={`project-visual visual-${project.number}`}>
                <div className="visual-grid" />
                <span className="vis-number">{project.number}</span>
                <span className="vis-name">{project.name}</span>
              </div>
            </article>
          ))}
        </RevealSection>

        {/* ────── ABOUT ────── */}
        <RevealSection id="about">
          <div className="about-grid">
            <div className="about-portrait">
              <img
                className="portrait"
                src={isaacImage}
                alt="Isaac Pepió"
              />
              <p className="caption">
                {t.place} · {t.current}
              </p>
            </div>

            <div className="about-content">
              <p className="eyebrow">
                {t.aboutEyebrow}
              </p>
              <h2>{t.aboutTitle}</h2>
              <p className="about-lede">
                {t.aboutLede}
              </p>
              <p>
                {t.aboutText}
              </p>

              {/* education */}
              <div className="edu-card reveal">
                <GraduationCap size={18} />
                <div>
                  <p className="edu-degree">
                    {education.degree[language]}
                  </p>
                  <p className="edu-school">
                    {education.institution[language]}
                  </p>
                  <p className="edu-honor">
                    {education.honor[language]}
                  </p>
                </div>
              </div>

              {/* languages */}
              <div className="lang-card reveal">
                <Languages size={18} />
                <div>
                  <h4>{t.languagesTitle}</h4>
                  <div className="lang-list">
                    {languages.map((l) => (
                      <span key={l.name.en} className="lang-tag">
                        {l.name[language]} · {l.level[language]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ────── CONTACT ────── */}
        <RevealSection id="contact">
          <div className="contact-grid">
            <div className="contact-copy">
              <p className="eyebrow">
                {t.contactEyebrow}
              </p>
              <h2>{t.contactTitle}</h2>
              <p>{t.contactText}</p>

              <div className="contact-links">
                <a
                  href="mailto:isaac@ipepio.dev"
                  className="contact-link"
                >
                  <Mail size={16} />
                  <span>isaac@ipepio.dev</span>
                </a>
                <a
                  href="tel:+34657098798"
                  className="contact-link"
                >
                  <Building2 size={16} />
                  <span>+34 657 098 798</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/ipepio"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link"
                >
                  <Linkedin size={16} />
                  <span>linkedin.com/in/ipepio</span>
                </a>
                <a
                  href="https://github.com/ipepio"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link"
                >
                  <Github size={16} />
                  <span>github.com/ipepio</span>
                </a>
              </div>

              <a
                className="cv-download"
                href="/CV_Isaac_Pepió.pdf"
                download
              >
                {t.cv}{" "}
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </a>
            </div>

            <form
              className="contact-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="form-pair">
                <label>
                  {f.name}
                  <input
                    id="form-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={f.namePlaceholder}
                    aria-invalid={Boolean(formErrors.name)}
                    aria-describedby={formErrors.name ? "form-name-error" : undefined}
                  />
                  {formErrors.name && (
                    <small id="form-name-error" className="form-error">
                      {formErrors.name}
                    </small>
                  )}
                </label>
                <label>
                  {f.email}
                  <input
                    id="form-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={f.emailPlaceholder}
                    aria-invalid={Boolean(formErrors.email)}
                    aria-describedby={formErrors.email ? "form-email-error" : undefined}
                  />
                  {formErrors.email && (
                    <small id="form-email-error" className="form-error">
                      {formErrors.email}
                    </small>
                  )}
                </label>
              </div>
              <label>
                {f.subject}
                <input
                  id="form-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={f.subjectPlaceholder}
                  aria-invalid={Boolean(formErrors.subject)}
                  aria-describedby={formErrors.subject ? "form-subject-error" : undefined}
                />
                {formErrors.subject && (
                  <small id="form-subject-error" className="form-error">
                    {formErrors.subject}
                  </small>
                )}
              </label>
              <label>
                {f.message}
                <textarea
                  id="form-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={f.messagePlaceholder}
                  rows={5}
                  aria-invalid={Boolean(formErrors.message)}
                  aria-describedby={formErrors.message ? "form-message-error" : undefined}
                />
                {formErrors.message && (
                  <small id="form-message-error" className="form-error">
                    {formErrors.message}
                  </small>
                )}
              </label>
              <button type="submit" disabled={formStatus === "loading"}>
                {formStatus === "loading"
                  ? f.sending
                  : f.send}
                <Send size={15} strokeWidth={2.5} />
              </button>
              {formStatus === "success" && (
                <p className="form-status success" role="status" aria-live="polite">
                  {f.success}
                </p>
              )}
              {formStatus === "error" && (
                <p className="form-status error" role="status" aria-live="assertive">
                  {f.error}
                </p>
              )}
            </form>
          </div>
        </RevealSection>
      </main>

      {/* ────── FOOTER ────── */}
      <footer>
        © {new Date().getFullYear()} Isaac Pepió · {t.rights}
      </footer>
    </div>
  );
}

export default App;
