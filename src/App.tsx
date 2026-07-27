import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X, Github, Linkedin, Mail, Moon, Send, Sun } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguageHook";
import { useTheme } from "@/hooks/useThemeHook";
import isaacImage from "@/assets/isaac.png";
import { experienceData } from "@/data/ExperienceData";
import useContactForm from "@/hooks/useContactForm";
import "./App.css";

type Project = {
  number: string;
  name: string;
  eyebrow: string;
  context: string;
  description: string;
  stack: string[];
  href?: string;
  image?: string;
};

const projects: Project[] = [
  {
    number: "01",
    name: "pi-hub",
    eyebrow: "Open source · Developer tooling",
    context: "A practical home for Pi workflows, extensions and experiments.",
    description: "A public project built around making AI-assisted development more useful, repeatable and easier to share. The kind of tool that grows from real problems and stays close to its users.",
    stack: ["TypeScript", "React", "Open source"],
    href: "https://github.com/ipepio/pi-hub",
  },
  {
    number: "02",
    name: "Clash Hub",
    eyebrow: "Community platform · Product engineering",
    context: "A public web experience for connecting people around communities and events.",
    description: "A product-focused web platform where clear information architecture, accessible interaction and reliable delivery matter as much as the code behind them.",
    stack: ["TypeScript", "Web platform", "Product"],
    href: "https://github.com/clash-hub-org",
  },
];

const navItems = [
  ["experience", { es: "Experiencia", en: "Experience", ca: "Experiència" }],
  ["work", { es: "Proyectos", en: "Work", ca: "Projectes" }],
  ["capabilities", { es: "Lo que hago", en: "Capabilities", ca: "Què faig" }],
  ["about", { es: "Sobre mí", en: "About", ca: "Sobre mi" }],
  ["contact", { es: "Contacto", en: "Contact", ca: "Contacte" }],
] as const;

const copy = {
  es: {
    heroStart: "Convierto ideas y problemas complejos en", heroAccent: "productos que funcionan.", lede: "Llevo más de nueve años creando software, definiendo arquitecturas y liderando equipos. Ahora también estoy explorando SDD, agentes de IA y nuevas formas de trabajar para construir mejor software, sin perder de vista el problema completo ni la producción.", experience: "Trayectoria", experienceTitle: "De la implementación al liderazgo técnico.", experienceIntro: "He trabajado en industria, consultoría y empresas de producto. Ese recorrido me permite conectar negocio, producto, arquitectura, equipos y operaciones sin perder de vista lo importante: resolver bien el problema.", work: "Algunos proyectos en los que he colaborado", workTitle: "Una pequeña muestra del trabajo que sí puedo compartir.", workNote: "He participado y liderado muchos más productos, integraciones y plataformas. Por confidencialidad y propiedad intelectual no puedo enseñar gran parte de ese trabajo, así que aquí recojo únicamente algunos proyectos públicos o personales.", view: "Ver proyecto", selected: "proyecto público", capabilities: "Lo que hago", capabilitiesTitle: "Me hago cargo del sistema completo, de la idea a producción.", principles: "Principios de ingeniería", principlesTitle: "Así trabajo los sistemas.", about: "Sobre mí", aboutTitle: "Pienso en sistemas y construyo producto.", contact: "Contacto", contactTitle: "¿Hablamos?", contactText: "Si tienes una idea, un reto técnico o simplemente quieres saludar, escríbeme. Siempre me apetece conocer proyectos interesantes.", cv: "Descargar CV", getInTouch: "Escríbeme", based: "Desde Vinaròs", current: "Actualidad", role: "CTO · Ingeniero de software", years: "9+ años", place: "Vinaròs, España", rights: "Todos los derechos reservados", system: ["Producto", "Código", "Infra", "Datos", "Ops", "Sistema"],
    projects: ["Open source · Herramientas para desarrollo", "Plataforma comunitaria · Producto digital", "Un espacio práctico para flujos de trabajo, extensiones y experimentos con Pi.", "Un proyecto público para hacer el desarrollo asistido por IA más útil, repetible y fácil de compartir.", "Una comunidad open source alrededor de Clash.", "Una plataforma web donde la información clara, las interacciones accesibles y una entrega fiable importan tanto como el código."],
    highlights: [["9+", "años desarrollando software"], ["6", "etapas entre industria, consultoría y producto"], ["80%", "menos tiempo de despliegue con CI/CD"], ["360°", "producto, software, equipos y operaciones"]],
    caps: [
      { title: "Liderazgo técnico", description: "Conecto las necesidades de negocio y producto con decisiones técnicas que el equipo pueda ejecutar y mantener.", items: ["Estrategia tecnológica", "Roadmaps y priorización", "Arquitectura y estándares", "Revisiones técnicas", "Coordinación de equipos", "Mentoring y ownership"] },
      { title: "Producto y desarrollo full-stack", description: "Convierto necesidades poco definidas en productos utilizables, desde la experiencia de usuario hasta el backend.", items: ["Plataformas SaaS", "Arquitectura de producto", "Aplicaciones web y backoffices", "APIs, autenticación y permisos", "Sistemas multi-tenant", "Integraciones"] },
      { title: "Arquitectura e integraciones", description: "Diseño sistemas que conectan plataformas, dispositivos y fuentes de datos sin crear complejidad innecesaria.", items: ["Sistemas distribuidos", "Servicios orientados a eventos", "APIs y webhooks", "Integraciones externas", "Modelado de datos", "PostgreSQL"] },
      { title: "Plataforma y operaciones", description: "Para mí, desplegar, observar y recuperar un sistema forma parte del producto, no es el paso final.", items: ["Docker y Kubernetes", "Infraestructura Linux", "Cloud y AWS", "CI/CD y automatización", "Observabilidad", "Rendimiento y escalabilidad"] },
      { title: "IA, automatización y hardware", description: "Exploro cómo aplicar IA y automatización a problemas concretos, evitando añadir tecnología donde no aporta valor.", items: ["Integraciones con LLM y agentes", "RAG e inferencia local", "Software conectado con hardware"] },
      { title: "Sistemas empresariales", description: "Mi etapa en industria y consultoría me dio una visión práctica de procesos críticos, logística y cambios a gran escala.", items: ["SAP WM/EWM y procesos logísticos", "Implantaciones y evolutivos", "Requisitos, puesta en marcha y soporte"] }
    ],
    principlesList: [
      ["Primero entender, después construir.", "Antes de elegir tecnología necesito entender el problema, quién lo tiene y cómo sabremos que está resuelto."],
      ["La complejidad se gana.", "Empiezo por la solución más sencilla que pueda evolucionar. Cada servicio, dependencia o abstracción debe justificar su coste."],
      ["Producción también es producto.", "Despliegue, seguridad, observabilidad, documentación y recuperación se diseñan desde el principio."],
      ["Los fallos deben ser visibles y recuperables.", "Un sistema fiable no es el que nunca falla, sino el que permite detectar, entender y resolver el fallo con rapidez."],
      ["Automatizar para quitar fricción.", "Si una tarea se repite y una máquina puede hacerla mejor, la convierto en una herramienta, un pipeline o un proceso automático."],
      ["El conocimiento debe quedarse en el equipo.", "Prefiero decisiones explicables, código mantenible y equipos con autonomía antes que soluciones brillantes que dependan de una persona."]
    ],
    aboutText: ["Soy ingeniero de telecomunicaciones y llevo más de nueve años desarrollando software. He trabajado en consultoría, industria y empresas tecnológicas donde el software es el producto, y actualmente estoy incorporando SDD, agentes de IA y automatización a mi forma de trabajar.", "Me gusta entender sistemas complejos y convertir requisitos ambiguos en soluciones prácticas y fiables. Me importa tanto la infraestructura y las operaciones como el código.", "También he liderado equipos, introducido metodologías ágiles y creado entornos donde la gente puede hacer su mejor trabajo."]
  },
  en: {
    heroStart: "I turn ideas and complex problems into", heroAccent: "products that work.", lede: "For more than nine years I have been building software, defining architectures and leading teams. I am also exploring SDD, AI agents and new ways of working to build better software without losing sight of the whole problem or production.", experience: "Trajectory", experienceTitle: "From implementation to technical leadership.", experienceIntro: "I have worked across industry, consulting and product companies. That path helps me connect business, product, architecture, teams and operations while staying focused on solving the right problem.", work: "A few projects I've worked on", workTitle: "A small sample of the work I can share.", workNote: "I have contributed to and led many more products, integrations and platforms. Confidentiality and intellectual property mean most of that work cannot be shown publicly, so this is intentionally a small selection.", view: "View project", selected: "public project", capabilities: "Capabilities", capabilitiesTitle: "Full-system ownership, from concept to operations.", principles: "Engineering principles", principlesTitle: "How I approach systems.", about: "About", aboutTitle: "Systems thinker, product builder.", contact: "Contact", contactTitle: "Let's talk.", contactText: "Have an idea, a technical challenge or just want to say hello? Drop me a line. I enjoy meeting interesting projects.", cv: "Download CV", getInTouch: "Get in touch", based: "Based in Vinaròs", current: "Present", role: "CTO · Software engineer", years: "9+ years", place: "Vinaròs, Spain", rights: "All rights reserved", system: ["Product", "Code", "Infra", "Data", "Ops", "System"],
    projects: ["Open source · Developer tooling", "Community platform · Product engineering", "A practical home for Pi workflows, extensions and experiments.", "A public project for making AI-assisted development more useful, repeatable and easier to share.", "An open-source community built around Clash.", "A web platform where clear information architecture, accessible interaction and reliable delivery matter as much as the code."],
    highlights: [["9+", "years building software"], ["6", "roles across industry, consulting and product"], ["80%", "less deployment time through CI/CD"], ["360°", "product, software, teams and operations"]],
    caps: [
      { title: "Technical leadership", description: "I connect business and product needs with technical decisions a team can execute and maintain.", items: ["Technology strategy", "Roadmaps and prioritisation", "Architecture and standards", "Technical reviews", "Team coordination", "Mentoring and ownership"] },
      { title: "Product & full-stack engineering", description: "I turn loosely defined needs into usable products, from the user experience through the backend.", items: ["SaaS platforms", "Product architecture", "Web applications and back offices", "APIs, authentication and permissions", "Multi-tenant systems", "Integrations"] },
      { title: "Architecture & integrations", description: "I design systems that connect platforms, devices and data without creating unnecessary complexity.", items: ["Distributed systems", "Event-driven services", "APIs and webhooks", "External integrations", "Data modelling", "PostgreSQL"] },
      { title: "Platform & operations", description: "Shipping, observing and recovering a system are part of the product rather than a final step.", items: ["Docker and Kubernetes", "Linux infrastructure", "Cloud and AWS", "CI/CD and automation", "Observability", "Performance and scaling"] },
      { title: "AI, automation & hardware", description: "I apply AI and automation to concrete problems without adding technology where it brings no value.", items: ["LLM integrations and agents", "RAG and local inference", "Software connected to hardware"] },
      { title: "Enterprise systems", description: "Industry and consulting gave me a practical view of critical processes, logistics and large-scale change.", items: ["SAP WM/EWM and logistics", "Implementations and system improvements", "Requirements, go-live and support"] }
    ],
    principlesList: [
      ["Understand first, build second.", "Before choosing technology I need to understand the problem, who has it and how we will know it is solved."],
      ["Complexity must be earned.", "I start with the simplest solution that can evolve. Every service, dependency and abstraction must justify its cost."],
      ["Production is part of the product.", "Deployment, security, observability, documentation and recovery are designed from the beginning."],
      ["Failures should be visible and recoverable.", "A reliable system is not one that never fails, but one that makes failures quick to detect, understand and resolve."],
      ["Automate away friction.", "If a task repeats and a machine can do it better, I turn it into a tool, pipeline or automated process."],
      ["Knowledge should stay with the team.", "I value explainable decisions, maintainable code and autonomous teams over clever solutions owned by one person."]
    ],
    aboutText: ["I am a telecommunications engineer with over nine years of experience in software development. I have worked in consulting, industrial companies and technology startups where software is the product, and I am currently bringing SDD, AI agents and automation into my way of working.", "I enjoy understanding complex systems and turning ambiguous requirements into practical, reliable solutions. I care as much about infrastructure and operations as I do about code.", "Beyond development, I have led teams, introduced agile methodologies and built environments where engineers can do their best work."]
  },
  ca: {
    heroStart: "Convertisc idees i problemes complexos en", heroAccent: "productes que funcionen.", lede: "Fa més de nou anys que cree software, definisc arquitectures i lidere equips. També estic explorant SDD, agents d'IA i noves formes de treballar per construir millor software sense perdre de vista el problema complet ni la producció.", experience: "Trajectòria", experienceTitle: "De la implementació al lideratge tècnic.", experienceIntro: "He treballat en indústria, consultoria i empreses de producte. Este recorregut em permet connectar negoci, producte, arquitectura, equips i operacions sense perdre de vista el problema.", work: "Alguns projectes en què he col·laborat", workTitle: "Una mostra del treball que puc compartir.", workNote: "He participat i liderat molts més productes, integracions i plataformes. Per confidencialitat i propietat intel·lectual, gran part d'eixe treball no es pot mostrar públicament.", view: "Veure projecte", selected: "projecte públic", capabilities: "Què faig", capabilitiesTitle: "M'encarrego de tot el sistema, de la idea a producció.", principles: "Principis d'enginyeria", principlesTitle: "Així treballe els sistemes.", about: "Sobre mi", aboutTitle: "Pense en sistemes i construïsc producte.", contact: "Contacte", contactTitle: "Parlem?", contactText: "Tens una idea o un repte tècnic? Escriu-me. Sempre m'agrada conéixer projectes interessants.", cv: "Descarregar CV", getInTouch: "Escriu-me", based: "Des de Vinaròs", current: "Actualitat", role: "CTO · Enginyer de software", years: "9+ anys", place: "Vinaròs", rights: "Tots els drets reservats", system: ["Producte", "Codi", "Infra", "Dades", "Ops", "Sistema"],
    projects: ["Open source · Eines per al desenvolupament", "Plataforma comunitària · Producte digital", "Un espai pràctic per a fluxos de treball, extensions i experiments amb Pi.", "Un projecte públic per fer més útil i compartible el desenvolupament assistit per IA.", "Una comunitat open source al voltant de Clash.", "Una plataforma web on la informació clara, les interaccions accessibles i una entrega fiable són tan importants com el codi."],
    highlights: [["9+", "anys desenvolupant software"], ["6", "etapes entre indústria, consultoria i producte"], ["80%", "menys temps de desplegament amb CI/CD"], ["360°", "producte, software, equips i operacions"]],
    caps: [
      { title: "Lideratge tècnic", description: "Connecte negoci i producte amb decisions tècniques que l'equip puga executar i mantindre.", items: ["Estratègia tecnològica", "Roadmaps i priorització", "Arquitectura i estàndards", "Revisions tècniques", "Coordinació d'equips", "Mentoring i ownership"] },
      { title: "Producte i desenvolupament full-stack", description: "Convertisc necessitats poc definides en productes útils, des de l'experiència d'usuari fins al backend.", items: ["Plataformes SaaS", "Arquitectura de producte", "Aplicacions web i backoffices", "APIs, autenticació i permisos", "Sistemes multi-tenant", "Integracions"] },
      { title: "Arquitectura i integracions", description: "Dissenye sistemes que connecten plataformes, dispositius i dades sense crear complexitat innecessària.", items: ["Sistemes distribuïts", "Serveis orientats a esdeveniments", "APIs i webhooks", "Integracions externes", "Modelatge de dades", "PostgreSQL"] },
      { title: "Plataforma i operacions", description: "Desplegar, observar i recuperar un sistema forma part del producte, no és el pas final.", items: ["Docker i Kubernetes", "Infraestructura Linux", "Cloud i AWS", "CI/CD i automatització", "Observabilitat", "Rendiment i escalabilitat"] },
      { title: "IA, automatització i hardware", description: "Aplique IA i automatització a problemes concrets, sense afegir tecnologia quan no aporta valor.", items: ["Integracions amb LLM i agents", "RAG i inferència local", "Software connectat amb hardware"] },
      { title: "Sistemes empresarials", description: "La indústria i la consultoria em van donar una visió pràctica de processos crítics, logística i canvis a gran escala.", items: ["SAP WM/EWM i processos logístics", "Implantacions i evolutius", "Requisits, posada en marxa i suport"] }
    ],
    principlesList: [
      ["Primer entendre, després construir.", "Abans de triar tecnologia necessite entendre el problema, qui el té i com sabrem que està resolt."],
      ["La complexitat s'ha de guanyar.", "Comence per la solució més senzilla que puga evolucionar. Cada dependència i abstracció ha de justificar el seu cost."],
      ["Producció també és producte.", "Desplegament, seguretat, observabilitat, documentació i recuperació es dissenyen des del principi."],
      ["Les fallades han de ser visibles i recuperables.", "Un sistema fiable permet detectar, entendre i resoldre els errors amb rapidesa."],
      ["Automatitzar per eliminar fricció.", "Si una tasca es repeteix, la convertisc en una eina, un pipeline o un procés automàtic."],
      ["El coneixement ha de quedar-se en l'equip.", "Preferisc decisions explicables, codi mantenible i equips autònoms a solucions que depenguen d'una persona."]
    ],
    aboutText: ["Soc enginyer de telecomunicacions i fa més de nou anys que desenvolupe software. He treballat en consultoria, indústria i empreses tecnològiques, i actualment incorpore SDD, agents d'IA i automatització a la meua manera de treballar.", "M'agrada entendre sistemes complexos i convertir requisits ambigus en solucions pràctiques i fiables. M'importen tant la infraestructura i les operacions com el codi.", "També he liderat equips, introduït metodologies àgils i creat entorns on la gent pot fer la seua millor feina."]
  }
} as const;

const contactCopy = {
  es: {
    name: "Nombre", namePlaceholder: "¿Cómo te llamas?", email: "Email", emailPlaceholder: "tu@email.com", subject: "Asunto", subjectPlaceholder: "¿De qué quieres hablar?", message: "Mensaje", messagePlaceholder: "Cuéntame un poco...", send: "Enviar mensaje", sending: "Enviando...", success: "Mensaje enviado. Te responderé lo antes posible.", error: "No se ha podido enviar. Puedes escribirme directamente a isaac@ipepio.dev.",
    validation: { nameRequired: "Escribe tu nombre", emailRequired: "Escribe tu email", emailInvalid: "Revisa el formato del email", subjectRequired: "Escribe un asunto", messageRequired: "Escribe un mensaje" }
  },
  en: {
    name: "Name", namePlaceholder: "What's your name?", email: "Email", emailPlaceholder: "you@email.com", subject: "Subject", subjectPlaceholder: "What would you like to discuss?", message: "Message", messagePlaceholder: "Tell me a little more...", send: "Send message", sending: "Sending...", success: "Message sent. I'll get back to you shortly.", error: "The message could not be sent. You can email me directly at isaac@ipepio.dev.",
    validation: { nameRequired: "Enter your name", emailRequired: "Enter your email", emailInvalid: "Check the email format", subjectRequired: "Enter a subject", messageRequired: "Enter a message" }
  },
  ca: {
    name: "Nom", namePlaceholder: "Com et dius?", email: "Email", emailPlaceholder: "tu@email.com", subject: "Assumpte", subjectPlaceholder: "De què vols parlar?", message: "Missatge", messagePlaceholder: "Conta'm un poc...", send: "Enviar missatge", sending: "Enviant...", success: "Missatge enviat. Et respondré prompte.", error: "No s'ha pogut enviar. Pots escriure'm directament a isaac@ipepio.dev.",
    validation: { nameRequired: "Escriu el teu nom", emailRequired: "Escriu el teu email", emailInvalid: "Revisa el format de l'email", subjectRequired: "Escriu un assumpte", messageRequired: "Escriu un missatge" }
  }
} as const;

function App() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const text = copy[language];
  const formText = contactCopy[language];
  const { formData, formErrors, formStatus, handleChange, handleSubmit } = useContactForm(formText.validation);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (current / max) * 100 : 0);
      const sections = ["hero", ...navItems.map(([id]) => id)];
      let visible = "hero";
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element && current >= element.offsetTop - 140) visible = id;
      });
      setActiveSection(visible);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible"));
    }, { threshold: 0.12, rootMargin: "0px 0px -36px" });
    document.querySelectorAll(".reveal").forEach((element) => reveal.observe(element));
    return () => reveal.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={`site theme-${theme}`}>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <nav className="site-nav" aria-label="Main navigation">
        <div className="nav-inner">
          <a className="brand" href="#hero" onClick={closeMenu}><span>Isaac Pepió</span></a>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
          <div className={`nav-links ${menuOpen ? "is-open" : ""}`}>
            {navItems.map(([id, labels]) => <a key={id} className={activeSection === id ? "active" : ""} href={`#${id}`} onClick={closeMenu}>{labels[language]}</a>)}
            <label className="language-picker"><span className="sr-only">Idioma</span><select value={language} onChange={(event) => setLanguage(event.target.value as "es" | "en" | "ca")} aria-label="Seleccionar idioma"><option value="es">ES</option><option value="en">EN</option><option value="ca">CA</option></select></label>
            <button className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">{theme === "light" ? <Moon size={16} /> : <Sun size={16} />}</button>
            <a className="nav-cta" href="#contact" onClick={closeMenu}>{text.getInTouch} <ArrowUpRight size={14} /></a>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero section" id="hero">
          <div className="section-inner hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{text.based}</p>
              <h1>{text.heroStart} <em>{text.heroAccent}</em></h1>
              <p className="hero-lede">{text.lede}</p>
              <div className="hero-meta"><span>{text.role}</span><b /> <span>{text.years}</span><b /> <span>Vinaròs</span></div>
              <div className="actions"><a className="button button-dark" href="#experience">{text.experience} <ArrowUpRight size={16} /></a><a className="button button-soft" href="#contact">{text.getInTouch}</a></div>
            </div>
            <div className="system-map" aria-label="System diagram"><div className="map-orbit orbit-one" /><div className="map-orbit orbit-two" /><div className="map-line line-a" /><div className="map-line line-b" /><div className="map-line line-c" />{text.system.map((label, index) => <div className={`map-node node-${["product", "code", "infra", "data", "ops", "system"][index]}`} key={label}>{label}</div>)}<div className="map-core" /></div>
          </div>
        </section>

        <section className="section experience-section" id="experience">
          <div className="section-inner">
            <p className="eyebrow">{text.experience}</p>
            <h2>{text.experienceTitle}</h2>
            <div className="experience-timeline">
              {experienceData.filter((experience) => experience.id !== "Tineverse").map((experience) => (
                <article className={`experience-item reveal ${experience.isCurrent ? "is-current" : ""}`} key={experience.id}>
                  <div className="experience-marker" />
                  <div className="experience-content">
                    <div className="experience-title">
                      <h3>{experience.company}</h3>
                      <p className="experience-role">{experience.position[language]}</p>
                      <div className="experience-date">{experience.period[language]}</div>
                    </div>
                    <p className="experience-description">{experience.description[language]}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section work-section" id="work"><div className="section-inner"><p className="eyebrow">{text.work}</p><div className="section-heading-grid work-heading"><h2>{text.workTitle}</h2><p>{text.workNote}</p></div>{projects.map((project, index) => <article className="project reveal" key={project.number}><div className="project-info"><span className="project-number">/{project.number}</span><p className="project-role">{index === 0 ? text.projects[0] : text.projects[1]}</p><h3>{project.name}</h3><p className="project-context">{index === 0 ? text.projects[2] : text.projects[4]}</p><p className="project-description">{index === 0 ? text.projects[3] : text.projects[5]}</p><div className="stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>{project.href && <a className="text-link" href={project.href} target="_blank" rel="noreferrer">{text.view} <ArrowUpRight size={14} /></a>}</div><div className={`project-visual visual-${project.number}`}><span>{project.number}</span><div className="visual-grid" /><strong>{project.name}</strong><small>{text.selected}</small></div></article>)}</div></section>

        <section className="section capabilities" id="capabilities"><div className="section-inner"><p className="eyebrow">{text.capabilities}</p><h2>{text.capabilitiesTitle}</h2><div className="cap-grid">{text.caps.slice(0, 4).map((capability, index) => <article className="cap-card reveal" key={capability.title}><span className="cap-index">0{index + 1}</span><h3>{capability.title}</h3><ul>{capability.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div><p className="cap-connector">↕ {language === "es" ? "Cada área refuerza a las demás" : language === "ca" ? "Cada àrea reforça les altres" : "Each area connects to and reinforces the others"} ↕</p><div className="tech-list"><span>Go</span><span>Kotlin</span><span>Node.js</span><span>TypeScript</span><span>Python</span><span>React</span><span>PostgreSQL</span><span>Redis</span><span>RabbitMQ</span><span>Docker</span><span>Kubernetes</span><span>AWS</span><span>Linux</span><span>GitHub Actions</span></div></div></section>

        <section className="section principles"><div className="section-inner"><p className="eyebrow">{text.principles}</p><h2>{text.principlesTitle}</h2><div className="principles-grid">{text.principlesList.map(([title, description], index) => <article className="principle reveal" key={title}><span>/0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>

        <section className="section about-section" id="about"><div className="section-inner"><p className="eyebrow">{text.about}</p><h2>{text.aboutTitle}</h2><div className="about-grid"><div><img className="portrait" src={isaacImage} alt="Isaac Pepió" /><p className="caption">Isaac Pepió · {text.place}</p></div><div className="about-copy">{text.aboutText.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div></div></section>

        <section className="contact section" id="contact">
          <div className="section-inner contact-grid">
            <div className="contact-copy">
              <p className="eyebrow">{text.contact}</p>
              <h2>{text.contactTitle}</h2>
              <p>{text.contactText}</p>
              <div className="contact-links">
                <a href="mailto:isaac@ipepio.dev"><Mail size={16} /> isaac@ipepio.dev</a>
                <a href="https://www.linkedin.com/in/ipepio" target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a>
                <a href="https://github.com/ipepio" target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
                <a href="/CV_Isaac_Pepió.pdf" download>{text.cv} <ArrowUpRight size={14} /></a>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-pair">
                <label>{formText.name}<input name="name" value={formData.name} onChange={handleChange} placeholder={formText.namePlaceholder} aria-invalid={Boolean(formErrors.name)} />{formErrors.name && <small>{formErrors.name}</small>}</label>
                <label>{formText.email}<input name="email" type="email" value={formData.email} onChange={handleChange} placeholder={formText.emailPlaceholder} aria-invalid={Boolean(formErrors.email)} />{formErrors.email && <small>{formErrors.email}</small>}</label>
              </div>
              <label>{formText.subject}<input name="subject" value={formData.subject} onChange={handleChange} placeholder={formText.subjectPlaceholder} aria-invalid={Boolean(formErrors.subject)} />{formErrors.subject && <small>{formErrors.subject}</small>}</label>
              <label>{formText.message}<textarea name="message" value={formData.message} onChange={handleChange} placeholder={formText.messagePlaceholder} rows={5} aria-invalid={Boolean(formErrors.message)} />{formErrors.message && <small>{formErrors.message}</small>}</label>
              <button type="submit" disabled={formStatus === "loading"}>{formStatus === "loading" ? formText.sending : formText.send}<Send size={15} /></button>
              {formStatus === "success" && <p className="form-status success">{formText.success}</p>}
              {formStatus === "error" && <p className="form-status error">{formText.error}</p>}
            </form>
          </div>
        </section>
      </main>
      <footer>© {new Date().getFullYear()} Isaac Pepió · {text.rights}</footer>
    </div>
  );
}

export default App;
