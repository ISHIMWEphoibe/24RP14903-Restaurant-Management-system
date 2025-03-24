FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY services/menu/menuService.js ./
COPY config/database.js ./config/

RUN npm install

CMD ["node", "menuService.js"]