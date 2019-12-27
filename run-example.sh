#!/bin/bash

docker run -e ZONEID=YOUR_ZONE_ID \
  -e RECORDSET=your.domain.example.net \
  -e AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY \
  -e AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY \
  -e TTL=300 \
  -e INTERVAL_MINUTES=30 \
  -t aws-dynamic-dns