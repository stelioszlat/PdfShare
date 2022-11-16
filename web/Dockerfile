FROM node:alpine

WORKDIR /home/backend/web

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8090

WORKDIR /home/backend/web/frontend

RUN npm install

CMD ["npm", "run", "build"]

WORKDIR /home/backend/web

CMD ["npm", "start"]