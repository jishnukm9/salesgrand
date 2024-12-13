#!/bin/bash

python manage.py migrate --no-input 
python manage.py collectstatic --no-input

if [[ -z ${SITE} ]]; then 
    echo "Environment variable SITE is missing!"
    exit 1 
else 
    echo "SITE: ${SITE}"
fi 

if [[ ${SITE} == "PROD" ]]; then 
    echo "Running Production"
    gunicorn --timeout 200 --workers 3 sensefrog.wsgi:application --bind 0.0.0.0:8000
else 
    echo "Running Development"
    python manage.py runserver 0.0.0.0:8000
fi 

