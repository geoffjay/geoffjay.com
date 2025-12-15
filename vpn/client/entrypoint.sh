#!/bin/bash
set -e

echo "=== WireGuard Client Startup ==="

# Enable IP forwarding
echo "Enabling IP forwarding..."
echo 1 > /proc/sys/net/ipv4/ip_forward

# Validate required environment variables
if [ -z "$WG_PRIVATE_KEY" ]; then
    echo "ERROR: WG_PRIVATE_KEY is not set"
    exit 1
fi

if [ -z "$WG_GATEWAY_PUBLIC_KEY" ]; then
    echo "ERROR: WG_GATEWAY_PUBLIC_KEY is not set"
    exit 1
fi

WG_ENDPOINT="${WG_ENDPOINT:-vpn-geoffjay-com.fly.dev:51820}"
WG_CLIENT_IP="${WG_CLIENT_IP:-10.10.0.2}"
WG_ALLOWED_IPS="${WG_ALLOWED_IPS:-10.10.0.0/24}"
HOST_INTERFACE="${HOST_INTERFACE:-eth0}"

echo "Generating WireGuard configuration..."
cat > /etc/wireguard/wg0.conf << EOF
[Interface]
Address = ${WG_CLIENT_IP}/24
PrivateKey = ${WG_PRIVATE_KEY}

PostUp = iptables -A FORWARD -i %i -j ACCEPT
PostUp = iptables -A FORWARD -o %i -j ACCEPT
PostUp = iptables -t nat -A POSTROUTING -o ${HOST_INTERFACE} -j MASQUERADE

PostDown = iptables -D FORWARD -i %i -j ACCEPT
PostDown = iptables -D FORWARD -o %i -j ACCEPT
PostDown = iptables -t nat -D POSTROUTING -o ${HOST_INTERFACE} -j MASQUERADE

[Peer]
PublicKey = ${WG_GATEWAY_PUBLIC_KEY}
Endpoint = ${WG_ENDPOINT}
AllowedIPs = ${WG_ALLOWED_IPS}
PersistentKeepalive = 25
EOF

chmod 600 /etc/wireguard/wg0.conf

echo "Starting WireGuard interface..."
wg-quick up wg0

echo ""
echo "=== WireGuard Client Ready ==="
echo "Client IP: ${WG_CLIENT_IP}"
echo "Gateway Endpoint: ${WG_ENDPOINT}"
echo "Interface status:"
wg show wg0
echo ""

# Keep container running and monitor connection
echo "Monitoring WireGuard connection..."
while true; do
    sleep 60

    if ! ip link show wg0 &>/dev/null; then
        echo "ERROR: WireGuard interface down, restarting..."
        wg-quick up wg0
    else
        HANDSHAKE=$(wg show wg0 latest-handshakes | awk '{print $2}')
        if [ -n "$HANDSHAKE" ] && [ "$HANDSHAKE" != "0" ]; then
            AGE=$(($(date +%s) - HANDSHAKE))
            echo "$(date): Connection healthy, last handshake ${AGE}s ago"
        else
            echo "$(date): Waiting for handshake..."
        fi
    fi
done
