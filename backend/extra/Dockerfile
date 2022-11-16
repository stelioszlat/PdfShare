FROM node:alpine

WORKDIR /home/backend/extra

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8070

CMD ["npm", "start"]