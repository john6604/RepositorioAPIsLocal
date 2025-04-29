# backend/apis/views.py

from django.http import JsonResponse

def lista_apis(request):
    return JsonResponse({"mensaje": "Lista de APIs disponible"})

def crear_api(request):
    return JsonResponse({"mensaje": "Formulario para crear una API"})
