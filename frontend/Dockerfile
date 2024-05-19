FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json

RUN npm i

EXPOSE 3000

ENTRYPOINT [ "npm", "run" ,"dev"]