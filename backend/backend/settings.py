import os
from pathlib import Path
import dj_database_url

# Construye rutas dentro del proyecto
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: mantener en secreto
SECRET_KEY = 'django-insecure-m#73dlwv)ks+)sd)m&6i3ko0k0lpz112v9=+z-kfhr0@679x#8'
DEBUG = True

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

BASE_DIR = Path(__file__).resolve().parent.parent

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600,
        ssl_require=True,    # en prod con Railway suele ser required
    )
}

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