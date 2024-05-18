FROM node:20.10-alpine

WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json

RUN yarn install

COPY . .

EXPOSE 3000

ENTRYPOINT [ "yarn", "start" ]