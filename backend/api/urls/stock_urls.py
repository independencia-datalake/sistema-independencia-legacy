from django.urls import path
from api.views import stock_views as views

urlpatterns = [
    path('bodegavirtual/', views.BodegaVirtualListCreateAPIViw.as_view()),
    path('bodegavirtual/<int:pk>/', views.BodegaVirtualDetailAPIViw.as_view()),
    path('bodegavirtual-by-producto/<int:nombre>/', views.BodegaVirtualDetailByProductoAPIViw.as_view()),
    path('bodegavirtual/update/<int:pk>/', views.BodegaVirtualUpdateAPIViw.as_view()),
    path('bodegavirtual/delete/<int:pk>/', views.BodegaVirtualDeleteAPIViw.as_view()),
    path('ordeningresoproducto/', views.OrdenIngresoProductoListCreateAPIViw.as_view()),
    path('ordeningresoproducto/<int:pk>/', views.OrdenIngresoProductoDetailAPIViw.as_view()),
    path('ordeningresoproducto/update/<int:pk>/', views.OrdenIngresoProductoUpdateAPIViw.as_view()),
    path('ordeningresoproducto/delete/<int:pk>/', views.OrdenIngresoProductoDeleteAPIViw.as_view()),
    path('ordeningresolista/', views.OrdenIngresoListaListCreateAPIViw.as_view()),
    path('ordeningresolista/<int:pk>/', views.OrdenIngresoListaDetailAPIViw.as_view()),
    path('ordeningresolista/update/<int:pk>/', views.OrdenIngresoListaUpdateAPIViw.as_view()),
    path('ordeningresolista/delete/<int:pk>/', views.OrdenIngresoListaDeleteAPIViw.as_view()),
    path('productoingresado/', views.ProductoIngresadoListCreateAPIViw.as_view()),
    path('productoingresado/<int:pk>/', views.ProductoIngresadoDetailAPIViw.as_view()),
    path('productoingresado/update/<int:pk>/', views.ProductoIngresadoUpdateAPIViw.as_view()),
    path('productoingresado/delete/<int:pk>/', views.ProductoIngresadoDeleteAPIViw.as_view()),
    path('productomermado/', views.ProductoMermadoListCreateAPIViw.as_view()),
    path('productomermado/<int:pk>/', views.ProductoMermadoDetailAPIViw.as_view()),
    path('productomermado/update/<int:pk>/', views.ProductoMermadoUpdateAPIViw.as_view()),
    path('productomermado/delete/<int:pk>/', views.ProductoMermadoDeleteAPIViw.as_view()),
]