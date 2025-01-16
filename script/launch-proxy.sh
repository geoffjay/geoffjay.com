#!/bin/bash
set -e

caddy start --config /etc/caddy/Caddyfile --adapter caddyfile
