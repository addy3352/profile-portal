#!/bin/sh
set -e

echo "[proxy] Starting smart proxy service..."
echo "[proxy] Upstream: https://mesh.aditya-raman.com"

# Substitute all required API keys in nginx config
envsubst '$MESH_API_KEY_HEALTH $PORTAL_API_KEY' < /etc/nginx/nginx.conf > /etc/nginx/nginx.conf.tmp
mv /etc/nginx/nginx.conf.tmp /etc/nginx/nginx.conf

echo "[proxy] Nginx config after substitution (API keys are hidden):"
# Use sed to hide key values in the log
sed 's/key=\([^&]*\)/key=[REDACTED]/g' /etc/nginx/nginx.conf
echo "---"

# Check config and run nginx
nginx -t
exec nginx -g 'daemon off;'
