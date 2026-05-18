#!/bin/sh
set -e

echo "Starting backend server..."
exec node dist/server.js
