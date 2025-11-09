#!/bin/sh
# This script substitutes environment variables in the nginx template and starts the server.

# We specify the variables to substitute to avoid replacing other nginx variables like $host.
envsubst '${MESH_URL},${MESH_API_KEY_HEALTH},${MESH_API_KEY_PORTAL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Print the generated config for debugging purposes
echo "--- Generated nginx.conf ---"
cat /etc/nginx/conf.d/default.conf
echo "--------------------------"

# Start nginx in the foreground
nginx -g 'daemon off;'
