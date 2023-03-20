FROM node:alpine

WORKDIR /home/backend/extra

COPY package*.json ./

RUN npm install

COPY . .

VOLUME [ "/files:/home/beckend/extra/files" ]

EXPOSE 8070

ENTRYPOINT ["npm", "start"]