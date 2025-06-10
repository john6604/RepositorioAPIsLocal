from django.contrib import admin
from .models import (
    Rol,
    Usuario,
    API,
    VersionApi,
    PermisoApi,
    Sesion,
    Auditoria,
    Categoria,
    Subcategoria,
    Tematica,
    MetodoApi,
)

@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre")

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ("id", "correo", "rol", "estado")

@admin.register(API)
class ApiAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "nombre",
        "creado_por",
        "permiso",
        "estado",
        "id_categoria",
        "id_subcategoria",
        "id_tematica",
    )
    list_filter = ("permiso", "estado", "id_categoria", "id_subcategoria", "id_tematica")
    search_fields = ("nombre",)

@admin.register(VersionApi)
class VersionApiAdmin(admin.ModelAdmin):
    list_display = ("id", "api", "numero_version", "creado_en")
    list_filter = ("api",)

@admin.register(PermisoApi)
class PermisoApiAdmin(admin.ModelAdmin):
    list_display = ("id", "api", "colaborador", "creado_en")
    list_filter  = ("api", "colaborador")

@admin.register(Sesion)
class SesionAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "token_sesion", "activa")
    list_filter = ("activa",)
    search_fields = ("token_sesion",)

@admin.register(Auditoria)
class AuditoriaAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "accion", "tabla_afectada", "timestamp")
    list_filter = ("accion",)

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre")
    search_fields = ("nombre",)

@admin.register(Subcategoria)
class SubcategoriaAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre")
    search_fields = ("nombre",)

@admin.register(Tematica)
class TematicaAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre")
    search_fields = ("nombre",)

@admin.register(MetodoApi)
class MetodoApiAdmin(admin.ModelAdmin):
    list_display = ("id", "api", "metodo", "endpoint")
    list_filter = ("metodo",)
    search_fields = ("endpoint",)
