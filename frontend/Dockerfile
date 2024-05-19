FROM node:20.10-alpine

WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json

COPY yarn.lock /usr/src/app/yarn.lock

RUN yarn install

COPY . /usr/src/app/

RUN yarn build

EXPOSE 3000

ENTRYPOINT [ "yarn", "run", "start" ]