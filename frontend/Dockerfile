# Build stage (KEEP THIS)
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage (UPDATED)
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# This is the critical "missing link" that fixes the 404s
COPY nginx.conf /etc/nginx/conf.d/default.conf 

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]