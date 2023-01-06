from django.urls import path
from . import views

urlpatterns = [
    path('uv/', views.get_data_uv),
    path('callesindependencia/', views.get_data_calles_independencia),
]
