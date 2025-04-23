FROM node:16-alpine

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY src src
COPY public public

EXPOSE 3000

CMD ["node", "src/index.js"]
