#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

cd portfolio
python manage.py collectstatic --no-input
python manage.py migrate