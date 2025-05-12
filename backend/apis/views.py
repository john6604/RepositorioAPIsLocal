from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import API
from rest_framework import viewsets
from .models import API
from .serializers import APISerializer
from django.utils import timezone
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from .models import Usuario, Rol, Sesion
import secrets

# Create your views here.

# Registro de los Usuarios, Vistas
@csrf_exempt
def registrar_usuario(request):
    if request.method == "POST":
        try:
            # Leer datos del request
            data = json.loads(request.body)
            correo = data.get("correo")
            clave = data.get("contrasena")

            if not correo or not clave:
                return JsonResponse({"error": "Datos incompletos."}, status=400)

            # Verificar si el correo ya está registrado
            if Usuario.objects.filter(correo=correo).exists():
                return JsonResponse({"error": "El correo ya está registrado."}, status=409)

            # Crear el usuario
            usuario = Usuario.objects.create(
                correo=correo,
                contrasena_hash=make_password(clave),
                nombres=correo.split("@")[0],
                apellidos=None,
                estado="activo",
                rol_id=2,
                creado_en=timezone.now(),
                actualizado_en=timezone.now()
            )

            # Generar un token de sesión para el usuario
            token_sesion = secrets.token_hex(16)  # Token aleatorio de 32 caracteres hexadecimales

            # Guardar el token en la base de datos en la tabla Sesion
            Sesion.objects.create(
                usuario_id=usuario.id,
                token_sesion=token_sesion,
                expira_en=timezone.now() + timezone.timedelta(days=1),  # Expira en 1 día
                activa=True
            )

            # Responder con el mensaje de éxito y el token
            return JsonResponse({
                "mensaje": "Usuario registrado con éxito.",
                "token_sesion": token_sesion  # Incluir el token en la respuesta
            }, status=201)

        except Exception as e:
            # Manejo de errores
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Método no permitido."}, status=405)

# Login de usuarios, vista

@csrf_exempt
def login_usuario(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            correo = data.get("correo")
            clave = data.get("contrasena")

            if not correo or not clave:
                return JsonResponse({"error": "Datos incompletos."}, status=400)

            try:
                usuario = Usuario.objects.get(correo=correo)
            except Usuario.DoesNotExist:
                return JsonResponse({"error": "Usuario no encontrado."}, status=404)

            if not check_password(clave, usuario.contrasena_hash):
                return JsonResponse({"error": "Contraseña incorrecta."}, status=401)

            # Generar token de sesión
            token = secrets.token_hex(32)

            Sesion.objects.create(
                usuario=usuario,
                token_sesion=token,
                creado_en=timezone.now(),
                expira_en=timezone.now() + timezone.timedelta(days=1),
                activa=True
            )

            return JsonResponse({
                "mensaje": "Inicio de sesión exitoso",
                "token": token,
                "usuario_id": usuario.id,
                "rol_id": usuario.rol_id,
                "nombres": usuario.nombres,
                "apellidos": usuario.apellidos
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Método no permitido."}, status=405)

@csrf_exempt
def lista_apis(request):
    """
    GET: devuelve todas las APIs en JSON
    """
    if request.method == 'GET':
        apis = API.objects.all().values('id', 'nombre', 'descripcion', 'version', 'visibilidad')
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

class APIViewSet(viewsets.ModelViewSet):
    queryset = API.objects.all()
    serializer_class = APISerializer