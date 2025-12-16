#!/bin/bash
set -e

echo "=== WireGuard Key Generation ==="
echo ""

if ! command -v wg &> /dev/null; then
    echo "ERROR: WireGuard tools not installed"
    echo "Install with: brew install wireguard-tools (macOS) or apt install wireguard-tools (Linux)"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KEYS_DIR="$SCRIPT_DIR/../keys"

mkdir -p "$KEYS_DIR"
cd "$KEYS_DIR"

echo "Generating Gateway (Fly.io) keys..."
wg genkey | tee gateway-private.key | wg pubkey > gateway-public.key
echo "  Private key: $(cat gateway-private.key)"
echo "  Public key:  $(cat gateway-public.key)"
echo ""

echo "Generating Client (Linux server) keys..."
wg genkey | tee client-private.key | wg pubkey > client-public.key
echo "  Private key: $(cat client-private.key)"
echo "  Public key:  $(cat client-public.key)"
echo ""

echo "=== Next Steps ==="
echo ""
echo "1. Set Fly.io secrets (run from the vpn/ directory):"
echo "   fly secrets set WG_PRIVATE_KEY=\"$(cat gateway-private.key)\" --app vpn-geoffjay-com"
echo "   fly secrets set WG_CLIENT_PUBLIC_KEY=\"$(cat client-public.key)\" --app vpn-geoffjay-com"
echo ""
echo "2. Copy to your Linux server:"
echo "   - Client private key: $(cat client-private.key)"
echo "   - Gateway public key: $(cat gateway-public.key)"
echo ""
echo "3. IMPORTANT: Delete the keys/ directory after setup:"
echo "   rm -rf $KEYS_DIR"
echo ""
echo "4. Add 'keys/' to .gitignore if not already present"
