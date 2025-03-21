export interface ProjectTech {
    name: string;
    color?: string;
}

export interface Project {
    id: string;
    title: {
        es: string;
        en: string;
        ca: string;
    };
    description: {
        es: string;
        en: string;
        ca: string;
    };
    fullDescription: {
        es: string;
        en: string;
        ca: string;
    };
    technologies: ProjectTech[];
    features: {
        es: string[];
        en: string[];
        ca: string[];
    };
    image: string | null;
    githubUrl: string | null;
    demoUrl: string | null;
}
import cardImage from "@/assets/card.png";
import rosettaImage from "@/assets/rosetta.png";
import kitchenImage from "@/assets/kitchen.png";
import smtk from "@/assets/smtk.png";
import backoffice from "@/assets/backoffice.png";



export const mockProjects: Project[] = [
    {
        id: "kmbrer-card",
        title: {
            es: "Carta digital para restaurantes",
            en: "Digital menu for restaurants",
            ca: "Carta digital per a restaurants"
        },
        description: {
            es: "Es una carta digital, con la cual no solo se pueden pedir los platos de forma interactiva, sino que también se pueden personalizar, compartir y pagar la cuenta",
            en: "It is a digital menu that not only allows interactive ordering of dishes but also enables customization, sharing, and payment of the bill",
            ca: "És una carta digital, amb la qual no només es poden demanar els plats de forma interactiva, sinó que també es poden personalitzar, compartir i pagar el compte"
        },
        fullDescription: {
            es: "Kmbrer-Card es una aplicación web diseñada para revolucionar la experiencia del cliente en restaurantes. Permite a los comensales explorar menús digitales, realizar pedidos personalizados, compartir platos y gestionar pagos de manera segura y eficiente. Con una interfaz intuitiva y moderna, esta aplicación mejora la interacción entre clientes y restaurantes, optimizando la gestión de pedidos y pagos.",
            en: "Kmbrer-Card is a web application designed to revolutionize the customer experience in restaurants. It allows diners to explore digital menus, place customized orders, share dishes, and manage payments securely and efficiently. With an intuitive and modern interface, this application enhances the interaction between customers and restaurants, optimizing order and payment management.",
            ca: "Kmbrer-Card és una aplicació web dissenyada per revolucionar l'experiència del client en restaurants. Permet als comensals explorar menús digitals, fer comandes personalitzades, compartir plats i gestionar pagaments de manera segura i eficient. Amb una interfície intuïtiva i moderna, aquesta aplicació millora la interacció entre clients i restaurants, optimitzant la gestió de comandes i pagaments."
        },
        technologies: [
            { name: "React", color: "#61DAFB" },
            { name: "Node.js", color: "#339933" },
            { name: "PostgreSQL", color: "#336791" },
            { name: "Make", color: "#003366" },
            { name: "Docker", color: "#2496ED" }
        ],
        features: {
            es: [
                "Menú digital interactivo con imágenes y descripciones detalladas",
                "Personalización de pedidos con complementos y comentarios",
                "División de cuentas entre comensales",
                "Pagos seguros mediante integración con Redsys",
                "Notificaciones en tiempo real sobre el estado de los pedidos",
                "Llamadas al camarero desde la aplicación"
            ],
            en: [
                "Interactive digital menu with images and detailed descriptions",
                "Order customization with add-ons and comments",
                "Bill splitting among diners",
                "Secure payments via Redsys integration",
                "Real-time notifications on order status",
                "Call waiter feature directly from the app"
            ],
            ca: [
                "Menú digital interactiu amb imatges i descripcions detallades",
                "Personalització de comandes amb complements i comentaris",
                "Divisió del compte entre comensals",
                "Pagaments segurs mitjançant integració amb Redsys",
                "Notificacions en temps real sobre l'estat de les comandes",
                "Funció de cridar el cambrer des de l'aplicació"
            ]
        },
        image: cardImage,
        githubUrl: null,
        demoUrl: "https://card.kmbrer.com"
    },
    {
        id: "kmbrer-kitchen",
        title: {
            es: "Monitor de cocina para restaurantes",
            en: "Kitchen monitor for restaurants",
            ca: "Monitor de cuina per a restaurants"
        },
        description: {
            es: "Monitor de cocina que muestra los platos en orden de pedido, permitiendo gestionar el estado de cada plato y recibir notificaciones en tiempo real.",
            en: "Kitchen monitor that displays dishes in order of request, allowing to manage the status of each dish and receive real-time notifications.",
            ca: "Monitor de cuina que mostra els plats en ordre de comanda, permetent gestionar l'estat de cada plat i rebre notificacions en temps real."
        },
        fullDescription: {
            es: "Kmbrer-Kitchen es una aplicación web diseñada para optimizar la gestión de pedidos en la cocina de restaurantes. Muestra los platos del día en orden de llegada, permitiendo al personal de cocina marcar los platos como rechazados, en preparación o servidos. Incluye una pantalla de login segura y garantiza el acceso exclusivo al restaurante correspondiente, ideal para cadenas multifranquicia y multirestaurante. Las notificaciones en tiempo real mediante WebSockets aseguran una comunicación fluida y eficiente.",
            en: "Kmbrer-Kitchen is a web application designed to optimize order management in restaurant kitchens. It displays the day's dishes in the order they arrive, allowing kitchen staff to mark dishes as rejected, in preparation, or served. It includes a secure login screen and ensures exclusive access to the corresponding restaurant, ideal for multi-franchise and multi-restaurant chains. Real-time notifications via WebSockets ensure smooth and efficient communication.",
            ca: "Kmbrer-Kitchen és una aplicació web dissenyada per optimitzar la gestió de comandes a la cuina de restaurants. Mostra els plats del dia en ordre d'arribada, permetent al personal de cuina marcar els plats com a rebutjats, en preparació o servits. Inclou una pantalla de login segura i garanteix l'accés exclusiu al restaurant corresponent, ideal per a cadenes multifranquícia i multirestaurante. Les notificacions en temps real mitjançant WebSockets asseguren una comunicació fluida i eficient."
        },
        technologies: [
            { name: "React", color: "#61DAFB" },
            { name: "Node.js", color: "#339933" },
            { name: "PostgreSQL", color: "#336791" },
            { name: "WebSockets", color: "#673AB7" },
            { name: "Docker", color: "#2496ED" }
        ],
        features: {
            es: [
                "Visualización de platos en orden de pedido",
                "Gestión del estado de los platos (rechazado, en preparación, servido)",
                "Pantalla de login segura con acceso exclusivo por restaurante",
                "Soporte para multifranquicia y multirestaurante",
                "Notificaciones en tiempo real mediante WebSockets",
                "Visualización de los platos del dia"
            ],
            en: [
                "Display of dishes in order of request",
                "Dish status management (rejected, in preparation, served)",
                "Secure login screen with exclusive access per restaurant",
                "Multi-franchise and multi-restaurant support",
                "Real-time notifications via WebSockets",
                "Display of the dishes of the day"
            ],
            ca: [
                "Visualització de plats en ordre de comanda",
                "Gestió de l'estat dels plats (rebutjat, en preparació, servit)",
                "Pantalla de login segura amb accés exclusiu per restaurant",
                "Suport per a multifranquícia i multirestaurante",
                "Notificacions en temps real mitjançant WebSockets",
                "Visualització dels plats del dia"
            ]
        },
        image: kitchenImage,
        githubUrl: null,
        demoUrl: "https://kitchen.kmbrer.com"
    },
    {
        id: "rosetta",
        title: {
            es: "Sistema de integración con múltiples plataformas de venta de tickets",
            en: "Integration system with multiple ticket sales platforms",
            ca: "Sistema d'integració amb múltiples plataformes de venda d'entrades"
        },
        description: {
            es: "Aplicación que se ejecuta en el servidor y hace de traductor entre las diferentes plataformas de venta de tickets y el sistema de gestión de eventos",
            en: "Application that runs on the server and acts as a translator between different ticket sales platforms and the event management system",
            ca: "Aplicació que s'executa al servidor i fa de traductor entre les diferents plataformes de venda d'entrades i el sistema de gestió d'esdeveniments"
        },
        fullDescription: {
            es: "Rosetta es una aplicación robusta y escalable desarrollada en Node.js con Express, diseñada para actuar como un puente esencial entre diversas plataformas de venta de tickets y sistemas de gestión de eventos.\nEste proyecto aborda la complejidad de integrar múltiples fuentes de datos, asegurando una comunicación fluida y eficiente.",
            en: "Rosetta is a robust and scalable application developed in Node.js with Express, designed to act as an essential bridge between various ticket sales platforms and event management systems.\nThis project addresses the complexity of integrating multiple data sources, ensuring smooth and efficient communication.",
            ca: "Rosetta és una aplicació robusta i escalable desenvolupada en Node.js amb Express, dissenyada per actuar com un pont essencial entre diverses plataformes de venda d'entrades i sistemes de gestió d'esdeveniments.\nAquest projecte aborda la complexitat d'integrar múltiples fonts de dades, assegurant una comunicació fluida i eficient."
        },
        technologies: [            
            { name: "Node.js", color: "#339933" },
            { name: "PostgreSQL", color: "#47A248" },
            { name: "Webhooks", color: "#010101" },
            { name: "Express.js", color: "#000000" }
        ],
        features: {
            es: [
                "Traducción de datos entre plataformas de venta de tickets y sistemas de gestión de eventos.",
                "Integración bidireccional mediante webhooks para actualizaciones en tiempo real.",
                "Integración unidireccional con base de datos para fuentes de datos externas.",
                "API RESTful flexible para integración con diversos sistemas.",
                "Centralización de datos y automatización de procesos.",
                "Escalabilidad para manejar grandes volúmenes de datos."
            ],
            en: [],
            ca: []
        },
        image: rosettaImage,
        githubUrl: null,
        demoUrl: "https://rosetta.oratrex.com/api-docs/"
    },
    {
        id: "smartticket",
        title: {
            es: "Ticket digital seguro y offline",
            en: "Secure and offline digital ticket",
            ca: "Tiquet digital segur i offline"
        },
        description: {
            es: "Ticket digital con autenticación 2FA y funcionamiento offline.",
            en: "Digital ticket with 2FA authentication and offline functionality.",
            ca: "Tiquet digital amb autenticació 2FA i funcionament offline."
        },
        fullDescription: {
            es: "Smartticket es un ticket digital React seguro y funcional sin conexión a internet. Permite la apertura simultánea en un único dispositivo y cuenta con autenticación 2FA mediante teléfono móvil o sesiones de Google y Apple. Utiliza WebSockets para actualizaciones en tiempo real y un backend Node.js con PostgreSQL, desplegado en contenedores. El proyecto puede ejecutarse fácilmente con un Makefile. En este proyecto, he colaborado en el diseño del producto, la arquitectura de las soluciones y el desarrollo de algunas funcionalidades, trabajando con un sistema de diseño.",
            en: "Smartticket is a secure and functional React digital ticket offline. It allows simultaneous opening on a single device and features 2FA authentication via mobile phone or Google and Apple sessions. It uses WebSockets for real-time updates and a Node.js backend with PostgreSQL, deployed in containers. The project can be easily run with a Makefile. In this project, I collaborated on the product design, solutions architecture, and development of some functionalities, working with a design system.",
            ca: "Smartticket és un tiquet digital React segur i funcional sense connexió a internet. Permet l'obertura simultània en un únic dispositiu i compta amb autenticació 2FA mitjançant telèfon mòbil o sessions de Google i Apple. Utilitza WebSockets per a actualitzacions en temps real i un backend Node.js amb PostgreSQL, desplegat en contenidors. El projecte es pot executar fàcilment amb un Makefile. En aquest projecte, he col·laborat en el disseny del producte, l'arquitectura de les solucions i el desenvolupament d'algunes funcionalitats, treballant amb un sistema de disseny."
        },
        technologies: [
            { name: "React", color: "#61DAFB" },
            { name: "Node.js", color: "#339933" },
            { name: "PostgreSQL", color: "#336791" },
            { name: "WebSockets", color: "#673AB7" },
            { name: "Docker", color: "#2496ED" },
            { name: "Makefile", color: "#808080" }
        ],
        features: {
            es: [
                "Tickets digitales funcionales sin conexión a internet",
                "Apertura simultánea en un único dispositivo",
                "Autenticación 2FA con teléfono móvil, Google o Apple",
                "Actualizaciones en tiempo real mediante WebSockets",
                "Backend robusto con Node.js y PostgreSQL",
                "Despliegue en contenedores Docker",
                "Ejecución sencilla con Makefile"
            ],
            en: [
                "Functional digital tickets offline",
                "Simultaneous opening on a single device",
                "2FA authentication with mobile phone, Google or Apple",
                "Real-time updates via WebSockets",
                "Robust backend with Node.js and PostgreSQL",
                "Deployment in Docker containers",
                "Easy execution with Makefile"
            ],
            ca: [
                "Tiquets digitals funcionals sense connexió a internet",
                "Obertura simultània en un únic dispositiu",
                "Autenticació 2FA amb telèfon mòbil, Google o Apple",
                "Actualitzacions en temps real mitjançant WebSockets",
                "Backend robust amb Node.js i PostgreSQL",
                "Desplegament en contenidors Docker",
                "Execució senzilla amb Makefile"
            ]
        },
        image: smtk,
        githubUrl: null,
        demoUrl: "https://ticket.smtkfile.com"
    },
    {
        id: "smartticket-backoffice",
        title: {
            es: "Backoffice de gestión de smarttickets",
            en: "Smartticket management backoffice",
            ca: "Backoffice de gestió de smarttickets"
        },
        description: {
            es: "Backoffice para la gestión de tickets digitales y generación de informes.",
            en: "Backoffice for digital ticket management and report generation.",
            ca: "Backoffice per a la gestió de tiquets digitals i generació d'informes."
        },
        fullDescription: {
            es: "Smartticket-Backoffice es una plataforma web para la gestión integral de tickets digitales. Permite la administración de usuarios, la generación de informes detallados y el seguimiento del estado de los tickets. Desarrollado con React para el frontend y Node.js con PostgreSQL para el backend, utiliza WebSockets para actualizaciones en tiempo real y está desplegado en contenedores Docker. El proyecto puede ejecutarse fácilmente con un Makefile. En este proyecto, he colaborado en el diseño del producto, la arquitectura de las soluciones y el desarrollo de algunas funcionalidades, trabajando con un sistema de diseño.",
            en: "Smartticket-Backoffice is a web platform for comprehensive digital ticket management. It allows user administration, detailed report generation, and ticket status tracking. Developed with React for the frontend and Node.js with PostgreSQL for the backend, it uses WebSockets for real-time updates and is deployed in Docker containers. The project can be easily run with a Makefile. In this project, I collaborated on the product design, solutions architecture, and development of some functionalities, working with a design system.",
            ca: "Smartticket-Backoffice és una plataforma web per a la gestió integral de tiquets digitals. Permet l'administració d'usuaris, la generació d'informes detallats i el seguiment de l'estat dels tiquets. Desenvolupat amb React per al frontend i Node.js amb PostgreSQL per al backend, utilitza WebSockets per a actualitzacions en temps real i està desplegat en contenidors Docker. El projecte es pot executar fàcilment amb un Makefile. En aquest projecte, he col·laborat en el disseny del producte, l'arquitectura de les solucions i el desenvolupament d'algunes funcionalitats, treballant amb un sistema de disseny."
        },
        technologies: [
            { name: "React", color: "#61DAFB" },
            { name: "Node.js", color: "#339933" },
            { name: "PostgreSQL", color: "#336791" },
            { name: "WebSockets", color: "#673AB7" },
            { name: "Docker", color: "#2496ED" },
            { name: "Makefile", color: "#808080" }
        ],
        features: {
            es: [
                "Gestión de usuarios y permisos",
                "Generación de informes personalizables",
                "Seguimiento del estado de los tickets",
                "Visualización de estadísticas y gráficos",
                "Exportación de datos en diversos formatos",
                "Actualizaciones en tiempo real mediante WebSockets"
            ],
            en: [
                "User and permission management",
                "Customizable report generation",
                "Ticket status tracking",
                "Statistics and graph visualization",
                "Data export in various formats",
                "Real-time updates via WebSockets"
            ],
            ca: [
                "Gestió d'usuaris i permisos",
                "Generació d'informes personalitzables",
                "Seguiment de l'estat dels tiquets",
                "Visualització d'estadístiques i gràfics",
                "Exportació de dades en diversos formats",
                "Actualitzacions en temps real mitjançant WebSockets"
            ]
        },
        image: backoffice,
        githubUrl: null,
        demoUrl: "https://admin.smtkfile.com"
    }
];