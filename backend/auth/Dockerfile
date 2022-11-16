FROM node:alpine

WORKDIR /home/backend/auth

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8060

CMD ["npm", "start"]