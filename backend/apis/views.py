from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import API
from rest_framework import viewsets
from .models import API, MetodoApi, PermisoApi
from .serializers import APISerializer, CategoriaSerializer, SubcategoriaSerializer, TematicaSerializer
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
from rest_framework import generics
from django.utils.decorators import method_decorator
from django.views import View
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseBadRequest
from .models import Categoria, Subcategoria, Tematica
from django.shortcuts import get_object_or_404
import requests

import numpy as np
from sklearn.linear_model import LinearRegression

# Create your views here.

# Registro de los Usuarios, Vistas
@csrf_exempt
def registrar_usuario(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            correo     = data.get("correo")
            clave      = data.get("contrasena")  
            username   = data.get("username") or correo.split('@')[0]
            nombres    = data.get("nombres") or username
            origen     = data.get("origen", "local") 

            if not correo or not clave:
                return JsonResponse({"error": "Datos incompletos."}, status=400)

            # Si el usuario ya existe
            usuario_existente = Usuario.objects.filter(correo=correo).first()

            if usuario_existente:
                if origen == "google":
                    # Permitir continuar y crear sesión
                    pass
                else:
                    return JsonResponse({"error": "El correo ya está registrado."}, status=409)
            else:
                usuario = Usuario.objects.create(
                    correo          = correo,
                    username        = username,
                    contrasena_hash = make_password(clave),
                    nombres         = nombres,
                    apellidos       = None,
                    estado          = "activo",
                    rol_id          = 2,
                    creado_en       = timezone.now(),
                    actualizado_en  = timezone.now(),
                    origen          = origen
                )
            # Buscar de nuevo (por si lo creamos recién ahora)
            usuario = Usuario.objects.get(correo=correo)

            token_sesion = secrets.token_hex(16)
            Sesion.objects.create(
                usuario_id   = usuario.id,
                token_sesion = token_sesion,
                expira_en    = timezone.now() + timezone.timedelta(days=1),
                activa       = True
            )

            return JsonResponse({
                "mensaje": "Usuario registrado con éxito.",
                "token_sesion": token_sesion
            }, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Método no permitido."}, status=405)

# Login de usuarios, vista
@csrf_exempt
def login_usuario(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            correo = data.get("correo")
            clave = data.get("contrasena")
            origen = data.get("origen", "local")

            if not correo or not clave:
                return JsonResponse({"error": "Datos incompletos."}, status=400)

            try:
                usuario = Usuario.objects.get(correo=correo)
            except Usuario.DoesNotExist:
                if origen == "google":
                    # Crear automáticamente el usuario con datos básicos
                    nombres = data.get("nombres", "")
                    apellidos = data.get("apellidos", "")
                    username = correo.split("@")[0]

                    # Asegurar username único
                    original_username = username
                    contador = 1
                    while Usuario.objects.filter(username=username).exists():
                        username = f"{original_username}{contador}"
                        contador += 1

                    usuario = Usuario.objects.create(
                        correo=correo,
                        username=username,
                        contrasena_hash=make_password(clave),  
                        nombres=nombres,
                        apellidos=apellidos,
                        origen="google"
                    )
                else:
                    return JsonResponse({"error": "Usuario no encontrado."}, status=404)

            if origen == "google":
                # No verificamos la clave para usuarios de Google
                pass
            else:
                if not check_password(clave, usuario.contrasena_hash):
                    return JsonResponse({"error": "Contraseña incorrecta."}, status=401)

            # Crear sesión
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
                "username": f"{api.creado_por.username}" if api.creado_por else "Sin autor",
                "rol": f"{api.creado_por.rol}" if api.creado_por and api.creado_por.rol else "Sin rol",
            }
            for api in apis
        ]

        return Response(data)

    except Exception as e:
        print("Error:", str(e))
        return Response({'error': str(e)}, status=500)

# Obtener el Usuario id de la sesion actual, vista
@api_view(['POST'])
@csrf_exempt
def obtener_usuario_actual(request):
    try:
        data = request.data 
        token = data.get("token_sesion")

        if not token:
            return Response({'error': 'Token no proporcionado'}, status=400)

        sesion = Sesion.objects.filter(token_sesion=token, activa=True, expira_en__gt=timezone.now()).first()
        if not sesion:
            return Response({'error': 'Sesión inválida o expirada'}, status=401)

        usuario = sesion.usuario

        return Response({'usuario_id': usuario.id})
    
    except Exception as e:
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
            detalles_tecnicos=data.get("ejemploUso"), 
            documentacion=data.get("version"),
            creado_por=usuario,
            permiso="privado",
        )

        parametros = data.get("parametros")
        respuesta = data.get("respuesta")
        cuerpo = data.get("requestBody")


        if isinstance(parametros, str):
            parametros = json.loads(parametros)
        if isinstance(respuesta, str):
            respuesta = json.loads(respuesta)
        if isinstance(cuerpo, str):
             cuerpo = json.loads(cuerpo)

    
    
        nuevo_metodo = MetodoApi.objects.create(
            api=nueva_api,
            metodo=data.get("metodo"),
            endpoint=data.get("endpoint"),
            descripcion=data.get("descripcion"),
            lenguaje_codigo="Python",
            codigo=data.get("codigo"),
            parametros=parametros,
            retorno=respuesta,
            cuerpo=cuerpo,  # solo si lo tienes definido en el modelo
        )
        print("✔ Parámetros guardados:", nuevo_metodo.parametros)
        print("✔ Respuesta guardada:", nuevo_metodo.retorno)


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

        metodos = MetodoApi.objects.filter(api=api)
        metodos_data = [
            {
                "id": metodo.id,
                "metodo": metodo.metodo,
                "endpoint": metodo.endpoint,
                "descripcion": metodo.descripcion,
                "lenguaje_codigo": metodo.lenguaje_codigo,
                "codigo": metodo.codigo,
                "parametros": metodo.parametros,
                "retorno": metodo.retorno
            }
            for metodo in metodos
        ]

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
            "metodos": metodos_data
        }
        return JsonResponse(data, status=200)

    def put(self, request, api_id):
        try:
            api = API.objects.get(id=api_id)
        except API.DoesNotExist:
            return JsonResponse({"detail": "API no encontrada."}, status=404)

        data = json.loads(request.body)

        # Actualizar datos generales del API
        api.nombre = data.get("nombre", api.nombre)
        api.descripcion = data.get("descripcion", api.descripcion)
        api.documentacion = data.get("documentacion", api.documentacion)
        api.permiso = data.get("permiso", api.permiso)
        api.actualizado_en = timezone.now()
        api.save()

        # Actualizar métodos HTTP asociados
        metodos_data = data.get("metodos", {})

        for metodo_http, datos_metodo in metodos_data.items():
            try:
                metodo_obj = MetodoApi.objects.get(api=api, metodo=metodo_http)
                metodo_obj.endpoint = datos_metodo.get("endpoint", metodo_obj.endpoint)
                metodo_obj.parametros = datos_metodo.get("parametros", metodo_obj.parametros)
                metodo_obj.codigo = datos_metodo.get("requestBody", metodo_obj.codigo)
                metodo_obj.retorno = datos_metodo.get("respuesta", metodo_obj.retorno)
                metodo_obj.save()
            except MetodoApi.DoesNotExist:
               
                continue

        return JsonResponse({"detail": "API y métodos actualizados correctamente."}, status=200)
    


@method_decorator(csrf_exempt, name='dispatch')
class DetalleModeloView(APIView):

    def get(self, request, api_id):
        try:
            modelo_api = MetodoApi.objects.get(id=api_id)
        except MetodoApi.DoesNotExist:
            return JsonResponse({"detail": "API no encontradaaa."}, status=404)

        data = {
            "metodo": modelo_api.metodo,
            "endpoint": modelo_api.endpoint,
            "parametros": modelo_api.parametros,
            "codigo": modelo_api.codigo,
            "retorno": modelo_api.retorno,
        }
        return JsonResponse(data, status=200)

    def put(self, request, api_id):
        try:
            modelo_api = MetodoApi.objects.get(id=api_id)
        except MetodoApi.DoesNotExist:
            return JsonResponse({"detail": "API no encontradas."}, status=404)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "JSON inválido."}, status=400)

        token = data.get("token_sesion")
        if not token:
            return JsonResponse({"error": "Token de sesión requerido."}, status=400)

        # Validar sesión y usuario
        try:
            sesion = Sesion.objects.get(token=token)
            usuario = sesion.usuario
        except Sesion.DoesNotExist:
            return JsonResponse({"error": "Token inválido o expirado."}, status=401)

        # Verificar que el usuario sea el creador
        if modelo_api.creado_por != usuario:
            return JsonResponse({"error": "No tienes permiso para modificar esta API."}, status=403)

        # Actualizar campos (solo los que se envían)
        modelo_api.nombre = data.get("nombre", modelo_api.nombre)
        modelo_api.descripcion = data.get("descripcion", modelo_api.descripcion)
        modelo_api.version = data.get("version", modelo_api.version)
        modelo_api.metodo = data.get("metodo", modelo_api.metodo)
        modelo_api.endpoint = data.get("endpoint", modelo_api.endpoint)
        modelo_api.parametros = data.get("parametros", modelo_api.parametros)
        modelo_api.codigo = data.get("codigo", modelo_api.codigo)
        modelo_api.requestBody = data.get("requestBody", modelo_api.requestBody)
        modelo_api.respuesta = data.get("respuesta", modelo_api.respuesta)
        modelo_api.estado = data.get("estado", modelo_api.estado)
        modelo_api.actualizado_en = timezone.now()

        modelo_api.save()

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
            "username": usuario.username,
            "nombres": usuario.nombres,
            "apellidos": usuario.apellidos,
            "rol": usuario.rol.id if usuario.rol else None,
            "estado": usuario.estado,
            "creado_en": usuario.creado_en,
            "actualizado_en": usuario.actualizado_en,
            "biografia": usuario.biografia,
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
            if "biografia" in data:
                usuario.biografia = data["biografia"]

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

    apis = API.objects.filter(
        permiso='publico'
    ).filter(
        Q(nombre__icontains=query) |
        Q(descripcion__icontains=query) |
        Q(documentacion__icontains=query) |
        Q(creado_por__nombres__icontains=query) |
        Q(creado_por__username__icontains=query) |
        Q(id_categoria__nombre__icontains=query) |
        Q(id_subcategoria__nombre__icontains=query) |
        Q(id_tematica__nombre__icontains=query)
    ).select_related(
        'creado_por',
        'id_categoria',
        'id_subcategoria',
        'id_tematica'
    )

    resultados = [
        {
            "id": api.id,
            "nombre": api.nombre,
            "descripcion": api.descripcion,
            "documentacion": api.documentacion,
            "permiso": api.permiso, 
            "autor": f"{api.creado_por.nombres} {api.creado_por.apellidos}" if api.creado_por else "Sin autor",
            "username": api.creado_por.username if api.creado_por else "Sin autor",
            "categoria": api.id_categoria.nombre if api.id_categoria else None,
            "subcategoria": api.id_subcategoria.nombre if api.id_subcategoria else None,
            "tematica": api.id_tematica.nombre if api.id_tematica else None,
        }
        for api in apis
    ]

    return Response({"resultados": resultados})

class APIViewSet(viewsets.ModelViewSet):
    queryset = API.objects.all()

# Crear APIs y sus metodos, vista
@csrf_exempt
def crear_api_y_metodos(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        data = json.loads(request.body)

        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return JsonResponse({"detail": "Token no proporcionado"}, status=400)

        token_sesion = auth_header.split(" ")[1]
        sesion = Sesion.objects.filter(token_sesion=token_sesion, activa=True, expira_en__gt=timezone.now()).first()
        if not sesion:
            return Response({"error": "Sesión no válida o expirada"}, status=401)

        usuario = sesion.usuario

        id_categoria = data.get("id_categoria")
        id_subcategoria = data.get("id_subcategoria")
        id_tematica = data.get("id_tematica")

        nueva_api = API.objects.create(
            nombre=data.get("nombre"),
            descripcion=data.get("descripcion"),
            detalles_tecnicos=data.get("detalles_tecnicos"),
            documentacion=data.get("version"),
            creado_por=usuario,
            permiso="privado",
            estado="activo",
            id_categoria_id=id_categoria,
            id_subcategoria_id=id_subcategoria,
            id_tematica_id=id_tematica,
            creado_en=timezone.now(),
            actualizado_en=timezone.now()
        )

        metodos = data.get("metodos", {})

        for metodo, info in metodos.items():
            MetodoApi.objects.create(
                api=nueva_api,
                metodo=metodo,
                endpoint=info.get("endpoint"),
                descripcion=info.get("requestBody"),
                lenguaje_codigo="python",
                codigo=info.get("codigo"),
                parametros=info.get("parametros"),
                retorno=info.get("respuesta"),
            )

        return JsonResponse({"mensaje": "API y métodos creados correctamente"}, status=201)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

import subprocess
import sys

@csrf_exempt
def ejecutar_codigo(request):
    if request.method not in ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']:
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        if request.method == 'GET':
            codigo = request.GET.get('codigo')
            parametros = request.GET.get('parametros')
            detalles_tecnicos = request.GET.get('detalles_tecnicos', '')
            if parametros:
                parametros = json.loads(parametros)
        else:
            data = json.loads(request.body)
            codigo = data.get('codigo')
            parametros = data.get('parametros')
            detalles_tecnicos = data.get('detalles_tecnicos', '')

        if not codigo or parametros is None:
            return JsonResponse({"error": "Faltan 'codigo' o 'parametros'"}, status=400)

        # Payload que enviamos al microservicio
        payload = {
            "codigo": codigo,
            "parametros": parametros,
            "detalles_tecnicos": detalles_tecnicos
        }

        # Enviar al microservicio FastAPI
        url = "https://fastapiservice-7z74.onrender.com/run"
        response = requests.post(url, json=payload, timeout=60)

        if response.status_code == 200:
            return JsonResponse(response.json())
        else:
            return JsonResponse({
                "error": "Error en el microservicio",
                "status_code": response.status_code,
                "detalles": response.text
            }, status=response.status_code)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# Crear vistas para clasificación, vista
@api_view(['POST'])
def crear_categoria(request):
    nombre = request.data.get("nombre")
    descripcion = request.data.get("descripcion")

    if not nombre:
        return Response({"error": "El campo 'nombre' es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

    categoria = Categoria.objects.create(nombre=nombre, descripcion=descripcion)
    return Response({
        "mensaje": "Categoría creada correctamente.",
        "id": categoria.id,
        "nombre": categoria.nombre,
        "descripcion": categoria.descripcion
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def crear_subcategoria(request):
    nombre = request.data.get("nombre")
    descripcion = request.data.get("descripcion")

    if not nombre:
        return Response({"error": "El campo 'nombre' es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

    subcategoria = Subcategoria.objects.create(nombre=nombre, descripcion=descripcion)
    return Response({
        "mensaje": "Subcategoría creada correctamente.",
        "id": subcategoria.id,
        "nombre": subcategoria.nombre,
        "descripcion": subcategoria.descripcion
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def crear_tematica(request):
    nombre = request.data.get("nombre")
    descripcion = request.data.get("descripcion")

    if not nombre:
        return Response({"error": "El campo 'nombre' es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

    tematica = Tematica.objects.create(nombre=nombre, descripcion=descripcion)
    return Response({
        "mensaje": "Temática creada correctamente.",
        "id": tematica.id,
        "nombre": tematica.nombre,
        "descripcion": tematica.descripcion
    }, status=status.HTTP_201_CREATED)

# Vistas para seleccionar categorización
class CategoriaListView(generics.ListAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class SubcategoriaListView(generics.ListAPIView):
    queryset = Subcategoria.objects.all()
    serializer_class = SubcategoriaSerializer

class TematicaListView(generics.ListAPIView):
    queryset = Tematica.objects.all()
    serializer_class = TematicaSerializer

# Vista para buscar colaboradores
def search_users(request):
    query = request.GET.get('q', '').strip()
    if not query:
        return JsonResponse([], safe=False)

    usuarios = Usuario.objects.filter(
        Q(username__icontains=query) |
        Q(correo__icontains=query) |
        Q(nombres__icontains=query) |
        Q(apellidos__icontains=query)
    )

    data = [
        {
            "id": u.id,
            "username": u.username,
            "email": u.correo,
            "nombre_completo": f"{u.nombres or ''} {u.apellidos or ''}".strip()
        }
        for u in usuarios
    ]
    return JsonResponse(data, safe=False)

# Vista para añadir colaboradores
@api_view(['POST'])
def agregar_colaborador(request):
    api_id = request.data.get("api_id")
    colaborador_id = request.data.get("colaborador_id")

    if not api_id or not colaborador_id:
        return Response({"message": "Faltan parámetros."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        api = API.objects.get(id=api_id)
        colaborador = Usuario.objects.get(id=colaborador_id)

        if PermisoApi.objects.filter(api=api, colaborador=colaborador).exists():
            return Response({"message": "Este usuario ya es colaborador."}, status=status.HTTP_400_BAD_REQUEST)

        PermisoApi.objects.create(api=api, colaborador=colaborador)
        return Response({"message": "Colaborador agregado."}, status=status.HTTP_201_CREATED)

    except API.DoesNotExist:
        return Response({"message": "API no encontrada."}, status=status.HTTP_404_NOT_FOUND)
    except Usuario.DoesNotExist:
        return Response({"message": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("Error inesperado en agregar_colaborador:", e)
        return Response({"message": "Error interno del servidor."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Listar Colaboradores
@api_view(['GET'])
def listar_colaboradores(request, api_id):
    try:
        api = API.objects.get(id=api_id)
        permisos = PermisoApi.objects.filter(api=api).select_related("colaborador")

        data = []
        for permiso in permisos:
            colaborador = permiso.colaborador
            data.append({
                "id": permiso.id,
                "usuario": {
                    "id": colaborador.id,
                    "username": colaborador.username,
                    "email": colaborador.correo,
                    "nombre_completo": f"{colaborador.nombres or ''} {colaborador.apellidos or ''}".strip()
                }
            })

        return Response(data, status=200)

    except API.DoesNotExist:
        return Response({"message": "API no encontrada."}, status=404)
    except Exception as e:
        print("Error inesperado en listar_colaboradores:", e)
        return Response({"message": "Error interno del servidor."}, status=500)