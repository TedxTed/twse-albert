# Use a more recent Node.js version
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy all files
COPY . .

# Set the correct production environment
ENV NODE_ENV production

# Expose the port
EXPOSE 8080

# Start the application
CMD ["pnpm", "run", "dev"]
