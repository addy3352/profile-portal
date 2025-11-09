# ===== Build Stage =====
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first for Docker cache (faster builds)
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install

# Copy rest and build
COPY . .
RUN npm run build

# ===== Run Stage =====
FROM nginx:1.27-alpine

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config template and entrypoint script
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# For DO App Platform (health check)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]

