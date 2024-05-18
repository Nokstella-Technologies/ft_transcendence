FROM python:3.12.3-alpine

WORKDIR /usr/src/app

# Prevent Python from writing .pyc files
ENV PYTHONDONTWRITEBYTECODE 1

# Ensesure Python output is sent directly to the terminal without buffering
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip

COPY ./requirements /usr/src/app/requirements

RUN pip install -r requirements

COPY ./entrypoint.sh /usr/src/app/entrypoint.sh

# RUN chmod +x /usr/src/app/entrypoint.sh

COPY . /usr/src/app/

ENTRYPOINT [ "/usr/src/app/entrypoint.sh" ]