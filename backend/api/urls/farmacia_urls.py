from django.urls import path
from api.views import farmacia_views as views

urlpatterns = [
    path('laboratorios/', views.get_laboratorios),
    path('productofarmacia/', views.get_producto_farmacia),
    path('comprobanteventa/', views.get_comprobante_venta),
    path('recetas/', views.get_recetas),
    path('productovendido/', views.get_producto_vendido),
    path('cargaproducto/', views.get_carga_producto),
]