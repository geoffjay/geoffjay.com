ARG NODE_VERSION=22.1.0

FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Vite"

WORKDIR /app

ENV NODE_ENV="production"
ARG YARN_VERSION=1.22.4

RUN npm install -g yarn@$YARN_VERSION --force

FROM base AS build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

COPY . .

RUN yarn run build
RUN yarn install --production=true

FROM nginx:alpine3.20

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD [ "/usr/sbin/nginx", "-g", "daemon off;" ]
