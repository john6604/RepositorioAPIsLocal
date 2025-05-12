# backend/apis/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('apis/', views.lista_apis, name='lista_apis'),
    path('crear/', views.crear_api, name='crear_api'),
    path("registraruser/", views.registrar_usuario, name='registrar_usuario'),
    path('login/', views.login_usuario, name='login_usuario'),
    path('logout/', views.logout_usuario, name='logout_usuario'),
    path('sesiones/', views.cerrar_todas_las_sesiones, name='cerrar_sesiones'),
    path('cerrarsesiones/', views.cerrar_todas_las_sesiones_usuario, name='cerrar_sesiones_usuario'),
]
