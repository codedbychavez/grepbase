# syntax=docker/dockerfile:1

# Use the latest Node.js image
FROM node:latest

# Set the working directory inside the container
WORKDIR /backend

# copy the package.json and the package-lock.json fro better caching
COPY backend/package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the backend file
COPY backend/ .

# Build TypeScript
RUN npm run build

# Expos the port (change is needed)
EXPOSE 3000

# Command to start the backend
CMD ["npm", "start"]



