#!/bin/sh
set -e

# --- Log for visibility
echo "[entrypoint] Starting Nginx with template substitution..."

# Ensure cert paths exist (DO injects SSL via proxy, but we keep these consistent)
mkdir -p /etc/ssl/certs /etc/ssl/private

# Replace environment variables in the nginx template
if [ -f /etc/nginx/conf.d/default.conf.template ]; then
  echo "[entrypoint] Applying nginx.conf.template..."
  envsubst '$MESH_API_KEY_HEALTH' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
else
  echo "[entrypoint] WARNING: Template not found!"
fi

# Verify config syntax before starting
nginx -t

# Launch nginx in the foreground (required for DO container runtime)
echo "[entrypoint] Starting nginx..."
exec nginx -g 'daemon off;'