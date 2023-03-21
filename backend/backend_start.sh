# ! /bin/sh
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py loaddata database/fixtures/CI.json
python manage.py loaddata database/fixtures/UV.json
python manage.py loaddata database/fixtures/CD.json
python manage.py loaddata database/fixtures/D.json
python manage.py loaddata database/fixtures/persona_inicial.json
python manage.py loaddata database/fixtures/correo_inicial.json
python manage.py loaddata database/fixtures/telefono_inicial.json
python manage.py loaddata database/fixtures/direccion_inicial.json
python manage.py loaddata database/fixtures/info_salud_inicial.json