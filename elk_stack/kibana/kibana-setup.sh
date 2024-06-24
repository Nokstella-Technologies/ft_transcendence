#!/bin/bash

# Substituir variáveis de ambiente no site.conf

# Wait for Elasticsearch to be up
until curl -s http://elasticsearch:9200 > /dev/null; do
  echo "Waiting for Elasticsearch..."
  sleep 5
done

# Set passwords for built-in users
curl -X POST "http://elasticsearch:9200/_security/user/$ELASTICSEARCH_USERNAME/_password" -H "Content-Type: application/json" -d'{"password":'$ELASTICSEARCH_PASSWORD'}'
curl -X POST "http://elasticsearch:9200/_security/user/kibana_system/_password" -H "Content-Type: application/json" -d'{"password":'$ELASTICSEARCH_PASSWORD'}'

# Wait for Kibana to be up
until curl -s http://kibana:5601 > /dev/null; do
  echo "Waiting for Kibana..."
  sleep 5
done

# Import the saved objects


echo "Kibana index pattern imported."

exec $@ & curl -X POST "http://kibana:5601/api/saved_objects/_import overwrite=true" -H "kbn-xsrf: true"  --form file=@/usr/share/kibana/config/kibana_index_pattern.json
