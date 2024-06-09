from django.urls import path
from api.views import data_lab_views as views

urlpatterns = [

    #FARMACIA
    path('update_farmacia/', views.UpdateFarmaciaDataLabView.as_view(), name='update_farmacia'),
    path('farmacia/', views.FarmaciaDataLabView.as_view(), name='farmacia_datalab_vis'),
    path('farmaciaUV/<int:uv>/', views.FarmaciaDataLabByUVView.as_view()),
    #IMPUESTOS Y DERECHOS
    path('update_empresas/', views.UpdateEmpresasDataLabView.as_view(), name='update_empresas'),
    path('empresas/', views.EmpresasDataLabView.as_view(), name='empresas_datalab_vis'),
    path('empresasUV/<int:uv>/', views.EmpresasDataLabByUVView.as_view()),
    path('empresas-rank/', views.RankEmpresasDataLabView.as_view()),
    #DOM
    path('update_DOM/', views.UpdateDomDatalabView.as_view(), name='update_dom'),
    path('DOM/', views.DOMDataLabView.as_view(), name='dom_datalab_vis'),
    path('DOMUV/<int:uv>/', views.DOMDataLabByUVView.as_view()),
    path('DOM-rank/', views.RankDomDataLabView.as_view()),
    #TRANSITO
    path('update_transito/', views.UpdateTransitoDataLabView.as_view(), name='update_datalab'),
    path('transito/', views.TransitoDataLabView.as_view(), name='transito_datalab_vis'),
    path('transitoUV/<int:uv>/', views.TransitoDataLabByUVView.as_view()),
    #API GPT
    path('GPTUV/<int:uv>/', views.GPTDataLabByUVView.as_view()),
    path('GPTUV/update/<int:uv>/', views.UpdateGPTDataLabByUVView.as_view(), name='update_gpt_data_lab_by_uv'),
]