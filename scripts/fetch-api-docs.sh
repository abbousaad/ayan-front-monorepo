#!/bin/bash
set -e

URL="http://localhost:3000/api/v1/docs-json"
OUTPUT="docs/api/openapi.json"

echo "Fetching API docs from $URL..."
curl -sf "$URL" | jq . > "$OUTPUT"
echo "Updated $OUTPUT"
