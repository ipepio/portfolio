import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: "/portfolio/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    allowedHosts: ["ipepio.dev"], // 🔥 Permitir el dominio personalizado
    // port: 6173, // 🔥 Asegurar que usa el puerto correcto
    // host: true, // 🔥 Permitir acceso desde cualquier host
  },
})
