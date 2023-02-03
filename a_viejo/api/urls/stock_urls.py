from django.urls import path
from api.views import stock_views as views

urlpatterns = [
    path('bodegavirtual/', views.get_bodega_virtual),
    path('ordeningresoproducto/', views.get_orden_ingreso_producto),
    path('ordeningresolista/', views.get_orden_ingreso_lista),
    path('productoingresado/', views.get_producto_ingresado),
    path('productomermado/', views.get_producto_mermado),
]