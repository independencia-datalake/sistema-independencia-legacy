# ! /bin/sh
cd ../..
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser
python3 manage.py loaddata database/fixtures/core/CI.json
python3 manage.py loaddata database/fixtures/core/UV.json