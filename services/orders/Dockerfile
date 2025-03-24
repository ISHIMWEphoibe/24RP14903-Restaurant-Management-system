FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY services/orders/ordersService.js ./
COPY config/database.js ./config/

RUN npm install

CMD ["node", "ordersService.js"]