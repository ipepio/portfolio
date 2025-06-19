# 🚀 Portfolio - Isaac Pepió Tàrrega

Este es mi portfolio personal, desarrollado con **React**, **Vite** y **TypeScript**.

El objetivo del proyecto es mostrar mis trabajos, habilidades y experiencia como desarrollador frontend en una web moderna, rápida y escalable.

## 🛠️ Tecnologías utilizadas

- ⚛️ React
- ⚡ Vite
- 🧠 TypeScript

### Node.js 20

Este proyecto utiliza **Node.js 20** en los workflows de GitHub Actions y en el
`Dockerfile`. Se recomienda emplear esta versión o una superior para evitar
problemas de compatibilidad.

🚀 Cómo iniciar el proyecto
```bash
npm install     # Instala las dependencias
npm run dev     # Inicia el servidor de desarrollo
```
Antes de compilar o ejecutar la aplicación crea un archivo `.env` basado en
`.env.example` e introduce tus credenciales de EmailJS.
📦 Build para producción
```bash
npm run build
```
🚀 Despliegue en GitHub Pages
```bash
npm run deploy
```
Las builds se compilan y despliegan de forma automática al hacer push a la rama `master` gracias al workflow de GitHub Actions, por lo que no es necesario ejecutar el comando anterior a menos que quieras hacerlo manualmente.
Para que el sitio funcione correctamente, asegúrate de que GitHub Pages esté configurado para publicar desde la rama `gh-pages`. Si se usa `master` se mostrará una página en blanco porque solo contiene los archivos fuente.
=======
📄 Licencia

Este proyecto está bajo una licencia abierta. Puedes usarlo y modificarlo libremente, siempre que me menciones como autor original.

Consulta el archivo LICENSE para más detalles.

👨‍💻 Desarrollado por Isaac Pepió Tàrrega
