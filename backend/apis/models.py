from django.db import models

class Rol(models.Model):
    nombre      = models.CharField(max_length=50)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "roles"

    def __str__(self):
        return self.nombre


class Usuario(models.Model):
    correo           = models.EmailField(max_length=100, unique=True)
    username         = models.CharField(max_length=150, unique=True)
    contrasena_hash  = models.TextField()
    nombres          = models.CharField(max_length=100, blank=True, null=True)
    apellidos        = models.CharField(max_length=100, blank=True, null=True)
    biografia        = models.TextField(blank=True, null=True)
    rol              = models.ForeignKey(Rol, on_delete=models.CASCADE, db_column="rol_id", null=True, blank=True)
    estado           = models.CharField(max_length=50, blank=True, null=True)
    creado_en        = models.DateTimeField(auto_now_add=True, null=True)
    actualizado_en   = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        db_table = "usuarios"
        indexes = [models.Index(fields=["correo"], name="idx_usuario_correo")]

    def __str__(self):
        return self.correo


class API(models.Model):
    PERMISO_CHOICES = [
        ("publico", "Público"),
        ("privado", "Privado"),
        ("restringido", "Restringido"),
    ]

    nombre            = models.CharField(max_length=100)
    descripcion       = models.TextField(blank=True, null=True)
    detalles_tecnicos = models.TextField(blank=True, null=True)
    documentacion     = models.TextField(blank=True, null=True)
    creado_por        = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column="creado_por", null=True, blank=True)
    permiso           = models.CharField(max_length=12, choices=PERMISO_CHOICES, default="privado")
    estado            = models.CharField(max_length=50, blank=True, null=True)
    creado_en         = models.DateTimeField(auto_now_add=True, null=True)
    actualizado_en    = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        db_table = "apis"
        indexes = [models.Index(fields=["nombre"], name="idx_api_nombre")]
        constraints = [
            models.UniqueConstraint(fields=["nombre", "creado_por"], name="unique_api_por_usuario")
        ]

    def __str__(self):
        return self.nombre


class VersionApi(models.Model):
    api                 = models.ForeignKey(API, on_delete=models.CASCADE, db_column="api_id", null=True, blank=True)
    numero_version      = models.CharField(max_length=20)
    descripcion_cambios = models.TextField(blank=True, null=True)
    creado_en           = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        db_table = "versiones_api"
        unique_together = [("api", "numero_version")]
        indexes = [models.Index(fields=["numero_version"], name="idx_versiones_version")]

    def __str__(self):
        return f"{self.api.nombre} v{self.numero_version}"


class PermisoApi(models.Model):
    api        = models.ForeignKey(API, on_delete=models.CASCADE, db_column="api_id", null=True, blank=True)
    usuario    = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column="usuario_id", null=True, blank=True)
    creado_en  = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        db_table = "permisos_api"
        unique_together = [("api", "usuario")]

    def __str__(self):
        return f"{self.usuario.correo} → {self.api.nombre}"


class Sesion(models.Model):
    usuario      = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column="usuario_id", null=True, blank=True)
    token_sesion = models.TextField()
    creado_en    = models.DateTimeField(auto_now_add=True, null=True)
    expira_en    = models.DateTimeField(blank=True, null=True)
    activa       = models.BooleanField(default=True)

    class Meta:
        db_table = "sesiones"
        indexes = [models.Index(fields=["token_sesion"], name="idx_sesion_token")]

    def __str__(self):
        return f"Sesión {self.id} de {self.usuario.correo}"


class Auditoria(models.Model):
    usuario        = models.ForeignKey(Usuario, on_delete=models.CASCADE, db_column="usuario_id", null=True, blank=True)
    accion         = models.CharField(max_length=100)
    tabla_afectada = models.CharField(max_length=100, blank=True, null=True)
    registro_id    = models.IntegerField(blank=True, null=True)
    timestamp      = models.DateTimeField(auto_now_add=True, null=True)
    detalles       = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "auditoria"
        indexes = [
            models.Index(fields=["accion"], name="idx_auditoria_accion"),
            models.Index(fields=["timestamp"], name="idx_auditoria_fecha"),
        ]

    def __str__(self):
        return f"{self.accion} en {self.tabla_afectada}"
