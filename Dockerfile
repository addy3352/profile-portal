# ==========================================
# Stage 1: Build React Application
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# ==========================================
# Stage 2: Nginx with Proxy Configuration
# ==========================================
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy custom nginx configuration template
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Copy the React build from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port 80
EXPOSE 80

# Set entrypoint
ENTRYPOINT ["/entrypoint.sh"]
