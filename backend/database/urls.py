from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('rest_framework.urls')),
    path('api/core/', include('api.urls.core_urls')),
    path('api/farmacia/', include('api.urls.farmacia_urls')),
    path('api/seguridad/', include('api.urls.seguridad_urls')),
    path('api/stock/', include('api.urls.stock_urls')),
    path('api/users/', include('api.urls.users_urls')),
]