FROM node:18-alpine

WORKDIR /usr/src/project

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies (using npm install to handle lock file sync issues)
# Skip optional dependencies and dev dependencies in production
RUN npm install --omit=optional && npm cache clean --force

# Copy application code
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
