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
    if request.method == 'POST':
        # Decodifica y registra el BODY tal cual viene
        raw = request.body.decode('utf-8')
        print("🔍 RAW REQUEST.BODY:", repr(raw))

        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            return JsonResponse({
                "error": "JSON inválido o vacío",
                "received_body": raw
            }, status=400)

        # Ahora puedes confiar en data['nombre'], etc.
        nueva_api = Api.objects.create(
            nombre=data['nombre'],
            descripcion=data['descripcion'],
            version=data['version'],
            visibilidad=data['visibilidad']
        )
        return JsonResponse({'mensaje': 'API creada exitosamente', 'id': nueva_api.id})
    return JsonResponse({'error': 'Método no permitido'}, status=405)