# Importamos la configuración base del proyecto
from .base import *

# Activamos el modo depuración
DEBUG = True

# Especificamos las IPs o dominios que pueden acceder al proyecto
ALLOWED_HOSTS = ['54.207.142.208']

# Configuración de la base de datos del proyecto
DATABASES = {
    'default': {
        'ENGINE': os.getenv('DATABASE_ENGINE'),
        'NAME': os.getenv('DATABASE_NAME'),
        'USER': os.getenv('DATABASE_USER'),
        'PASSWORD': os.getenv('DATABASE_PASSWORD'),
        'HOST': os.getenv('DATABASE_HOST'),
        'PORT': os.getenv('DATABASE_PORT')
    }
}

# Configuración para usar S3 como almacenamiento de archivos media
AWS_ACCESS_KEY_ID=os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY=os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME=os.getenv('AWS_STORAGE_BUCKET_NAME')
AWS_S3_REGION_NAME=os.getenv('AWS_S3_REGION_NAME')
AWS_DEFAULT_ACL = None
AWS_QUERYSTRING_AUTH = False
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
}
AWS_LOCATION = ''

# Configuración para la ubicación de archivos media en S3
DEFAULT_FILE_STORAGE = 'database.core.storage_backends.MediaStorage'
MEDIAFILES_LOCATION = 'media'
MEDIA_URL = f'https://{AWS_STORAGE_BUCKET_NAME}/{MEDIAFILES_LOCATION}/'

# Configuración para la ubicación de archivos estáticos en S3
STATICFILES_STORAGE = 'database.core.storage_backends.StaticStorage'
STATICFILES_LOCATION='static'
STATIC_URL = f'https://{AWS_STORAGE_BUCKET_NAME}/{STATICFILES_LOCATION}/'

