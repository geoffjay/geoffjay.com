# WireGuard VPN Gateway for Fly.io

This sets up a WireGuard VPN that allows Fly.io applications to access services on your private network.

## Architecture

```
Fly.io Apps (*.internal) --> VPN Gateway (10.10.0.1) --> Linux Server (10.10.0.2) --> Private Network Services
```

- **VPN Gateway**: Runs on Fly.io, accepts incoming WireGuard connections
- **Linux Server**: On your private network, initiates outbound connection to gateway
- **NAT Traversal**: The client initiates the connection, solving NAT/firewall issues

## Network Configuration

| Component        | WireGuard IP | Description         |
| ---------------- | ------------ | ------------------- |
| Gateway (Fly.io) | 10.10.0.1    | WireGuard server    |
| Linux Server     | 10.10.0.2    | WireGuard client    |
| Private Network  | 192.168.x.x  | Your local services |

## Setup Instructions

### Prerequisites

- Fly.io CLI installed and authenticated
- WireGuard tools installed locally (`brew install wireguard-tools` or `apt install wireguard-tools`)
- A Linux server on your private network

### Step 1: Generate WireGuard Keys

Run locally (not on Fly.io):

```bash
cd vpn
chmod +x scripts/generate-keys.sh
./scripts/generate-keys.sh
```

This creates a `keys/` directory with:

- `gateway-private.key` / `gateway-public.key` (for Fly.io)
- `client-private.key` / `client-public.key` (for Linux server)

**IMPORTANT**: Never commit these keys to git!

### Step 2: Deploy VPN Gateway to Fly.io

```bash
cd vpn

# Create the Fly.io app
fly apps create vpn-geoffjay-com

# Set the secrets (use values from Step 1)
fly secrets set WG_PRIVATE_KEY="<gateway-private-key>" --app vpn-geoffjay-com
fly secrets set WG_CLIENT_PUBLIC_KEY="<client-public-key>" --app vpn-geoffjay-com

# Deploy
fly deploy

# Allocate a dedicated IPv4 for UDP (required for WireGuard)
fly ips allocate-v4 --app vpn-geoffjay-com
```

### Step 3: Configure Linux Server

Choose the setup method based on your Linux distribution:

#### Standard Linux (Debian, Ubuntu, Fedora, etc.)

```bash
# Copy the setup script
scp vpn/client/setup-client.sh user@your-server:/tmp/

# SSH to the server and run setup
ssh user@your-server
sudo bash /tmp/setup-client.sh
```

#### CoreOS / Fedora CoreOS (Container-based)

CoreOS uses an immutable filesystem, so WireGuard runs in a container:

```bash
# Copy the CoreOS setup script
scp vpn/client/setup-coreos.sh user@your-server:/tmp/

# SSH to the server and run setup
ssh user@your-server
sudo bash /tmp/setup-coreos.sh
```

This creates a Podman quadlet that runs WireGuard in a container.

You'll need for either method:

- Client private key (from Step 1)
- Gateway public key (from Step 1)

### Step 4: Start the VPN

#### Standard Linux

```bash
# Start WireGuard
sudo wg-quick up wg0

# Enable on boot
sudo systemctl enable wg-quick@wg0

# Verify connection
sudo wg show
```

#### CoreOS

```bash
# Reload systemd to pick up the quadlet
sudo systemctl daemon-reload

# Start WireGuard container
sudo systemctl start wireguard

# Enable on boot
sudo systemctl enable wireguard

# Verify connection
sudo podman exec wireguard-client wg show
```

### Step 5: Test Connectivity

From a Fly.io app:

```bash
# SSH into the VPN Fly.io app
fly ssh console --app vpn-geoffjay-com

# Ping the Linux server via WireGuard
ping 10.10.0.2

# Access a service on the private network
curl http://192.168.1.100:8080
```

## Using the VPN from Fly.io Apps

Access private network services directly by IP:

```
postgres://user:pass@192.168.1.100:5432/mydb
http://192.168.1.50:3000/api
```

The gateway routes traffic for `192.168.0.0/16`, `10.0.0.0/8`, and `172.16.0.0/12`.

## Troubleshooting

### Check Gateway Status

```bash
fly ssh console --app vpn-geoffjay-com
wg show wg0
```

### Check Client Status

On your Linux server (standard):

```bash
sudo wg show wg0
```

On CoreOS:

```bash
sudo podman exec wireguard-client wg show
```

Look for:

- `latest handshake`: Should be recent (within last few minutes)
- `transfer`: Shows data sent/received

### Common Issues

1. **No handshake on client**

   - Verify the gateway public key is correct
   - Check that port 51820/UDP is open on Fly.io
   - Ensure `PersistentKeepalive = 25` is set on client

2. **Handshake but no traffic**

   - Check IP forwarding is enabled on both ends
   - Verify iptables rules are correct
   - Check AllowedIPs includes the right subnets

3. **Connection drops**
   - The VPN gateway has `min_machines_running = 1` to stay always on
   - Check Fly.io app status: `fly status --app vpn-geoffjay-com`

### View Logs

```bash
fly logs --app vpn-geoffjay-com
```

## Security Considerations

1. **Key Management**

   - Generate keys locally, never commit to git
   - Use Fly.io secrets for private keys
   - Delete the `keys/` directory after setup

2. **Network Segmentation**

   - Only expose necessary services on the private network
   - Use firewall rules on the Linux server to restrict access

3. **Access Control**
   - The VPN only allows Fly.io apps to access the private network
   - The Linux server does not have access to Fly.io internal network

## File Structure

```
vpn/
├── README.md                       # This file
├── fly.toml                        # Fly.io app configuration
├── Dockerfile                      # WireGuard gateway container
├── scripts/
│   ├── entrypoint.sh               # Gateway startup script
│   ├── generate-keys.sh            # Key generation utility
│   └── health-check.sh             # Health check script
├── config/
│   └── wg0.conf.template           # Gateway config template (reference)
└── client/
    ├── setup-client.sh             # Standard Linux setup script
    ├── setup-coreos.sh             # CoreOS setup script (container-based)
    ├── Dockerfile                  # Client container image
    ├── entrypoint.sh               # Client container entrypoint
    ├── docker-compose.yml          # Docker Compose for client
    ├── wireguard-client.service    # Systemd service (Docker)
    └── wg0.conf.template           # Client config template (reference)
```
