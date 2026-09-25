type ExperienceEntry = {
  id: string;
  position: { es: string; en: string; ca: string };
  company: string;
  location?: { es: string; en: string; ca: string };
  period: { es: string; en: string; ca: string };
  description: { es: string; en: string; ca: string };
  fullDescription: { es: string; en: string; ca: string };
  isCurrent: boolean;
};

export const experienceData: ExperienceEntry[] = [
  {
    id: "EasyGoBand",
    position: {
      es: "CTO",
      en: "CTO",
      ca: "CTO",
    },
    company: "EasyGoBand World",
    location: {
      es: "Castellón, España",
      en: "Castellón, Spain",
      ca: "Castelló, Espanya",
    },
    period: {
      es: "Septiembre 2025 – Actualidad",
      en: "September 2025 – Present",
      ca: "Setembre 2025 – Actualitat",
    },
    description: {
      es: "Dirijo área tecnológica (~20 personas) transversal: Software Development, DevOps, QA, Integrations y Cybersecurity. Estrategia tecnológica y arquitectura alineadas a negocio. Nueva generación de plataforma (V2): monolito event-driven para mantenibilidad y escalabilidad. Infraestructura cloud sobre AWS EKS y Kubernetes. Estrategia de adopción de IA aplicada a ingeniería. Herramientas internas con IA: sistema propio de AI Code Review para analizar PRs automáticamente. Soluciones basadas en RAG y automatización inteligente. Creé el área de QA desde cero con testing manual y pruebas E2E integradas al ciclo. Dirección técnica de integraciones con sistemas externos. Ciberseguridad dentro de los procesos de ingeniería.",
      en: "I lead a cross-functional tech area (~20 people): Software Development, DevOps, QA, Integrations and Cybersecurity. Technology strategy and architecture aligned to business goals. New platform generation (V2): event-driven monolith for maintainability and scalability. Cloud infrastructure on AWS EKS and Kubernetes. AI adoption strategy applied to engineering. Internal AI tools: own AI Code Review system to automatically analyze PRs. RAG-based solutions and intelligent automation. Created the QA area from scratch (hiring + initial team) with manual testing and E2E tests integrated into the cycle. Technical direction of integrations with external systems. Cybersecurity within engineering processes.",
      ca: "Dirigeixo l'àrea tecnològica (~20 persones) transversal: Software Development, DevOps, QA, Integrations i Cybersecurity. Estratègia tecnològica i arquitectura alineades a negoci. Nova generació de plataforma (V2): monòlit event-driven per a mantenibilitat i escalabilitat. Infraestructura cloud sobre AWS EKS i Kubernetes. Estratègia d'adopció d'IA aplicada a enginyeria. Eines internes amb IA: sistema propi d'AI Code Review per analitzar PRs automàticament. Solucions basades en RAG i automatització intel·ligent. Vaig crear l'àrea de QA des de zero amb testing manual i proves E2E integrades al cicle. Direcció tècnica de integracions amb sistemes externs. Ciberseguretat dins dels processos d'enginyeria.",
    },
    isCurrent: true,
    fullDescription: {
      es: "Dirijo área tecnológica (~20 personas) transversal: Software Development, DevOps, QA, Integrations y Cybersecurity. Estrategia tecnológica y arquitectura alineadas a negocio.",
      en: "I lead a cross-functional tech area (~20 people): Software Development, DevOps, QA, Integrations and Cybersecurity. Technology strategy and architecture aligned to business goals.",
      ca: "Dirigeixo l'àrea tecnològica (~20 persones) transversal: Software Development, DevOps, QA, Integrations i Cybersecurity. Estratègia tecnològica i arquitectura alineades a negoci.",
    },
  },
  {
    id: "Tineverse",
    position: {
      es: "Tech Lead / Lead Software Engineer",
      en: "Tech Lead / Lead Software Engineer",
      ca: "Tech Lead / Lead Software Engineer",
    },
    company: "Tineverse",
    location: {
      es: "Benicàssim, España",
      en: "Benicàssim, Spain",
      ca: "Benicàssim, Espanya",
    },
    period: {
      es: "Abril 2025 – Septiembre 2025",
      en: "April 2025 – September 2025",
      ca: "Abril 2025 – Setembre 2025",
    },
    description: {
      es: "Liderazgo técnico de la plataforma y su arquitectura. Coordinación del equipo, estándares de código y revisiones. Soluciones modulares y escalables. Modernización del stack. Colaboración con producto y diseño. Planificación de sprints y entregas. Mentorización.",
      en: "Technical leadership of the platform and its architecture. Team coordination, code standards and reviews. Modular and scalable solutions. Stack modernisation. Collaboration with product and design. Sprint planning and deliveries. Mentoring.",
      ca: "Lideratge tècnic de la plataforma i la seua arquitectura. Coordinació de l'equip, estàndards de codi i revisions. Solucions modulars i escalables. Modernització del stack. Col·laboració amb producte i disseny. Planificació de sprints i entregues. Mentorització.",
    },
    isCurrent: false,
    fullDescription: {
      es: "Liderazgo técnico de la plataforma y su arquitectura. Coordinación del equipo, estándares de código y revisiones. Soluciones modulares y escalables. Modernización del stack. Colaboración con producto y diseño.",
      en: "Technical leadership of the platform and its architecture. Team coordination, code standards and reviews. Modular and scalable solutions. Stack modernisation. Collaboration with product and design.",
      ca: "Lideratge tècnic de la plataforma i la seua arquitectura. Coordinació de l'equip, estàndards de codi i revisions. Solucions modulars i escalables. Modernització del stack. Col·laboració amb producte i disseny.",
    },
  },
  {
    id: "Oratrex",
    position: {
      es: "CTO / Tech Lead",
      en: "CTO / Tech Lead",
      ca: "CTO / Tech Lead",
    },
    company: "Oratrex Tech",
    location: {
      es: "Valencia, España",
      en: "Valencia, Spain",
      ca: "València, Espanya",
    },
    period: {
      es: "Agosto 2023 – Marzo 2025",
      en: "August 2023 – March 2025",
      ca: "Agost 2023 – Març 2025",
    },
    description: {
      es: "Equipo técnico de hasta 6 desarrolladores. Backoffice desde cero para operaciones internas. Creación de Smart Ticket (.smtk), formato propio de entrada digital con su app. Apps para festivales con integraciones de ticketing. CI/CD que redujo tiempos de despliegue >80%. Metodologías ágiles y Scrum. Infraestructura AWS + Kubernetes autoescalable. Perfil hands-on.",
      en: "Technical team of up to 6 developers. Backoffice from scratch for internal operations. Created Smart Ticket (.smtk), a proprietary digital entry format with its app. Festival apps with ticketing integrations. CI/CD that reduced deployment time by >80%. Agile methodologies and Scrum. AWS + self-scaling Kubernetes infrastructure. Hands-on profile.",
      ca: "Equip tècnic de fins a 6 desenvolupadors. Backoffice des de zero per a operacions internes. Creació de Smart Ticket (.smtk), format propi d'entrada digital amb la seua app. Apps per a festivals amb integracions de ticketing. CI/CD que va reduir temps de desplegament >80%. Metodologies àgils i Scrum. Infraestructura AWS + Kubernetes autoescalable. Perfil hands-on.",
    },
    isCurrent: false,
    fullDescription: {
      es: "Equipo técnico de hasta 6 desarrolladores. Backoffice desde cero. Smart Ticket (.smtk), apps para festivales. CI/CD que redujo >80% el tiempo de despliegue. AWS + Kubernetes autoescalable. Perfil hands-on.",
      en: "Technical team of up to 6 developers. Backoffice from scratch. Smart Ticket (.smtk), festival apps. CI/CD that reduced deployment time by >80%. AWS + self-scaling Kubernetes. Hands-on profile.",
      ca: "Equip tècnic de fins a 6 desenvolupadors. Backoffice des de zero. Smart Ticket (.smtk), apps per a festivals. CI/CD que va reduir >80% el temps de desplegament. AWS + Kubernetes autoescalable. Perfil hands-on.",
    },
  },
  {
    id: "Seidor",
    position: {
      es: "Consultor Senior SAP WM / EWM",
      en: "Senior SAP WM / EWM Consultant",
      ca: "Consultor Sènior SAP WM / EWM",
    },
    company: "Seidor",
    location: {
      es: "Barcelona, España",
      en: "Barcelona, Spain",
      ca: "Barcelona, Espanya",
    },
    period: {
      es: "Abril 2022 – Agosto 2023",
      en: "April 2022 – August 2023",
      ca: "Abril 2022 – Agost 2023",
    },
    description: {
      es: "Implantación y evolución SAP WM/EWM en logística de alta exigencia. Optimización de procesos logísticos. Puesta en marcha de operaciones en instalaciones de más de 40.000 m². Mejoras para Estrella Damm.",
      en: "SAP WM/EWM implementation and evolution in high-demand logistics. Optimisation of logistics processes. Go-live of operations at facilities exceeding 40,000 m². Improvements for Estrella Damm.",
      ca: "Implantació i evolució SAP WM/EWM en logística d'alta exigència. Optimització de processos logístics. Posada en marxa d'operacions en instal·lacions de més de 40.000 m². Millores per a Estrella Damm.",
    },
    isCurrent: false,
    fullDescription: {
      es: "Implantación SAP WM/EWM en logística de alta exigencia. Optimización de procesos logísticos. Operaciones en instalaciones de más de 40.000 m². Mejoras para Estrella Damm.",
      en: "SAP WM/EWM implementation in high-demand logistics. Logistics process optimisation. Go-live at facilities exceeding 40,000 m². Improvements for Estrella Damm.",
      ca: "Implantació SAP WM/EWM en logística d'alta exigència. Optimització de processos logístics. Operacions en instal·lacions de més de 40.000 m². Millores per a Estrella Damm.",
    },
  },
  {
    id: "GilComes",
    position: {
      es: "Senior Software Developer / SAP Developer",
      en: "Senior Software Developer / SAP Developer",
      ca: "Desenvolupador Sènior de Software / SAP Developer",
    },
    company: "Grupo Gil Comes",
    location: {
      es: "Vinaròs, España",
      en: "Vinaròs, Spain",
      ca: "Vinaròs, Espanya",
    },
    period: {
      es: "Diciembre 2017 – Abril 2022",
      en: "December 2017 – April 2022",
      ca: "Desembre 2017 – Abril 2022",
    },
    description: {
      es: "Desarrollo sobre SAP durante más de 4 años. Liderazgo temporal del equipo de desarrollo. Implantación del sistema en dos plantas productivas. Solución de redistribución de costes de materias primas. Trazabilidad y control de calidad. Módulos Z a medida. Apps móviles con SAP UI5. Integración con MES e Industria 4.0.",
      en: "SAP development for over 4 years. Temporary leadership of the development team. System implementation across two production plants. Raw material cost redistribution solution. Traceability and quality control. Custom Z modules. Mobile apps with SAP UI5. Integration with MES and Industry 4.0.",
      ca: "Desenvolupament sobre SAP durant més de 4 anys. Lideratge temporal de l'equip de desenvolupament. Implantació del sistema en dues plantes productives. Solució de redistribució de costos de matèries primeres. Traçabilitat i control de qualitat. Mòduls Z a mida. Apps mòbils amb SAP UI5. Integració amb MES i Indústria 4.0.",
    },
    isCurrent: false,
    fullDescription: {
      es: "Desarrollo SAP durante más de 4 años. Liderazgo temporal del equipo. Implantación en dos plantas. Módulos Z a medida, apps UI5, integración con MES e Industria 4.0.",
      en: "SAP development for over 4 years. Temporary team leadership. Implementation across two plants. Custom Z modules, UI5 apps, MES and Industry 4.0 integration.",
      ca: "Desenvolupament SAP durant més de 4 anys. Lideratge temporal de l'equip. Implantació en dues plantes. Mòduls Z a mida, apps UI5, integració amb MES i Indústria 4.0.",
    },
  },
];

export const skillsByCategory = {
  "Backend & Architecture": [
    "Node.js",
    "NestJS",
    "Express",
    "REST APIs",
    "Event-Driven Architecture",
    "Microservices",
    "Modular Monolith",
    "Clean Architecture",
  ],
  "Cloud & DevOps": [
    "AWS",
    "Amazon EKS",
    "Kubernetes",
    "Docker",
    "CI/CD",
    "Deployment Automation",
  ],
  "Artificial Intelligence": [
    "LLMs",
    "RAG",
    "AI Agents",
    "AI-assisted Development",
    "Automated Code Review",
    "Intelligent Automation",
  ],
  "Quality & Security": [
    "E2E Testing",
    "QA Processes",
    "Code Review",
    "Secure SDLC",
    "Cybersecurity",
  ],
  Databases: ["PostgreSQL", "SQL Server"],
  "Enterprise & SAP": [
    "SAP WM",
    "EWM",
    "MM",
    "SD",
    "PP",
    "CO",
    "ABAP",
  ],
  Engineering: [
    "Git",
    "GitHub",
    "Software Architecture",
    "Systems Integration",
    "Agile",
    "Scrum",
  ],
};

export const education = {
  degree: {
    es: "Grado en Ingeniería de Telecomunicaciones",
    en: "Bachelor's in Telecommunications Engineering",
    ca: "Grau en Enginyeria de Telecomunicacions",
  },
  institution: {
    es: "Universitat Oberta de Catalunya",
    en: "Open University of Catalonia",
    ca: "Universitat Oberta de Catalunya",
  },
  honor: {
    es: "Matrícula de Honor en el TFG (aplicaciones multimedia de nueva generación)",
    en: "Distinction on Final Degree Project (next-generation multimedia applications)",
    ca: "Matrícula d'Honor en el TFG (aplicacions multimèdia de nova generació)",
  },
};

export const languages = [
  {
    name: { es: "Español", en: "Spanish", ca: "Català" },
    level: { es: "Nativo", en: "Native", ca: "Natiu" },
  },
  {
    name: { es: "Catalán/Valenciano", en: "Catalan/Valencian", ca: "Català/Valencià" },
    level: { es: "Nativo", en: "Native", ca: "Natiu" },
  },
  {
    name: { es: "Inglés", en: "English", ca: "Anglès" },
    level: { es: "C1", en: "C1", ca: "C1" },
  },
];
