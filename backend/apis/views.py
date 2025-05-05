from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Api

@csrf_exempt
def lista_apis(request):
    """
    GET: devuelve todas las APIs en JSON
    """
    if request.method == 'GET':
        apis = Api.objects.all().values('id', 'nombre', 'descripcion', 'version', 'visibilidad')
        # convertimos el QuerySet a lista de dicts
        data = list(apis)
        return JsonResponse(data, safe=False)
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def crear_api(request):
    """
    POST: crea una nueva API a partir de un JSON
    """
    if request.method == 'POST':
        data = json.loads(request.body)
        nueva_api = Api.objects.create(
            nombre=data['nombre'],
            descripcion=data['descripcion'],
            version=data['version'],
            visibilidad=data['visibilidad']
        )
        return JsonResponse({'mensaje': 'API creada exitosamente', 'id': nueva_api.id})
    return JsonResponse({'error': 'Método no permitido'}, status=405)
