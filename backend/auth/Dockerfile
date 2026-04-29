FROM node:alpine

WORKDIR /auth

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8060

ENTRYPOINT ["npm", "start"]