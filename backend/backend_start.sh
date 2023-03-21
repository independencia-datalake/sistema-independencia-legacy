# ! /bin/sh
sudo python3 manage.py makemigrations
sudo python3 manage.py migrate
sudo python3 manage.py createsuperuser
sudo python3 manage.py loaddata database/fixtures/CI.json
sudo python3 manage.py loaddata database/fixtures/UV.json
sudo python3 manage.py loaddata database/fixtures/CD.json
sudo python3 manage.py loaddata database/fixtures/D.json
