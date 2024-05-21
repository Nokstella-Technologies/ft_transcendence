FROM node:alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json .

EXPOSE 3000

ENTRYPOINT [ "/bin/sh", "entry.sh" ]