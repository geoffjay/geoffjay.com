FROM node:23-alpine3.20 AS build-main

COPY client /client

WORKDIR /client

RUN yarn install
RUN yarn build

FROM node:23-alpine3.20 AS build-projects

COPY projects /projects

WORKDIR /projects

RUN yarn install
RUN yarn build

FROM nginx:alpine3.20

COPY ./proxy/nginx.conf /etc/nginx/nginx.conf

COPY --from=build-main /client/dist /usr/share/nginx/html
COPY --from=build-projects /projects/dist /usr/share/nginx/html/projects

# Start the server by default, this can be overwritten at runtime
EXPOSE 8080
CMD [ "/usr/sbin/nginx", "-g", "daemon off;" ]
