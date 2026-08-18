#!/bin/bash
# Cloudflare DNS helper using a scoped API token (read from ~/.cloudflare-cf-token)
# Usage: cf-dns.sh getundercut.sh 76.76.21.21
TOKEN=$(cat ~/.cloudflare-cf-token 2>/dev/null)
if [ -z "$TOKEN" ]; then echo "ERROR: no token at ~/.cloudflare-cf-token"; exit 1; fi
DOMAIN="$1"
IP="${2:-76.76.21.21}"
ZID=$(curl -s "https://api.cloudflare.com/client/v4/zones?name=$DOMAIN" -H "Authorization: Bearer $TOKEN" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{console.log(JSON.parse(d).result?.[0]?.id||'')}catch(e){console.log('')}})")
if [ -z "$ZID" ]; then echo "ERROR: zone not found for $DOMAIN"; exit 1; fi
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZID/dns_records" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"type\":\"A\",\"name\":\"$1\",\"content\":\"$IP\",\"ttl\":1,\"proxied\":false}" | \
  node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const j=JSON.parse(d);console.log(j.success?'DNS record created: '+j.result.name+' -> '+j.result.content:(j.errors||[]).map(e=>e.message).join('; '))})"