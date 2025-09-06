# 🚀 Portfolio - Isaac Pepió Tàrrega

Este es mi portfolio personal, desarrollado con **React**, **Vite** y **TypeScript**.

El objetivo del proyecto es mostrar mis trabajos, habilidades y experiencia como desarrollador frontend en una web moderna, rápida y escalable.

## 🛠️ Tecnologías utilizadas

- ⚛️ **React 19** - Biblioteca de interfaz de usuario
- ⚡ **Vite 6** - Herramienta de build y desarrollo
- 🧠 **TypeScript** - Tipado estático
- 🎨 **Tailwind CSS 4** - Framework de CSS utilitario
- 🎭 **Framer Motion** - Animaciones fluidas
- 📧 **EmailJS** - Servicio de envío de correos
- 🎯 **Radix UI** - Componentes accesibles
- 🎪 **Lucide Icons** - Iconografía moderna

## 📋 Prerequisitos

- **Node.js 20** o superior
- **npm** (incluido con Node.js)

## 🚀 Desarrollo local

### 1. Clona el repositorio
```bash
git clone https://github.com/ipepio/portfolio.git
cd portfolio
```

### 2. Instala las dependencias
```bash
npm install
```

### 3. Configura las variables de entorno
```bash
cp .env.example .env
```
Edita el archivo `.env` con tus credenciales de EmailJS:
- `VITE_EMAILJS_SERVICE_ID`: ID del servicio de EmailJS
- `VITE_EMAILJS_TEMPLATE_ID`: ID de la plantilla de EmailJS
- `VITE_EMAILJS_PUBLIC_KEY`: Clave pública de EmailJS

### 4. Inicia el servidor de desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:6173`

## 📦 Build y calidad de código

### Build para producción
```bash
npm run build
```

### Verificación de código
```bash
npm run lint          # Ejecuta ESLint
npm run typecheck     # Verificación de tipos TypeScript
```

### Vista previa del build
```bash
npm run preview
```

## 🚀 Despliegue en GitHub Pages

### Configuración automática (recomendado)

Este proyecto incluye un workflow de GitHub Actions que se ejecuta automáticamente cuando haces push a las ramas `main` o `master`.

#### Configuración inicial en GitHub:

1. **Habilitar GitHub Pages:**
   - Ve a `Settings` > `Pages` en tu repositorio
   - En `Source`, selecciona `GitHub Actions`
   - El deployment se realizará automáticamente con cada push

2. **Configurar permisos:**
   - Ve a `Settings` > `Actions` > `General`
   - En `Workflow permissions`, selecciona `Read and write permissions`
   - Marca `Allow GitHub Actions to create and approve pull requests`

3. **Variables de entorno (si usas EmailJS):**
   - Ve a `Settings` > `Secrets and variables` > `Actions`
   - Añade tus secrets:
     - `VITE_EMAILJS_SERVICE_ID`
     - `VITE_EMAILJS_TEMPLATE_ID`
     - `VITE_EMAILJS_PUBLIC_KEY`

### Workflow de CI/CD

El workflow incluye:
- ✅ **Lint**: Verificación de estilo de código con ESLint
- 🔍 **Type Check**: Verificación de tipos con TypeScript
- 🏗️ **Build**: Construcción del proyecto para producción
- 🚀 **Deploy**: Despliegue automático a GitHub Pages

### Despliegue manual

Si prefieres realizar el deployment manualmente:
```bash
npm run deploy
```

## 🔧 Configuración del proyecto

### Estructura de archivos
```
src/
├── components/         # Componentes React reutilizables
│   ├── ui/            # Componentes de interfaz base
│   ├── Hero/          # Sección hero
│   ├── About/         # Sección about
│   ├── Projects/      # Sección de proyectos
│   ├── Contact/       # Sección de contacto
│   └── ...
├── context/           # Contextos de React (tema, idioma)
├── hooks/             # Hooks personalizados
├── data/              # Datos estáticos y configuración
├── lib/               # Utilidades y configuraciones
├── assets/            # Imágenes y recursos estáticos
└── ...
```

### Personalización

#### Configuración base (`vite.config.ts`)
- `base`: Ruta base para GitHub Pages (`"/portfolio/"`)
- `target`: Compatibilidad con navegadores (`es2020`)

#### Variables de entorno
Crea un archivo `.env` con:
```env
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID=tu_template_id  
VITE_EMAILJS_PUBLIC_KEY=tu_public_key
```

## 🐛 Solución de problemas

### Error: Página en blanco en GitHub Pages
- Verifica que `base: "/portfolio/"` esté configurado correctamente en `vite.config.ts`
- Asegúrate de que GitHub Pages esté configurado para usar `GitHub Actions` como source

### Error de dependencias
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error de tipos TypeScript
```bash
npm run typecheck
```

## 📄 Licencia

Este proyecto está distribuido bajo la licencia MIT. Puedes usarlo y modificarlo libremente, siempre que conserves este aviso de licencia.

Consulta el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Desarrollado por

**Isaac Pepió Tàrrega**
- 🌐 [Web](https://ipepio.dev)
- 📧 [Email](mailto:hola@ipepio.dev)
- 💼 [LinkedIn](https://linkedin.com/in/ipepio)
- 🐙 [GitHub](https://github.com/ipepio)
