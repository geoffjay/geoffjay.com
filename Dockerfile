FROM caddy:2.5.2-alpine

RUN apk add bash

COPY proxy/Caddyfile.prod /etc/caddy/Caddyfile

COPY client /usr/share/caddy

COPY script/launch-proxy.sh /proxy.sh
CMD /proxy.sh
