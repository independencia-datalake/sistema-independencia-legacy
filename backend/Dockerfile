# Dockerfile

# Usa una imagen de Python oficial como base
FROM python:3.9

# Establece variables de entorno
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV DJANGO_SETTINGS_MODULE settings.dev
ENV SECRET_KEY vylll%eshxe0o+mh40oahu1!d4!g)kq23dhseh9vhs-f4g%*$q
ENV DATABASE_ENGINE django.db.backends.postgresql
ENV DATABASE_NAME sistema_independencia
ENV DATABASE_USER datalake
ENV DATABASE_PASSWORD D4t4l4k3
# ENV DATABASE_HOST localhost
ENV DATABASE_HOST db
ENV DATABASE_PORT 5432

# Configura el directorio de trabajo
WORKDIR /app

# Instala las dependencias necesarias para psycopg2
RUN apt-get update && apt-get install -y libpq-dev build-essential

# Copia requirements.txt y lo instala
COPY requirements.txt /app/
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

RUN apt-get update && apt-get install -y postgresql-client

# Copia el código de la aplicación
COPY . /app/

EXPOSE 8000

CMD ["python", "/app/manage.py", "runserver", "0.0.0.0:8000"]
