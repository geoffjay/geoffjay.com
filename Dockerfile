FROM node:23-alpine3.20 AS build

COPY client /client

WORKDIR /client

RUN yarn install
RUN yarn build

FROM nginx

COPY ./proxy/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /client/dist /usr/share/nginx/html
