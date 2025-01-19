FROM node:23-alpine3.20 AS build

COPY client /client

WORKDIR /client

COPY yarn.lock .

RUN yarn install
RUN yarn build

FROM caddy:2.5.2-alpine

RUN apk add bash

COPY proxy/Caddyfile.prod /etc/caddy/Caddyfile

COPY --from=build /client/dist /usr/share/caddy

COPY script/launch-proxy.sh /proxy.sh
CMD /proxy.sh
