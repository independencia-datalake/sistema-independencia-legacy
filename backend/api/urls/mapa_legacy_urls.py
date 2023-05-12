from django.urls import path
from api.views import mapa_legacy_views as views

urlpatterns = [
    path('empresas/', views.EmpresasListCreateAPIViw.as_view()),
    path('empresas-uv/<int:uv_id>/', views.EmpresasByUVAPIViw.as_view()),
    path('empresas-total/', views.CountEmpresasByUV.as_view()),
    path('empresas-comercial/', views.CountComercialEmpresasByUV.as_view()),

    # POR FECHA
    path('empresas-total-fecha/<str:fecha_inicio>/<str:fecha_fin>/', views.countEmpresasByUVFecha.as_view()),
    path('empresas-total-fecha/<str:fecha_inicio>/<str:fecha_fin>/<str:tipo>/', views.CountEmpresasByUVFechaTipo.as_view()),
    path('empresas-total-fecha-rank/<str:fecha_inicio>/<str:fecha_fin>/', views.countEmpresasByUVFechaRank.as_view()),

    #RANGO FECHAS
    path('rango-fechas/<str:tipo>/', views.RangoFechasByTipoView.as_view())
] 
