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
RUN apt-get update && apt-get install -y \
    gcc \
    libffi-dev

# Copy project
COPY . /usr/src/app/
EXPOSE 8000
CMD python3 manage.py makemigrations && python3 manage.py migrate

ENTRYPOINT python3 manage.py makemigrations && python3 manage.py migrate && sleep 5 && python3 manage.py runserver 0.0.0.0:8000
