# backend/settings_local.py

from .settings import *   # importa todo lo demás de tu settings.py

# ⚠️ Sobrescribe solo la sección DATABASES para desarrollo local:
DATABASES = {
    'default': {
        'ENGINE':   'django.db.backends.sqlite3',
        'NAME':     BASE_DIR / 'db.local.sqlite3',
    }
}

# (Opcional) desactiva CORS, DEBUG a True, etc. para local:
DEBUG = True
CORS_ALLOW_ALL_ORIGINS = True
