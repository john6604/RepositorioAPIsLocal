from rest_framework import serializers
from .models import API, Categoria, Subcategoria, Tematica

class APISerializer(serializers.ModelSerializer):
    class Meta:
        model = API
        fields = '__all__'


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre']

class SubcategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subcategoria
        fields = ['id', 'nombre']

class TematicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tematica
        fields = ['id', 'nombre']