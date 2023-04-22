# ! /bin/sh
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser
python3 manage.py loaddata database/fixtures/CI.json
python3 manage.py loaddata database/fixtures/UV.json
python3 manage.py loaddata database/fixtures/CD.json
python3 manage.py loaddata database/fixtures/D.json
