from django.contrib import admin
from django.utils.html import format_html
from django.contrib.postgres.fields import JSONField
from django.urls import reverse
from django_jsonform.widgets import JSONFormWidget
from jsoneditor.forms import JSONEditor
from .models import *
import json
from django import forms

class SchemaAwareJSONEditor(JSONFormWidget):
    def __init__(self, schema=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.schema = schema

    @property
    def media(self):
        media = super().media
        media.add_js(['js/json_validation.js'])
        return media

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'schema_preview', 'created_by', 'last_updated')
    search_fields = ('name', 'description')
    list_filter = ('created_by',)
    readonly_fields = ('created_by', 'last_updated', 'schema_preview')
    formfield_overrides = {
        models.JSONField: {
            'widget': JSONEditor
        }
    }
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('name', 'description', 'image')
        }),
        ('Esquema de Productos', {
            'fields': ('product_schema', 'schema_preview'),
            'description': 'Defina el esquema JSON para los atributos de los productos en esta categoría'
        }),
        ('Auditoría', {
            'fields': ('created_by', 'last_updated'),
            'classes': ('collapse',)
        })
    )

    def schema_preview(self, obj):
        if obj.product_schema:
            return format_html(
                '<div style="background:#417690;padding:10px;border-radius:5px;max-height:200px;overflow:auto">'
                '<pre>{}</pre>'
                '</div>', 
                json.dumps(obj.product_schema, indent=2)
            )
        return "-"
    schema_preview.short_description = "Vista Previa del Esquema"

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        category = self.initial.get('category_id') or (self.instance.category_id if self.instance else None)

        if category and category.product_schema:
            self.fields['attributes'].widget = JSONFormWidget(schema=category.product_schema)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'sale_price', 'stock', 'category', 'attribute_preview', 'active')
    list_editable = ('active',)
    list_filter = ('category', 'suppliers', 'active')
    search_fields = ('name', 'description', 'attributes')
    readonly_fields = ('created_by', 'last_updated', 'creation_date', 'schema_help')
    filter_horizontal = ('suppliers',)
    
    def get_fieldsets(self, request, obj=None):
        fieldsets = [
            ('Información Básica', {
                'fields': ('name', 'description', 'category', 'brand', 'suppliers')
            }),
            ('Precios y Stock', {
                'fields': ('sale_price', 'purchase_price', 'minimum_stock', 'stock')
            }),
            ('Atributos Específicos', {
                'fields': ('schema_help', 'attributes'),
                'classes': ('collapse',) if not obj else ()
            }),
            ('Multimedia', {
                'fields': ('image',)
            }),
            ('Estado y Auditoría', {
                'fields': ('active', 'created_by', 'creation_date', 'last_updated'),
                'classes': ('collapse',)
            })
        ]
        return fieldsets

    def get_form(self, request, obj=None, **kwargs):
        if obj and obj.category:
            self.formfield_overrides = {
                JSONField: {
                    'widget': JSONFormWidget(schema=obj.category.product_schema)
                }
            }
        return super().get_form(request, obj, **kwargs)

    def schema_help(self, obj):
        if obj.category and obj.category.product_schema:
            return format_html("""
                <div style="background:#f8f9fa;padding:10px;border-radius:5px;margin-bottom:10px">
                    <h4 style="margin-top:0">Esquema requerido para {}:</h4>
                    <pre style="white-space: pre-wrap">{}</pre>
                </div>
            """, obj.category.name, json.dumps(obj.category.product_schema, indent=2))
        return "Seleccione una categoría para ver el esquema de atributos"
    schema_help.short_description = "Guía de Atributos"

    def attribute_preview(self, obj):
        return format_html(
            '<div style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">{}</div>',
            json.dumps(obj.attributes, indent=2)
        )
    attribute_preview.short_description = "Atributos"

    class Media:
        js = ('js/product_admin.js',)

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'brand_list', 'contact_info', 'product_count', 'created_by')
    search_fields = ('name', 'email', 'phone')
    list_filter = ('company',)
    filter_horizontal = ('brands',)
    readonly_fields = ('created_by', 'last_updated', 'product_count')
    
    def brand_list(self, obj):
        return ", ".join([b.name for b in obj.brands.all()[:3]]) + ("..." if obj.brands.count() > 3 else "")
    brand_list.short_description = "Marcas"
    
    def contact_info(self, obj):
        return format_html("📧 {}<br>📞 {}", obj.email or "-", obj.phone or "-")
    contact_info.short_description = "Contacto"
    
    def product_count(self, obj):
        return Product.objects.filter(suppliers=obj).count()
    product_count.short_description = "Productos"

class StockMovementInline(admin.TabularInline):
    model = StockMovement
    extra = 0
    readonly_fields = ('movement_type', 'quantity', 'date', 'related_transaction')
    
    def related_transaction(self, obj):
        if obj.purchase:
            return format_html('Compra #{}', obj.purchase.invoice_number)
        if obj.sale:
            return format_html('Venta #{}', obj.sale.id)
        return "-"
    related_transaction.short_description = "Transacción"

@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ('product', 'movement_type', 'quantity', 'date', 'related_transaction')
    list_filter = ('movement_type', ('product__category', admin.RelatedFieldListFilter))
    readonly_fields = ('date', 'related_transaction')
    search_fields = ('product__name',)
    
    def related_transaction(self, obj):
        if obj.purchase:
            url = reverse('admin:app_purchase_change', args=[obj.purchase.id])
            return format_html('<a href="{}">Compra {}</a>', url, obj.purchase.invoice_number)
        if obj.sale:
            url = reverse('admin:app_sale_change', args=[obj.sale.id])
            return format_html('<a href="{}">Venta {}</a>', url, obj.sale.id)
        return "-"
    related_transaction.short_description = "Transacción"

class PurchaseDetailInline(admin.TabularInline):
    model = PurchaseDetail
    extra = 1
    autocomplete_fields = ('product',)
    fields = ('product', 'quantity', 'unit_price', 'total_price')
    readonly_fields = ('total_price',)
    
    def total_price(self, obj):
        return obj.quantity * obj.unit_price
    total_price.short_description = "Total"

@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    inlines = [PurchaseDetailInline]

admin.site.site_header = "Administración de Librería"
admin.site.site_title = "Sistema de Inventario"
admin.site.index_title = "Panel de Control"
admin.site.enable_nav_sidebar = False
class LowStockFilter(admin.SimpleListFilter):
    title = 'Estado de stock'
    parameter_name = 'stock_status'
    
    def lookups(self, request, model_admin):
        return (
            ('low', 'Stock Bajo'),
            ('ok', 'Stock OK'),
        )
    
    def queryset(self, request, queryset):
        if self.value() == 'low':
            return queryset.filter(stock__lt=F('minimum_stock'))
        if self.value() == 'ok':
            return queryset.filter(stock__gte=F('minimum_stock'))
        
@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'short_description', 'creation_date', 'image_tag', 'created_by')
    search_fields = ('name',)
    list_filter = ('creation_date',)
    readonly_fields = ('created_by', 'last_updated')
    
    def short_description(self, obj):
        return (obj.description[:50] + "...") if obj.description and len(obj.description) > 50 else (obj.description or "-")
    short_description.short_description = "Descripción corta"

    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height: 50px;"/>', obj.image.url)
        return "-"
    image_tag.short_description = "Imagen"

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'last_updated_display')
    search_fields = ('name',)
    readonly_fields = ('created_by', 'last_updated')
    
    def last_updated_display(self, obj):
        if obj.last_updated:
            return obj.last_updated.strftime("%d-%m-%Y %H:%M")
        return "-"
    last_updated_display.short_description = "Última actualización"