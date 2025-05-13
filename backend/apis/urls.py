# backend/apis/urls.py

from django.urls import path
from . import views


urlpatterns = [
    path('crearapi/', views.crear_api, name='crear_api'),
    path("registraruser/", views.registrar_usuario, name='registrar_usuario'),
    path('login/', views.login_usuario, name='login_usuario'),
    path('logout/', views.logout_usuario, name='logout_usuario'),
    path('sesiones/', views.cerrar_todas_las_sesiones, name='cerrar_sesiones'),
    path('cerrarsesiones/', views.cerrar_todas_las_sesiones_usuario, name='cerrar_sesiones_usuario'),
    path('validar-sesion/', views.validar_sesion, name='validar_sesion'),
    path('listarapis/', views.apis_por_usuario, name='apis_usuario'),
    path('cuenta/eliminar/', views.EliminarCuentaView.as_view(), name='eliminar-cuenta'),
    path('cuenta/perfil/', views.PerfilUsuarioView.as_view() name='recoger-datos'),
]
