FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN mkdir uploads

EXPOSE 3001
CMD [ "node", "services" ]
