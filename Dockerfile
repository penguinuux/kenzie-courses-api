FROM node:17.6.0

WORKDIR /app

COPY package*.json /app/

RUN yarn

COPY . /app/

ENV NODE_PATCH ./app/src