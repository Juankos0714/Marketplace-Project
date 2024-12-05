# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto al contenedor
COPY . .

# Compila el código TypeScript
RUN npm run build

# Expone el puerto en el que la aplicación va a correr
EXPOSE 3000

# Define la variable de entorno para la conexión a la base de datos
ENV DATABASE_URL="postgresql://prisma:prisma123@postgres:5432/mydb?schema=public"

# Comando para correr la aplicación
CMD ["npm", "start"]