# ! /bin/sh
cd ../..
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py loaddata database/fixtures/core/CI.json
python manage.py loaddata database/fixtures/core/UV.json