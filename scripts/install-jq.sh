#!/usr/bin/env bash

# Vercel doesn't have jq installed by default, so we need to install it ourselves
# then we can run update-history.sh during the build process.

curl -L https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 -o /vercel/workpath0/bin/jq
chmod +x /vercel/workpath0/bin/jq
export PATH="/vercel/workpath0/bin:$PATH"
