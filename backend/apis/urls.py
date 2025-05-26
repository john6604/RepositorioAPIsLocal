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
    path('cuenta/perfil/', views.PerfilUsuarioView.as_view(), name='recoger-datos'),
    path('cuenta/actualizar/', views.ActualizarUsuarioView.as_view(), name='actualizar_usuario'),
    path('listarapis/<int:api_id>/', views.DetalleAPIView.as_view(), name='detalle_api'),
    path("eliminarapi/<int:api_id>/", views.EliminarAPIView.as_view(), name='eliminar_api'),
    path('buscar-apis-publicas', views.buscar_apis_publicas, name='buscar_apis_publicas'),
    path('usuario_actual/', views.obtener_usuario_actual, name='usuario_actual'),
    path('listarmodelos/<int:api_id>/', views.DetalleModeloView.as_view(), name='modelo_actual'),
    path('crearapimetodos/', views.crear_api_y_metodos, name='crear_api_metodos'),
    path('ejecutar/', views.ejecutar_codigo, name='ejecutar_codigo'),
    path('categorias/crear/', views.crear_categoria, name='crear_categoria'),
    path('subcategorias/crear/', views.crear_subcategoria, name='crear_subcategoria'),
    path('tematica/crear/', views.crear_tematica, name='crear_tematica'),
    path('categorias/', views.CategoriaListView.as_view(), name='categorias-list'),
    path('subcategorias/', views.SubcategoriaListView.as_view(), name='subcategorias-list'),
    path('tematicas/', views.TematicaListView.as_view(), name='tematicas-list'),
]
