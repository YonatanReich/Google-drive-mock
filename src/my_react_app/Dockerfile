FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies (using npm install to handle lock file sync issues)
# Skip optional and dev dependencies to reduce size (~20% faster)
RUN npm install --omit=optional --omit=dev && npm cache clean --force

# Copy application code
COPY . .

EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]