#!/bin/bash

if ! ip link show wg0 &>/dev/null; then
    echo "FAIL: WireGuard interface not found"
    exit 1
fi

if ! wg show wg0 &>/dev/null; then
    echo "FAIL: WireGuard not running"
    exit 1
fi

echo "OK: WireGuard gateway healthy"
exit 0
