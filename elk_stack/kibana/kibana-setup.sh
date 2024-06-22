#!/bin/bash

# Wait for Elasticsearch to be up
until curl -s http://elasticsearch:9200 > /dev/null; do
  echo "Waiting for Elasticsearch..."
  sleep 5
done

# Set passwords for built-in users
curl -X POST "http://elasticsearch:9200/_security/user/elastic/_password" -H "Content-Type: application/json" -d'{"password":"changeme"}'
curl -X POST "http://elasticsearch:9200/_security/user/kibana_system/_password" -H "Content-Type: application/json" -d'{"password":"changeme"}'

# Wait for Kibana to be up
until curl -s http://kibana:5601 > /dev/null; do
  echo "Waiting for Kibana..."
  sleep 5
done

# Import the saved objects
curl -X POST "http://kibana:5601/api/saved_objects/_import?overwrite=true" \
  -H "kbn-xsrf: true" \
  --form file=@/usr/share/kibana/config/kibana_index_pattern.json

echo "Kibana index pattern imported."