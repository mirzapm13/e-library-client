FROM node:22.11.0-alpine3.19 AS build

WORKDIR /app


# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

COPY .env.prod /app/.env.prod

# Copy the Angular app's source code
COPY . .

# Install dependencies
RUN npm install --legacy-peer-deps

# Build the Angular application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy built Angular app files to Nginx HTML folder
COPY --from=build /app/dist/elibrary-client/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]



