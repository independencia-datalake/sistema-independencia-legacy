from django.urls import path
from api.views import mapa_legacy_views as views

urlpatterns = [
    path('empresas/', views.EmpresasListCreateAPIViw.as_view()),
    path('empresas-uv/<int:uv_id>/', views.EmpresasByUVAPIViw.as_view()),
    path('empresas-total/', views.CountEmpresasByUV.as_view()),

    # FARMACIA
    path('farmacia-total/<str:fecha_inicio>/<str:fecha_fin>/', views.CountFarmaciaByUV.as_view()),
    # EMPRESAS
    path('empresas-total/<str:fecha_inicio>/<str:fecha_fin>/', views.CountEmpresasByUV.as_view()),
    path('empresas-dinero/<str:fecha_inicio>/<str:fecha_fin>/', views.CountEmpresasDineroByUV.as_view()),
    path('carga_empresas/', views.CargaEmpresasView.as_view(), name='carga_empresas'),
    #GSL
    path('GSL-total/<str:fecha_inicio>/<str:fecha_fin>/', views.CountGSLByUV.as_view()),
    path('carga_GSL/', views.CargaGSLView.as_view(), name='carga_gsl'),
    # EXCENCION ASEO
    path('exencion-total/<str:fecha_inicio>/<str:fecha_fin>/', views.CountExencionBasuraByUV.as_view()),
    # LICENCIAS DE CONDUCIR
    path('transito-total/<str:fecha_inicio>/<str:fecha_fin>/', views.CountTransitoByUV.as_view()),

    # DOM OBRAS MUNICIPALES
    path('DOM-total/<str:fecha_inicio>/<str:fecha_fin>/', views.CountObrasMunicipalesByUV.as_view()),

    #RANGO FECHAS
    path('rango-fechas/<str:mapa>/<str:tipo>/', views.RangoFechasGeneralView.as_view()),
] 
