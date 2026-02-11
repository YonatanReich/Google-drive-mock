FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8081

CMD ["sh", "-c", "node generate-config.js && npx expo start --go"]