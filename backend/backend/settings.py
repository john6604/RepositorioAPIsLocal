import os
from pathlib import Path
import dj_database_url
from corsheaders.defaults import default_headers


BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: mantener en secreto
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "admin")
DEBUG      = os.environ.get("DJANGO_DEBUG", "False") == "True"


ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
    "meticulous-perception-production.up.railway.app",
]

# Aplicaciones instaladas
INSTALLED_APPS = [
    # Django core
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',    


    # Terceros
    'corsheaders',
    'rest_framework',
    # Tu app
    'apis',
]

# Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',            # debe ir arriba de CommonMiddleware
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],            # si luego agregas plantillas personalizadas, apúntalas aquí
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# ------------------------------------------------------------------
# Base de datos
# ------------------------------------------------------------------
# Define tu URL en la variable de entorno DATABASE_URL.
# En Windows Powershell, antes de migrate:
#   $Env:DATABASE_URL = "postgres://admin:adminz%C3%B1a@localhost:5432/gestorapis_utf8"
#
# dj-database-url la parsea automáticamente:

#DATABASES = {
#    'default': {
#       'ENGINE':   'django.db.backends.postgresql',
 #       'NAME':     'gestorapis_utf8',
 #       'USER':     'postgres',
 #       'PASSWORD': 'admin',   
 #       'HOST':     'localhost',
 #       'PORT':     '5432',
 #   }
#}
import os, sys


DEBUG = os.environ.get("DJANGO_DEBUG", "False") == "True"
IS_PRODUCTION = os.environ.get("RAILWAY_ENVIRONMENT") == "production"

if IS_PRODUCTION:
    DATABASES = {
        'default': dj_database_url.config(
            default=os.environ.get('DATABASE_URL'),
            conn_max_age=600,
            ssl_require=True
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE':   'django.db.backends.postgresql',
            'NAME':     'railway_locl',     
            'USER':     'postgres',         
            'PASSWORD': 'admin',           
            'HOST':     'db',
            'PORT':     '5432',
        }
    }
#if os.environ.get("RAILWAY_ENVIRONMENT") == "production": //PARA MIGRAR 
#    DATABASES['default'] = {
#        'ENGINE':   'django.db.backends.postgresql',
#        'NAME':     os.environ['PGDATABASE'],               # ej. "railway"
#        'USER':     os.environ['PGUSER'],                   # ej. "postgres"
#        'PASSWORD': os.environ['PGPASSWORD'],               # contraseña larga
#        'HOST':     os.environ['RAILWAY_TCP_PROXY_DOMAIN'], # ej. "nozomi.proxy.rlwy.net"
#        'PORT':     os.environ['RAILWAY_TCP_PROXY_PORT'],   # ej. "10812"
#        'OPTIONS':  {'sslmode': 'require'},
#    }

# ------------------------------------------------------------------
# Validación de contraseñas
# ------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

# ------------------------------------------------------------------
# Internacionalización
# ------------------------------------------------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ------------------------------------------------------------------
# Archivos estáticos
# ------------------------------------------------------------------
STATIC_URL = 'static/'

# ------------------------------------------------------------------
# CORS
# ------------------------------------------------------------------
CORS_ALLOW_ALL_ORIGINS = True
# (si luego quieres restringirlo, puedes usar CORS_ALLOWED_ORIGINS)

# ------------------------------------------------------------------
# Auto-field por defecto
# ------------------------------------------------------------------
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
CORS_ALLOW_CREDENTIALS = True  

CORS_ALLOW_HEADERS = list(default_headers) + [
    "ngrok-skip-browser-warning",
]
