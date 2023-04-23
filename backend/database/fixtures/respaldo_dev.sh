# ! /bin/sh
python manage.py makemigrations
python manage.py migrate
python manage.py loaddata database/fixtures/respaldo/carga_1.json
python manage.py loaddata database/fixtures/respaldo/carga_2.json
python manage.py loaddata database/fixtures/respaldo/carga_3.json
python manage.py loaddata database/fixtures/respaldo/carga_4.json
python manage.py loaddata database/fixtures/respaldo/carga_5.json
python manage.py loaddata database/fixtures/respaldo/carga_6.json
python manage.py loaddata database/fixtures/respaldo/carga_7.json
python manage.py loaddata database/fixtures/respaldo/carga_8.json
python manage.py loaddata database/fixtures/respaldo/carga_9.json
python manage.py loaddata database/fixtures/respaldo/carga_10.json