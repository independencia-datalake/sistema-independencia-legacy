# ! /bin/sh
cd ../..

python manage.py makemigrations
python manage.py migrate
python manage.py create_groups
python manage.py loaddata database/fixtures/core/CI.json
python manage.py loaddata database/fixtures/core/UV.json

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

python manage.py loaddata database/fixtures/core/persona_anonimo.json
python manage.py loaddata database/fixtures/core/direccion_anonimo.json
python manage.py loaddata database/fixtures/core/correo_anonimo.json
python manage.py loaddata database/fixtures/core/telefono_anonimo.json
python manage.py loaddata database/fixtures/core/info_salud_anonimo.json

python manage.py loaddata database/fixtures/GSL/categorias.json
python manage.py loaddata database/fixtures/GSL/subcategorias.json

python manage.py loaddata database/fixtures/data_init/CD.json
python manage.py loaddata database/fixtures/data_init/D.json

python manage.py loaddata database/fixtures/data_init/init_data.json