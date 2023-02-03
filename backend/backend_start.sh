# ! /bin/sh
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py loaddata database/fixtures/CI.json
python manage.py loaddata database/fixtures/UV.json
python manage.py loaddata database/fixtures/CD.json
python manage.py loaddata database/fixtures/D.json