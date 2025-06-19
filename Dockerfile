# Etapa 1: Construcción
FROM node:20 AS app-build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Exponer el puerto correcto (6173 según package.json)
EXPOSE 6173

# Ejecutar el servidor de Vite en el puerto 6173
CMD ["npm", "run", "preview"]
