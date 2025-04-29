# backend/backend/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('apis.urls')),  # <--- Aquí conectamos tus rutas
]
