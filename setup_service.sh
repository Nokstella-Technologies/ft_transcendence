#!/bin/bash

SERVICE_NAME=$1

if [ -z "$SERVICE_NAME" ]; then
    echo "Usage: ./setup_service.sh <service-name>"
    exit 1
fi

DOCKER_COMPOSE_FILE=docker-compose.yml

# Find an available port starting from 8000
START_PORT=8000
PORT=$START_PORT
while grep -q "    - \"$PORT:$PORT\"" $DOCKER_COMPOSE_FILE; do
    PORT=$((PORT+1))
done

# Create the service directory and set up Django
mkdir -p backend/$SERVICE_NAME
cd backend/$SERVICE_NAME
django-admin startproject $SERVICE_NAME .
python3 manage.py startapp ${SERVICE_NAME}_app

# Create Dockerfile for the service
cat <<EOL > Dockerfile
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /usr/src/app

# Install dependencies
COPY requirements.txt /usr/src/app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy project
COPY . /usr/src/app/
EOL

# Create requirements.txt for the service
cat <<EOL > requirements.txt
Django
djangorestframework
EOL

echo "Django service '$SERVICE_NAME' created with app '${SERVICE_NAME}_app'."
echo "Service '$SERVICE_NAME' added to docker-compose.yml with port $PORT."
