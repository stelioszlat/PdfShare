FROM node:alpine

WORKDIR /home/backend/auth

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]