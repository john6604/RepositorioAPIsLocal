from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from apis.views import APIViewSet, RegistrarUser

router = routers.DefaultRouter()
router.register('apis', APIViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path("api/registraruser/", views.RegistrarUser.as_view(), name="registraruser"),
]
