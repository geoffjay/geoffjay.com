FROM rust:1.84-slim-bookworm AS base

WORKDIR /blog

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl bash nodejs wget gnupg \
  && apt-get install -y --no-install-recommends apt-transport-https \
  && sh -c 'wget -qO- https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -' \
  && sh -c 'wget -qO- https://storage.googleapis.com/download.dartlang.org/linux/debian/dart_stable.list > /etc/apt/sources.list.d/dart_stable.list' \
  && apt-get update \
  && apt-get -y --no-install-recommends install dart \
  && apt-get clean

RUN curl -L --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/cargo-bins/cargo-binstall/main/install-from-binstall-release.sh | bash

RUN rustup target add wasm32-unknown-unknown
RUN cargo binstall trunk

FROM base AS build

COPY . .

ENV PATH="$PATH:/usr/local/bin"

RUN trunk build --release

FROM nginx:alpine3.20

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /blog/dist /usr/share/nginx/html

EXPOSE 80
CMD [ "/usr/sbin/nginx", "-g", "daemon off;" ]
