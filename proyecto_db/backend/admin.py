import json
from django.contrib import admin
from django.utils.html import format_html
from django.contrib.postgres.fields import JSONField
from django.urls import reverse
from django_jsonform.widgets import JSONFormWidget
from jsoneditor.forms import JSONEditor
from .models import *
from django import forms
from django.contrib.admin import SimpleListFilter


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

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'email', 'contact_info', 'created_by')
    search_fields = ('name', 'email', 'phone')
    list_filter = ('name',)
    readonly_fields = ('last_updated',)
    
    def contact_info(self, obj):
        return format_html("📧 {}<br>📞 {}", obj.email or "-", obj.phone or "-")
    contact_info.short_description = "Contacto"

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
    list_display = ('product', 'movement_type', 'quantity', 'date')
    list_filter = ('movement_type', ('product__category', admin.RelatedFieldListFilter))
    readonly_fields = ('date',)
    search_fields = ('product__name',)
    
    # def related_transaction(self, obj):
    #     if obj.purchase:
    #         url = reverse('admin:backend_purchase_change', args=[obj.purchase.id])
    #         return format_html('<a href="{}">Compra {}</a>', url, obj.purchase.invoice_number)
    #     if obj.sale:
    #         url = reverse('admin:backend_sale_change', args=[obj.sale.id])
    #         return format_html('<a href="{}">Venta {}</a>', url, obj.sale.id)
    #     return "-"
    # related_transaction.short_description = "Transacción"

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

@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = (
        'name_column',
        'description',
        'active',
        'created_by',
        'last_updated'
    )
    
    list_editable = ('active',)
    
    search_fields = ['name', 'description']
    
    list_filter = ('active', 'name')
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('name', 'active'),
            'description': 'Configuración principal del método de pago'
        }),
        ('Detalles Adicionales', {
            'fields': ('description',),
            'classes': ('collapse',) 
        }),
    )
    
    readonly_fields = ('created_by', 'last_updated')
    
    def name_column(self, obj):
        return obj.get_name_display()
    name_column.short_description = 'Tipo'

    # def save_model(self, request, obj, form, change):
    #     if not obj.pk:
    #         obj.created_by = request.user
    #     obj.last_updated = timezone.now()
    #     super().save_model(request, obj, form, change)

@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'type_display',
        'value',
        'scope_display',
        'active',
        'applicable_products_count',
        'created_by',
        'last_updated'
    )
    list_editable = ('active',)
    search_fields = ['name', 'description']
    list_filter = ('active', 'type', 'scope')
    filter_horizontal = ('products', 'categories')
    readonly_fields = ('created_by', 'last_updated', 'applicable_products_preview')
    
    fieldsets = (
        ('Información General', {
            'fields': ('name', 'active'),
            'description': 'Configuración básica del descuento'
        }),
        ('Configuración del Descuento', {
            'fields': ('type', 'value'),
            'description': 'Tipo y valor del descuento'
        }),
        ('Alcance del Descuento', {
            'fields': ('scope', 'products', 'categories'),
            'description': format_html(
                '<strong>Notas:</strong><br>'
                '- "Productos específicos": Selecciona al menos 1 producto<br>'
                '- "Categorías específicas": Selecciona al menos 1 categoría'
            )
        }),
        ('Auditoría', {
            'fields': ('created_by', 'last_updated'),
            'classes': ('collapse',)
        }),
    )

    def type_display(self, obj):
        return obj.get_type_display()
    type_display.short_description = 'Tipo'

    def scope_display(self, obj):
        return obj.get_scope_display()
    scope_display.short_description = 'Alcance'

    def applicable_products_count(self, obj):
        return obj.applicable_products().count()
    applicable_products_count.short_description = 'Productos Aplicables'

    def applicable_products_preview(self, obj):
        products = obj.applicable_products().values_list('name', flat=True)[:10]
        return format_html(
            "<div style='max-height: 200px; overflow-y: auto;'>"
            "<strong>Productos afectados:</strong><br>{}"
            "</div>",
            "<br>".join(products) if products else "Ninguno (según el alcance)"
        )
    applicable_products_preview.short_description = 'Previsualización de Aplicación'

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        obj.last_updated = timezone.now()
        super().save_model(request, obj, form, change)

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "products":
            kwargs["queryset"] = Product.objects.select_related('category')
        elif db_field.name == "categories":
            kwargs["queryset"] = Category.objects.prefetch_related('product_set')
        return super().formfield_for_manytomany(db_field, request, **kwargs)
    
class SaleDetailInline(admin.TabularInline):
    model = SaleDetail
    extra = 0
    readonly_fields = ('final_price', 'sale_attributes')
    fields = (
        'product', 'quantity', 'unit_price', 
        'discount_type', 'discount_value', 'final_price',
        'sale_attributes'
    )
    autocomplete_fields = ['product']
    verbose_name_plural = "Detalles de Venta"
    
    def has_add_permission(self, request, obj=None):
        return obj and obj.status == Sale.Status.PENDING

    def has_delete_permission(self, request, obj=None):
        return obj and obj.status == Sale.Status.PENDING

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = (
        'date',
        'status_badge',
        'payment_method',
        'total_display',
        'products_count'
    )
    list_filter = (
        ('status', admin.ChoicesFieldListFilter),
        ('date', admin.DateFieldListFilter),
        'payment_method'
    )
    search_fields = (
        'customer__name',
        'customer__email',
        'payment_method__name'
    )
    raw_id_fields = ('customer', 'payment_method')
    date_hierarchy = 'date'
    inlines = [SaleDetailInline]
    actions = ['mark_as_paid', 'cancel_sale']
    readonly_fields = ('created_by', 'date', 'subtotal', 'total')
    fieldsets = (
        (None, {
            'fields': (
                ('date', 'created_by'),
                ('customer', 'payment_method'),
                'status'
            )
        }),
        ('Totales', {
            'fields': (
                ('subtotal', 'total'),
            ),
            'classes': ('collapse',)
        }),
    )

    # def customer_link(self, obj):
    #     url = reverse("admin:app_customer_change", args=[obj.customer.id])
    #     return format_html('<a href="{}">{}</a>', url, obj.customer)
    # customer_link.short_description = "Cliente"

    def status_badge(self, obj):
        status_map = {
            Sale.Status.PENDING: ('secondary', '⏳'),
            Sale.Status.PAID: ('success', '✅'),
            Sale.Status.CANCELLED: ('danger', '❌'),
            Sale.Status.REFUNDED: ('warning', '↩️'),
        }
        color, icon = status_map.get(obj.status, ('dark', '?'))
        return format_html(
            '<span class="badge bg-{}">{} {}</span>',
            color,
            icon,
            obj.get_status_display()
        )
    status_badge.short_description = "Estado"

    def total_display(self, obj):
        return f"${obj.total:.2f}"
    total_display.short_description = "Total"

    def products_count(self, obj):
        return obj.products.count()
    products_count.short_description = "Productos"

    def mark_as_paid(self, request, queryset):
        updated = queryset.exclude(status=Sale.Status.PAID).update(
            status=Sale.Status.PAID
        )
        self.message_user(request, f"{updated} ventas marcadas como pagadas")
    mark_as_paid.short_description = "Marcar como pagado"

    def cancel_sale(self, request, queryset):
        for sale in queryset:
            if sale.status == Sale.Status.PAID:
                self.message_user(
                    request, 
                    f"Venta {sale.id} no puede ser cancelada (ya está pagada)",
                    level='ERROR'
                )
                continue
            sale.status = Sale.Status.CANCELLED
            sale.save()
            sale.saledetail_set.all().delete()
        self.message_user(request, f"{queryset.count()} ventas canceladas")
    cancel_sale.short_description = "Cancelar ventas seleccionadas"

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        obj.update_total()
        super().save_model(request, obj, form, change)

@admin.register(SaleDetail)
class SaleDetailAdmin(admin.ModelAdmin):
    list_display = (
        'product',
        'quantity',
        'unit_price',
        'discount_display',
        'final_price'
    )
    list_filter = ('discount_type',)
    search_fields = (
        'sale__id',
        'product__name'
    )
    raw_id_fields = ('sale', 'product')
    readonly_fields = ('sale_attributes', 'final_price')

    # def sale_link(self, obj):
    #     url = reverse("admin:app_sale_change", args=[obj.sale.id])
    #     return format_html('<a href="{}">Venta #{}</a>', url, obj.sale.id)
    # sale_link.short_description = "Venta"

    # def product_link(self, obj):
    #     url = reverse("admin:app_product_change", args=[obj.product.id])
    #     return format_html('<a href="{}">{}</a>', url, obj.product.name)
    # product_link.short_description = "Producto"

    def discount_display(self, obj):
        if not obj.discount_type:
            return "-"
        symbol = "%" if obj.discount_type == DiscountTypeEnum.PERCENTAGE else "$"
        return f"{obj.discount_value}{symbol}"
    discount_display.short_description = "Descuento"

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.sale.status != Sale.Status.PENDING:
            return self.readonly_fields + ('quantity', 'unit_price')
        return self.readonly_fields

    def has_change_permission(self, request, obj=None):
        if obj and obj.sale.status != Sale.Status.PENDING:
            return False
        return super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        if obj and obj.sale.status != Sale.Status.PENDING:
            return False
        return super().has_delete_permission(request, obj)
    
class DueDateFilter(SimpleListFilter):
    title = 'Estado de fecha'
    parameter_name = 'due_status'
    
    def lookups(self, request, model_admin):
        return (
            ('pending', 'Pendiente'),
            ('overdue', 'Vencida'),
            ('paid', 'Pagada'),
        )

    def queryset(self, request, queryset):
        now = timezone.now()
        if self.value() == 'pending':
            return queryset.filter(due_date__gt=now.date(), sale__status=Sale.Status.PAID)
        if self.value() == 'overdue':
            return queryset.filter(due_date__lt=now.date(), sale__status=Sale.Status.PAID)
        if self.value() == 'paid':
            return queryset.filter(sale__status=Sale.Status.PAID)
        return queryset

@admin.register(SaleInvoice)
class SaleInvoiceAdmin(admin.ModelAdmin):
    list_display = (
        'invoice_number',
        'issue_date',
        'due_date_status',
        'total_amount_display',
        'payment_status',
        'sale',
        'created_by'
    )
    list_filter = (DueDateFilter, 'issue_date')
    search_fields = ('invoice_number', 'sale__id')
    readonly_fields = ('created_by', 'last_updated', 'invoice_number', 'issue_date', 'sale')
    raw_id_fields = ('sale',)
    autocomplete_fields = ['sale']
    date_hierarchy = 'issue_date'
    fieldsets = (
        ('Información Básica', {
            'fields': (
                ('invoice_number', 'sale'),
                ('due_date',)
            )
        }),
        ('Detalles Financieros', {
            'fields': (
                ('subtotal', 'discount'),
                'total_amount',
                'notes'
            ),
            'classes': ('collapse',)
        }),
        ('Auditoría', {
            'fields': ('created_by', 'last_updated'),
            'classes': ('collapse',)
        }),
    )
    actions = ['send_invoice_email', 'export_to_pdf']

    # def sale_link(self, obj):
    #     url = reverse("admin:sales_sale_change", args=[obj.sale.id])
    #     return format_html('<a href="{}">Venta #{}</a>', url, obj.sale.id)
    # sale_link.short_description = "Venta Relacionada"

    def due_date_status(self, obj):
        today = timezone.now().date()
        if obj.due_date < today and obj.sale.status != Sale.Status.PAID:
            return format_html('<span style="color: red; font-weight: bold;">VENCIDA ({})</span>', obj.due_date)
        elif obj.sale.status == Sale.Status.PAID:
            return format_html('<span style="color: green;">PAGADA</span>')
        return format_html('<span style="color: orange;">PENDIENTE ({})</span>', obj.due_date)
    due_date_status.short_description = "Estado"

    def total_amount_display(self, obj):
        return f"${obj.total_amount:.2f}" if obj.total_amount else "-"
    total_amount_display.short_description = "Total"

    def payment_status(self, obj):
        status_map = {
            Sale.Status.PAID: ('green', '✅ Pagada'),
            Sale.Status.PENDING: ('orange', '⏳ Pendiente'),
            Sale.Status.CANCELLED: ('red', '❌ Cancelada'),
            Sale.Status.REFUNDED: ('blue', '↩️ Reembolsada'),
        }
        color, text = status_map.get(obj.sale.status, ('black', 'Desconocido'))
        return format_html('<span style="color: {};">{}</span>', color, text)
    payment_status.short_description = "Estado de Pago"

    def get_readonly_fields(self, request, obj=None):
        readonly = super().get_readonly_fields(request, obj)
        if obj and obj.sale.status == Sale.Status.PAID:
            return readonly + ('subtotal', 'discount', 'total_amount', 'due_date')
        return readonly

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

    def send_invoice_email(self, request, queryset):
        # Implementar lógica de envío de emails
        self.message_user(request, f"{queryset.count()} facturas enviadas")
    send_invoice_email.short_description = "Enviar factura por email"

    def export_to_pdf(self, request, queryset):
        # Implementar generación de PDF
        self.message_user(request, f"{queryset.count()} PDFs generados")
    export_to_pdf.short_description = "Exportar a PDF"

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "sale":
            kwargs["queryset"] = Sale.objects.filter(invoice__isnull=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def clean(self):
        if self.cleaned_data.get('due_date') < self.cleaned_data.get('issue_date').date():
            raise ValidationError("La fecha de vencimiento no puede ser anterior a la fecha de emisión")
        
    # def get_readonly_fields(self, request, obj=None):
    #     readonly = super().get_readonly_fields(request, obj)
    #     if obj:
    #         return readonly + ('sale',)
    #     return readonly

    # def formfield_for_foreignkey(self, db_field, request, **kwargs):
    #     if db_field.name == "sale":
    #         if request.resolver_match.url_name == 'sales_saleinvoice_change':  # En edición
    #             kwargs["queryset"] = Sale.objects.filter(pk=kwargs.get('initial', None))
    #         else:  # En creación
    #             kwargs["queryset"] = Sale.objects.filter(invoice__isnull=True)
    #     return super().formfield_for_foreignkey(db_field, request, **kwargs)

    # def save_model(self, request, obj, form, change):
    #     if change and 'sale' in form.changed_data:
    #         old_sale = Sale.objects.get(pk=form.initial['sale'])
    #         new_sale = obj.sale
            
    #         # Revertir venta anterior
    #         old_sale.invoice = None
    #         old_sale.save()
            
    #         # Actualizar nueva venta
    #         new_sale.invoice = obj
    #         new_sale.save()
            
    #     super().save_model(request, obj, form, change)