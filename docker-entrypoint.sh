#!/bin/sh
set -e

cat > /usr/share/nginx/html/env-config.js <<EOF
window._env_ = {
  VITE_API_URL: "${VITE_API_URL:-/api}",
};
EOF

exec "$@"
