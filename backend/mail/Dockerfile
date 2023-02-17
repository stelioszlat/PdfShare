FROM node:alpine

WORKDIR /home/backend/mail

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8085

CMD ["npm", "start"]