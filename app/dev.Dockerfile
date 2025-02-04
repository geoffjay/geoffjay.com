ARG NODE_VERSION=22.1.0

FROM node:${NODE_VERSION}-slim AS base

WORKDIR /app

ENV NODE_ENV="development"
ARG YARN_VERSION=1.22.4

RUN npm install -g yarn@$YARN_VERSION --force

FROM base AS build

RUN apt-get update -qq && \
  apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

COPY package.json .

RUN yarn install --frozen-lockfile --production=false

EXPOSE 5173
ENTRYPOINT [ "yarn", "run", "dev" ]
