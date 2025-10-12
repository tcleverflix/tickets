# Build stage
FROM node:18 as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
# Use npm install to update lock if mismatched and install dev deps for build
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build files
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Install curl for healthchecks and debugging
RUN apk add --no-cache curl


# Expose port
EXPOSE 3000

# Health check using curl
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -fsS http://localhost:3000/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]