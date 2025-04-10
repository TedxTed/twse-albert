# Use a more recent Node.js version
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Build the application
RUN npm run build

# Set the correct production environment
ENV NODE_ENV production

# Expose the port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
