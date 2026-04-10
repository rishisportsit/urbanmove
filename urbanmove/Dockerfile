# Use Node.js 18 base image
FROM node:18-slim

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application
CMD [ "node", "index.js" ]
