from django.contrib import admin
from .models import *

class CategoriaAtributoInline(admin.TabularInline):
    model = CategoriaAtributo
    extra = 1
    fields = ['nombre', 'tipo_dato', 'valores_posibles', 'obligatorio', 'orden']
    ordering = ['orden']

class CategoriaAdmin(admin.ModelAdmin):
    inlines = [CategoriaAtributoInline]
    list_display = ['nombre', 'ultima_actualizacion', 'creado_por']
    search_fields = ['nombre']
    readonly_fields = ['ultima_actualizacion']
    
    def save_model(self, request, obj, form, change):
        if not obj.creado_por:
            obj.creado_por = request.user
        super().save_model(request, obj, form, change)

class CategoriaAtributoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'categoria', 'tipo_dato', 'obligatorio']
    list_filter = ['categoria', 'tipo_dato']
    search_fields = ['nombre', 'categoria__nombre']
    ordering = ['categoria', 'orden']

admin.site.register(CategoriaAtributo, CategoriaAtributoAdmin)

class ProductoAtributoInline(admin.TabularInline):
    model = ProductoAtributo
    extra = 1
    fields = ['atributo', 'valor_texto', 'valor_entero', 
             'valor_decimal', 'valor_booleano', 'color', 
             'material', 'dimension_ancho', 'dimension_alto',
             'dimension_profundidad', 'unidad_medida']
    autocomplete_fields = ['atributo']

class ProductoAdmin(admin.ModelAdmin):
    inlines = [ProductoAtributoInline]
    list_display = ['nombre', 'categoria', 'precio_venta', 'stock', 'activo']
    list_filter = ['categoria', 'activo', 'tipo_especifico']
    search_fields = ['nombre', 'descripcion']
    readonly_fields = ['fecha_creacion', 'ultima_actualizacion']
    fieldsets = (
        ('Información Básica', {
            'fields': ('nombre', 'descripcion', 'categoria', 'tipo_especifico')
        }),
        ('Precios y Stock', {
            'fields': ('precio_compra', 'precio_venta', 'stock', 'stock_minimo')
        }),
        ('Media', {
            'fields': ('imagen',),
            'classes': ('collapse',)
        }),
        ('Auditoría', {
            'fields': ('activo', 'creado_por', 'fecha_creacion', 'ultima_actualizacion'),
            'classes': ('collapse',)
        }),
    )

    def save_model(self, request, obj, form, change):
        if not obj.creado_por:
            obj.creado_por = request.user
        super().save_model(request, obj, form, change)

class DetalleCompraInline(admin.TabularInline):
    model = DetalleCompra
    extra = 1
    autocomplete_fields = ['producto']

class CompraAdmin(admin.ModelAdmin):
    inlines = [DetalleCompraInline]
    list_display = ['id', 'proveedor', 'fecha', 'total', 'estado']
    list_filter = ['estado', 'proveedor']
    readonly_fields = ['total']

class DetalleVentaInline(admin.TabularInline):
    model = DetalleVenta
    extra = 1
    autocomplete_fields = ['producto']

class VentaAdmin(admin.ModelAdmin):
    inlines = [DetalleVentaInline]
    list_display = ['id', 'cliente', 'fecha', 'total', 'estado']
    list_filter = ['estado', 'cliente']
    readonly_fields = ['total']

class ProveedorAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'empresa', 'email', 'telefono']
    search_fields = ['nombre', 'empresa__nombre']
    list_filter = ['empresa']

class MovimientoStockAdmin(admin.ModelAdmin):
    list_display = ['producto', 'cantidad', 'tipo_movimiento', 'fecha']
    list_filter = ['tipo_movimiento']
    readonly_fields = ['fecha']

admin.site.register(Categoria, CategoriaAdmin)
admin.site.register(Producto, ProductoAdmin)
admin.site.register(Compra, CompraAdmin)
admin.site.register(Venta, VentaAdmin)
admin.site.register(Proveedor, ProveedorAdmin)
admin.site.register(MovimientoStock, MovimientoStockAdmin)
admin.site.register(DetalleCompra)
admin.site.register(DetalleVenta)
admin.site.register(Empresa)
admin.site.register(FacturaVenta)
admin.site.register(Cliente)
admin.site.register(ProductoProveedor)
admin.site.register(Descuento)
admin.site.register(DevolucionCompra)
admin.site.register(DevolucionVenta)
admin.site.register(Marca)
admin.site.register(MetodoPago)