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

    # FARMACIA
    path('farmacia-total/<str:fecha_inicio>/<str:fecha_fin>/', views.CountFarmaciaByUV.as_view()),
    # EMPRESAS
    path('empresas-total/<str:fecha_inicio>/<str:fecha_fin>/', views.CountEmpresasByUV.as_view()),

    # LICENCIAS DE CONDUCIR
    path('transito-total/<str:fecha_inicio>/<str:fecha_fin>/', views.CountTransitoByUV.as_view()),

    # DOM OBRAS MUNICIPALES
    path('DOM-total/', views.CountObrasMunicipalesByUV.as_view()),

    #RANGO FECHAS
    path('rango-fechas/<str:mapa>/<str:tipo>/', views.RangoFechasGeneralView.as_view()),
] 
