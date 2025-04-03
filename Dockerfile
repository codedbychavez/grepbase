# Use an official Node.js image as the build environment
FROM node:latest AS build

# Set the working directory inside the container
WORKDIR /frontend

# Copy package.json and package-lock.json first (for efficient caching)
COPY frontend/package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the frontend files
COPY frontend/ .

# Build the Vue app
RUN npm run build

# Use a lightweight Nginx image to serve the built frontend
FROM nginx:alpine

# Copy built files to the Nginx default web root
COPY --from=build /frontend/dist /usr/share/nginx/html

# Expose port 80 for serving the app
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
