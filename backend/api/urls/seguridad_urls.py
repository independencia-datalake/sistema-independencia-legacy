from django.urls import path
from api.views import seguridad_views as views

urlpatterns = [
    path('clasificaciondelito/', views.get_clasificacion_delito),
    path('delito/', views.get_delito),
    path('llamadoseguridad/', views.get_llamado_seguridad),
    path('denunciante/', views.get_denunciante),
    path('requerimiento/', views.get_requerimiento),
]