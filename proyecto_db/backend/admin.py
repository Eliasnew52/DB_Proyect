from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(DetalleCompra)
admin.site.register(DetalleVenta)
admin.site.register(Compra)
admin.site.register(Venta)
admin.site.register(Categoria)
admin.site.register(Producto)
admin.site.register(Empresa)
admin.site.register(Proveedor)
admin.site.register(FacturaVenta)
admin.site.register(Cliente)
admin.site.register(ProductoProveedor)
admin.site.register(MovimientoStock)
