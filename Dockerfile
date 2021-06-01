FROM node:14-alpine

RUN apk update && rm -rf /var/cache/apk/*

WORKDIR /app/src

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .

EXPOSE 3000

CMD ["npm" , "start"]