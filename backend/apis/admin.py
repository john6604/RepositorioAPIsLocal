from django.contrib import admin
from .models import API

@admin.register(API)
class ApiAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'version', 'visibilidad',)
    search_fields = ('nombre',)
    list_filter = ('visibilidad',)
