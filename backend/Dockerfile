FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate
RUN npx prisma migrate deploy

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
