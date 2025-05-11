# backend/apis/admin.py
from django.contrib import admin
from .models import Rol, Usuario, API, VersionApi, PermisoApi, Sesion, Auditoria

@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre")

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ("id", "correo", "rol", "estado")

@admin.register(API)
class ApiAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "creado_por", "permiso", "estado")

@admin.register(VersionApi)
class VersionApiAdmin(admin.ModelAdmin):
    list_display = ("id", "api", "numero_version", "creado_en")

@admin.register(PermisoApi)
class PermisoApiAdmin(admin.ModelAdmin):
    list_display = ("id", "api", "usuario", "creado_en")

@admin.register(Sesion)
class SesionAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "token_sesion", "activa")

@admin.register(Auditoria)
class AuditoriaAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "accion", "tabla_afectada", "timestamp")
