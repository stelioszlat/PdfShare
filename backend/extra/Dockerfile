FROM node:latest

WORKDIR /home/backend/extra

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8082

CMD ["npm", "start"]