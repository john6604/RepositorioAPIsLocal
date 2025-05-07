from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from apis.views import APIViewSet

router = routers.DefaultRouter()
router.register('apis', APIViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
