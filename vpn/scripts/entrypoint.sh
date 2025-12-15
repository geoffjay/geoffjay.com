#!/bin/bash
set -e

echo "=== WireGuard Gateway Startup ==="

# Enable IP forwarding
echo "Enabling IP forwarding..."
echo 1 > /proc/sys/net/ipv4/ip_forward
echo 1 > /proc/sys/net/ipv6/conf/all/forwarding 2>/dev/null || true

# Validate required secrets
if [ -z "$WG_PRIVATE_KEY" ]; then
    echo "ERROR: WG_PRIVATE_KEY secret is not set"
    exit 1
fi

if [ -z "$WG_CLIENT_PUBLIC_KEY" ]; then
    echo "ERROR: WG_CLIENT_PUBLIC_KEY secret is not set"
    exit 1
fi

# Generate WireGuard configuration from secrets
echo "Generating WireGuard configuration..."
cat > /etc/wireguard/wg0.conf << EOF
[Interface]
Address = ${WG_GATEWAY_IP:-10.10.0.1}/24
ListenPort = ${WG_PORT:-51820}
PrivateKey = ${WG_PRIVATE_KEY}

PostUp = iptables -A FORWARD -i %i -j ACCEPT
PostUp = iptables -A FORWARD -o %i -j ACCEPT
PostUp = iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

PostDown = iptables -D FORWARD -i %i -j ACCEPT
PostDown = iptables -D FORWARD -o %i -j ACCEPT
PostDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
PublicKey = ${WG_CLIENT_PUBLIC_KEY}
AllowedIPs = 10.10.0.2/32, ${PRIVATE_NETWORKS:-192.168.0.0/16}
EOF

chmod 600 /etc/wireguard/wg0.conf

# Bring up WireGuard interface
echo "Starting WireGuard interface..."
wg-quick up wg0

echo ""
echo "=== WireGuard Gateway Ready ==="
echo "Gateway IP: ${WG_GATEWAY_IP:-10.10.0.1}"
echo "Listen Port: ${WG_PORT:-51820}"
echo "Interface status:"
wg show wg0
echo ""

# Start HTTP health check server
echo "Starting health check server on port 8080..."
while true; do
    { echo -e "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nConnection: close\r\n\r\nWireGuard Gateway OK"; } | nc -l -p 8080 -q 1 2>/dev/null || true
done &

# Monitor WireGuard connection
echo "Monitoring WireGuard connection..."
while true; do
    sleep 60
    PEERS=$(wg show wg0 latest-handshakes 2>/dev/null | wc -l)
    echo "$(date): Active peers: $PEERS"

    if ! ip link show wg0 &>/dev/null; then
        echo "ERROR: WireGuard interface down, restarting..."
        wg-quick up wg0
    fi
done
