FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN pip install --upgrade pip

COPY requirements.txt /app/

# Install system dependencies required for mysqlclient
RUN apt-get update \
    && apt-get install -y pkg-config default-libmysqlclient-dev build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

# Collect static files for production
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# gunicorn instead of runserver — required for production
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]