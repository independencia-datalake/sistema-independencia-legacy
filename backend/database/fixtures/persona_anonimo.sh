# ! /bin/sh
cd ../..
python manage.py loaddata database/fixtures/core/persona_anonimo.json
python manage.py loaddata database/fixtures/core/direccion_anonimo.json
python manage.py loaddata database/fixtures/core/correo_anonimo.json
python manage.py loaddata database/fixtures/core/telefono_anonimo.json
python manage.py loaddata database/fixtures/core/info_salud_anonimo.json