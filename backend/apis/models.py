from django.db import models

class Api(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    version = models.CharField(max_length=10)
    visibilidad = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre
