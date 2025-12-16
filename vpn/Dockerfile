FROM alpine:3.20

RUN apk add --no-cache \
    wireguard-tools \
    iptables \
    ip6tables \
    bash \
    curl \
    iproute2 \
    procps

RUN mkdir -p /etc/wireguard /scripts

COPY scripts/entrypoint.sh /scripts/
COPY scripts/health-check.sh /scripts/
COPY config/wg0.conf.template /etc/wireguard/

RUN chmod +x /scripts/*.sh

EXPOSE 51820/udp
EXPOSE 8080/tcp

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD /scripts/health-check.sh

ENTRYPOINT ["/scripts/entrypoint.sh"]
