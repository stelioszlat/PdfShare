FROM node:alpine

WORKDIR /home/backend/core

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

ENTRYPOINT ["npm", "start"]