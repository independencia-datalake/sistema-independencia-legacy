# ! /bin/sh
cd ../..
python manage.py makemigrations
python manage.py migrate
python manage.py loaddata database/fixtures/GSL/categorias.json
python manage.py loaddata database/fixtures/GSL/subcategorias.json