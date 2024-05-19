FROM node:20.10-alpine

WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json

RUN yarn

RUN yarn install

COPY . /usr/src/app/

EXPOSE 3000

ENTRYPOINT [ "yarn", "run", "start" ]