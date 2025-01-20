FROM node:23-alpine3.20 AS build

COPY client /client

WORKDIR /client

RUN yarn install
RUN yarn build

FROM nginx:alpine3.20

COPY ./proxy/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /client/dist /usr/share/nginx/html

# Start the server by default, this can be overwritten at runtime
EXPOSE 8080
CMD [ "/usr/sbin/nginx", "-g", "daemon off;" ]
