FROM node:20.10-alpine

WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json

COPY . /usr/src/app/

RUN yarn

# RUN yarn build
# RUN yarn start
# RUN yarn global add react-scripts

EXPOSE 3000

ENTRYPOINT [ "yarn", "run", "start"]