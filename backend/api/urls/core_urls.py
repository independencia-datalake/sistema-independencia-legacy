from django.urls import path
from api.views import core_views as views

urlpatterns = [
    path('uv/', views.get_data_uv),
    path('callesindependencia/', views.get_data_calles_independencia),
    path('persona/', views.get_data_persona),
    path('telefono', views.get_data_telefono),
    path('correo/', views.get_data_correo),
    path('direccion/', views.get_data_direccion),
    path('personainfosalud/', views.get_data_persona_info_salud),
    path('datapersonaarchivos/', views.get_data_persona_archivos),
]