# Use Node.js 20 base image (Vite requires Node.js 20+)
FROM node:20-slim

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port 5173 (Vite default)
EXPOSE 5173

# Start the application in dev mode for this prototype
CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0" ]
