# Multi-stage build for React app with CRACO - Optimized for Dokploy

# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false --silent

# Set environment variables BEFORE copying source code
ENV NODE_ENV=production
ENV CI=true
ENV FAST_REFRESH=false
ENV GENERATE_SOURCEMAP=false

# Copy source code
COPY . .

# Copy environment file if it exists (for Dokploy)
RUN if [ -f .env.dokploy ]; then cp .env.dokploy .env.production; fi

# Build the application with explicit NODE_ENV
RUN NODE_ENV=production npm run build

# Production stage
FROM nginx:1.25-alpine

# Copy built app from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]