# Use Node.js image to build the Vite app
FROM node:latest as builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build
COPY ./src ./src
COPY ./patches ./patches
COPY ./public ./public
COPY vite.config.js ./

RUN npx patch-package
RUN npm run build

# Use Nginx to serve the static files
FROM nginx:latest

# Copy the built files from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose the necessary port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]