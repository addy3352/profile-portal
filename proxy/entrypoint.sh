#!/bin/sh
set -e

echo "[proxy] Starting mesh proxy..."
echo "[proxy] Upstream: https://mesh.aditya-raman.com"

# Substitute API_KEY in nginx config
envsubst '$API_KEY' < /etc/nginx/nginx.conf > /etc/nginx/nginx.conf.tmp
mv /etc/nginx/nginx.conf.tmp /etc/nginx/nginx.conf

nginx -t
exec nginx -g 'daemon off;'