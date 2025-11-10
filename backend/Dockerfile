# ===============================================
# Valuva Backend Dockerfile
# -----------------------------------------------
# Production-grade Node + Prisma container setup
# ===============================================

# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy rest of the code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 4000

# Start server
CMD ["npm", "run", "dev"]
