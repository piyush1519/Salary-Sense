FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "src/index.js"]