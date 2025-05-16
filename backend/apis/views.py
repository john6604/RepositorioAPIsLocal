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
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from django.views import View
from django.db.models import Q

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

            # Crear siempre una nueva sesión
            token = secrets.token_hex(32)
            Sesion.objects.create(
                usuario=usuario,
                token_sesion=token,
                creado_en=timezone.now(),
                expira_en=timezone.now() + timezone.timedelta(days=30),
                activa=True
            )

            request.session['usuario_id'] = usuario.id

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

# Cerrar sesiones, vistas
@csrf_exempt
def logout_usuario(request):
    if request.method == "POST":
        try:
            # Obtener el token de sesión enviado en la solicitud
            data = json.loads(request.body)
            token = data.get("token_sesion")

            if not token:
                return JsonResponse({"error": "Token de sesión no proporcionado."}, status=400)

            # Buscar la sesión en la base de datos
            sesion = Sesion.objects.filter(token_sesion=token, activa=True).first()

            if not sesion:
                return JsonResponse({"error": "Sesión no encontrada o ya está inactiva."}, status=404)

            # Marcar la sesión como inactiva
            sesion.activa = False
            sesion.save()

            return JsonResponse({"mensaje": "Sesión cerrada correctamente."})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Método no permitido."}, status=405)

# Cerrar todas las sesiones, vista
@csrf_exempt
def cerrar_todas_las_sesiones(request):
    if request.method == "POST":
        try:
            # Cerrar todas las sesiones activas
            Sesion.objects.filter(activa=True).update(activa=False)
            return JsonResponse({"mensaje": "Todas las sesiones han sido cerradas."})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Método no permitido."}, status=405)
        
# Cerrar todas las sesiones de un usuario, vista
@csrf_exempt
def cerrar_todas_las_sesiones_usuario(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            token = data.get("token_sesion")

            if not token:
                return JsonResponse({"error": "Token de sesión no proporcionado."}, status=400)

            # Verificar la sesión actual
            sesion_actual = Sesion.objects.filter(token_sesion=token, activa=True).first()

            if not sesion_actual:
                return JsonResponse({"error": "Sesión no válida o expirada."}, status=401)

            # Cerrar todas las sesiones activas del mismo usuario
            Sesion.objects.filter(usuario=sesion_actual.usuario, activa=True).update(activa=False)

            return JsonResponse({"mensaje": "Todas las sesiones han sido cerradas correctamente."})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Método no permitido."}, status=405)

# Sesiones activas en un dispoditivo, vista
@csrf_exempt
def validar_sesion(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            token = data.get("token_sesion")

            if not token:
                return JsonResponse({"error": "Token de sesión no proporcionado."}, status=400)

            sesion = Sesion.objects.filter(token_sesion=token, activa=True, expira_en__gt=timezone.now()).first()

            if not sesion:
                return JsonResponse({"valida": False})

            return JsonResponse({
                "valida": True,
                "usuario_id": sesion.usuario.id,
                "rol_id": sesion.usuario.rol_id,
                "nombres": sesion.usuario.nombres,
                "apellidos": sesion.usuario.apellidos
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Método no permitido."}, status=405)
        
# Filtrar APIs por usuario, vista
@api_view(['POST'])
@csrf_exempt
def apis_por_usuario(request):
    
    try:
        data = request.data 
        token = data.get("token_sesion")

        if not token:
            return Response({'error': 'Token de sesión no proporcionado'}, status=400)


        sesion = Sesion.objects.filter(token_sesion=token, activa=True, expira_en__gt=timezone.now()).first()
        if not sesion:
            return Response({'error': 'Sesión no válida o expirada'}, status=401)

        usuario_id = sesion.usuario.id

        apis = API.objects.filter(creado_por_id=usuario_id)
        data = [
            {
                'id': api.id,
                'nombre': api.nombre,
                'permiso': api.permiso,
                'estado': api.estado,
                'descripcion': api.descripcion,
                "autor": f"{api.creado_por.nombres} {api.creado_por.apellidos}" if api.creado_por else "Sin autor",
            }
            for api in apis
        ]

        return Response(data)

    except Exception as e:
        print("Error:", str(e))
        return Response({'error': str(e)}, status=500)

# Vista para crear APIs
@api_view(['POST'])
def crear_api(request):
    try:
        data = request.data
        token = data.get("token_sesion")

        if not token:
            return Response({"error": "Token de sesión no proporcionado"}, status=400)

        sesion = Sesion.objects.filter(token_sesion=token, activa=True, expira_en__gt=timezone.now()).first()
        if not sesion:
            return Response({"error": "Sesión no válida o expirada"}, status=401)

        usuario = sesion.usuario
        nombre_api = data.get("nombre")

        if not nombre_api:
            return Response({"error": "El nombre de la API es obligatorio"}, status=400)

        # Verificar que el nombre de la API no exista para este usuario
        if API.objects.filter(nombre=nombre_api, creado_por=usuario).exists():
            return Response({"error": "Ya tienes una API con ese nombre"}, status=409)

        nueva_api = API.objects.create(
            nombre=nombre_api,
            descripcion=data.get("descripcion"),
            detalles_tecnicos=data.get("ejemploUso"),  # asegúrate que estas claves vengan bien desde el frontend
            documentacion=data.get("version"),
            creado_por=usuario,
            permiso="privado",
        )

        return Response({
            "mensaje": "API creada exitosamente",
            "id_api": nueva_api.id
        }, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

# Obtener una API especifica
@method_decorator(csrf_exempt, name='dispatch')
class DetalleAPIView(APIView):
    def get(self, request, api_id):
        try:
            api = API.objects.get(id=api_id)
        except API.DoesNotExist:
            return JsonResponse({"detail": "API no encontrada."}, status=404)

        data = {
            "id": api.id,
            "nombre": api.nombre,
            "descripcion": api.descripcion,
            "detalles_tecnicos": api.detalles_tecnicos,
            "documentacion": api.documentacion,
            "creado_por": api.creado_por.id if api.creado_por else None,
            "permiso": api.permiso,
            "estado": api.estado,
            "creado_en": api.creado_en,
            "actualizado_en": api.actualizado_en,
        }
        return JsonResponse(data, status=200)

    def put(self, request, api_id):
        try:
            api = API.objects.get(id=api_id)
        except API.DoesNotExist:
            return JsonResponse({"detail": "API no encontrada."}, status=404)

        data = json.loads(request.body)

        # Solo actualizamos los campos relevantes
        api.nombre = data.get("nombre", api.nombre)
        api.descripcion = data.get("descripcion", api.descripcion)
        api.documentacion = data.get("documentacion", api.documentacion)

        api.save()

        return JsonResponse({"detail": "API actualizada correctamente."}, status=200)
    
# Eliminación de una API, vista
class EliminarAPIView(APIView):
    def delete(self, request, api_id):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return JsonResponse({"detail": "Token no proporcionado"}, status=400)

        token_sesion = auth_header.split(" ")[1]

        try:
            sesion = Sesion.objects.get(token_sesion=token_sesion)
            usuario = sesion.usuario
        except Sesion.DoesNotExist:
            return JsonResponse({"detail": "Sesión inválida"}, status=401)

        try:
            api = API.objects.get(id=api_id)
        except API.DoesNotExist:
            return JsonResponse({"detail": "API no encontrada"}, status=404)

        if api.creado_por != usuario:
            return JsonResponse({"detail": "No tienes permiso para eliminar esta API"}, status=403)

        api.delete()
        return JsonResponse({"detail": "API eliminada"}, status=204)

# Eliminación de una cuenta, vista
class EliminarCuentaView(APIView):
    def delete(self, request):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return JsonResponse({"detail": "Token no proporcionado."}, status=401)


        token_sesion = auth_header.split(" ")[1]

        try:
            sesion = Sesion.objects.get(token_sesion=token_sesion)
            usuario = sesion.usuario
        except Sesion.DoesNotExist:
            return JsonResponse({"detail": "Sesión inválida."}, status=401)

        usuario.delete()
        sesion.delete()  # opcional, porque el usuario se elimina en cascada si está relacionado

        print("Eliminado")
        return Response(status=status.HTTP_204_NO_CONTENT)

# Getter de informacion del usuario, vista
class PerfilUsuarioView(APIView):
    def get(self, request):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return JsonResponse({"detail": "Token no proporcionado."}, status=401)

        token_sesion = auth_header.split(" ")[1]

        try:
            sesion = Sesion.objects.get(token_sesion=token_sesion)
            usuario = sesion.usuario
        except Sesion.DoesNotExist:
            return JsonResponse({"detail": "Sesión inválida."}, status=401)

        datos = {
            "correo": usuario.correo,
            "nombres": usuario.nombres,
            "apellidos": usuario.apellidos,
            "rol": usuario.rol.id if usuario.rol else None,
            "estado": usuario.estado,
            "creado_en": usuario.creado_en,
            "actualizado_en": usuario.actualizado_en,
        }

        return Response(datos, status=status.HTTP_200_OK)

# Actualización de Datos del Usuario, vista
class ActualizarUsuarioView(APIView):
    def put(self, request):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return JsonResponse({"detail": "Token no proporcionado."}, status=401)

        token_sesion = auth_header.split(" ")[1]

        try:
            sesion = Sesion.objects.get(token_sesion=token_sesion)
            usuario = sesion.usuario
        except Sesion.DoesNotExist:
            return JsonResponse({"detail": "Sesión inválida."}, status=401)

        data = request.data
        try:
            # Actualizar los campos de usuario si están presentes en los datos
            if "nombres" in data:
                usuario.nombres = data["nombres"]
            if "apellidos" in data:
                usuario.apellidos = data["apellidos"]
            if "correo" in data:
                usuario.correo = data["correo"]
            if "estado" in data:
                usuario.estado = data["estado"]

            usuario.save()

            return JsonResponse({"detail": "Datos actualizados correctamente."}, status=200)

        except Exception as e:
            return JsonResponse({"detail": f"Error al actualizar los datos: {str(e)}"}, status=400)

# Vista para buscar APIs globalmente
@api_view(['GET'])
def buscar_apis_publicas(request):
    query = request.GET.get('q', '').strip().lower()

    if not query:
        return Response({"resultados": []})

    # Filtra solo APIs públicas que coincidan por nombre, descripción, documentación o autor
    apis = API.objects.filter(
        permiso='publico'
    ).filter(
        Q(nombre__icontains=query) |
        Q(descripcion__icontains=query) |
        Q(documentacion__icontains=query) |
        Q(creado_por__nombres__icontains=query)
    ).select_related('creado_por')  # optimización para acceder al autor

    resultados = [
        {
            "id": api.id,
            "nombre": api.nombre,
            "descripcion": api.descripcion,
            "documentacion": api.documentacion,
            "permiso": api.permiso, 
            "autor": f"{api.creado_por.nombres} {api.creado_por.apellidos}" if api.creado_por else "Sin autor",
        }
        for api in apis
    ]

    return Response({"resultados": resultados})

class APIViewSet(viewsets.ModelViewSet):
    queryset = API.objects.all()