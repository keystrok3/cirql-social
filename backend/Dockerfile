
# Use Node.js LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first, for caching
COPY package*.json ./

RUN npm install

# Copy the rest of your backend code (server.js + src)
COPY . .

# The port your server listens on
EXPOSE 8000

# Start the server
CMD ["npm", "start"]