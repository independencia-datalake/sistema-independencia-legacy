from .base import *

DEBUG = True

ALLOWED_HOSTS = ['*']

CORS_ALLOWED_ORIGINS = [
    'http://localhost:4200',            ## PATH OF FRONTEND
]
CORS_ALLOWED_ORIGIN_REGEXES = r'^/api/.*'
CORS_ALLOW_CREDENTIALS = True


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'local-db.sqlite3',
    }
}
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
