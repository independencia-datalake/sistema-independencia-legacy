from django.contrib import admin
from .models.core import *
from .models.farmacia import *
from .models.seguridad import *
from .models.stock import *


## ADMIN CORE


admin.site.register(CallesIndependencia)
admin.site.register(UV)
admin.site.register(Persona)
admin.site.register(Telefono)
admin.site.register(Correo)
admin.site.register(Direccion)
admin.site.register(PersonaInfoSalud)
admin.site.register(PersonaArchivos)


## ADMIN FARMACIA


admin.site.register(Laboratorios)
admin.site.register(ProductoFarmacia)
admin.site.register(ComprobanteVenta)
admin.site.register(Recetas)
admin.site.register(ProductoVendido)
admin.site.register(CargaProducto)


## ADMIN SEGURIDAD


admin.site.register(ClasificacionDelito)
admin.site.register(Delito)
admin.site.register(LlamadoSeguridad)
admin.site.register(Denunciante)
admin.site.register(Requerimiento)


## ADMIN STOCK


admin.site.register(BodegaVirtual)
admin.site.register(OrdenIngresoProducto)
admin.site.register(OrdenIngresoLista)
admin.site.register(ProductoIngresado)
admin.site.register(ProductoMermado)