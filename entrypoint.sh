#!/bin/sh
set -e

echo "[entrypoint] Starting Portal with Nginx Proxy..."

# Validate required environment variable
if [ -z "$MESH_API_KEY" ]; then
    echo "[entrypoint] ERROR: MESH_API_KEY environment variable not set!"
    echo "[entrypoint] Please configure this in App Platform settings"
    exit 1
fi

echo "[entrypoint] MESH_API_KEY is set (length: ${#MESH_API_KEY})"
echo "[entrypoint] First 10 chars: ${MESH_API_KEY:0:10}..."
echo "[entrypoint] Configuring Nginx to proxy /mcp/* to https://mesh.aditya-raman.com"

# Check if envsubst is available
if ! command -v envsubst >/dev/null 2>&1; then
    echo "[entrypoint] ERROR: envsubst not found! Installing gettext..."
    apk add --no-cache gettext
fi

# Export for envsubst
export MESH_API_KEY

# Substitute environment variables in nginx template
envsubst '$$MESH_API_KEY' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Verify substitution worked
echo "[entrypoint] Verifying substitution..."
if grep -q '$MESH_API_KEY' /etc/nginx/conf.d/default.conf; then
    echo "[entrypoint] ERROR: Variable was NOT substituted!"
    echo "[entrypoint] Showing X-API-KEY line:"
    grep "X-API-KEY" /etc/nginx/conf.d/default.conf
    exit 1
fi

echo "[entrypoint] ✓ Variable successfully substituted"
echo "[entrypoint] X-API-KEY header (first 20 chars):"
grep "proxy_set_header X-API-KEY" /etc/nginx/conf.d/default.conf | sed 's/.*X-API-KEY \(.\{20\}\).*/\1.../'


# Test nginx configuration
echo "[entrypoint] Testing Nginx configuration..."
nginx -t

# Start nginx in foreground
echo "[entrypoint] Starting Nginx..."
exec nginx -g 'daemon off;'
