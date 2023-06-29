from django.contrib import admin
from django.urls import path, include
from api.views.users_views import *
from django.conf import settings
from django.conf.urls.static import static

from rest_framework.authtoken.views import obtain_auth_token  # <-- Here

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('rest_framework.urls')),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),  # <-- And here
    # path('api/users/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/users/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/users/register/', registerUser, name='register'),

    path('api/mapa_legacy/', include('api.urls.mapa_legacy_urls')),
    path('api/data_lab/', include('api.urls.data_lab_urls')),
    path('api/core/', include('api.urls.core_urls')),
    path('api/farmacia/', include('api.urls.farmacia_urls')),
    path('api/seguridad/', include('api.urls.seguridad_urls')),
    path('api/stock/', include('api.urls.stock_urls')),
    path('api/users/', include('api.urls.users_urls')),



    path('api/users/profile/', getUserProfile, name="users-profile")
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)