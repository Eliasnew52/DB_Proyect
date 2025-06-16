from rest_framework import serializers
from backend.utils.schema_validation import SchemaValidatedJSONField
from backend.models import Category, Product, ProductMeasurement
from .shorts import BrandShortSerializer, CategoryShortSerializer, SupplierShortSerializer, UserShortSerializer
from .product_measurement import ProductMeasurementSerializer
from simple_history.utils import update_change_reason

PRODUCT_LABELS = {
    'name'           : 'Cambio de Nombre',
    'sale_price'     : 'Cambio de Precio de Venta',
    'purchase_price' : 'Cambio de Precio de Compra',
    'minimum_stock'  : 'Cambio de Stock Mínimo',
    'stock'          : 'Ajuste de Stock',
    'description'    : 'Cambio de Descripción',
    'category'       : 'Cambio de Categoría',
    'brand'          : 'Cambio de Marca',
    'suppliers'      : 'Cambio de Proveedores',
    'image'          : 'Cambio de Imagen',
    'active'         : 'Cambio de Estado',
}

MEASUREMENT_LABELS = {
    'length'       : 'Cambio de Longitud',
    'length_unit'  : 'Cambio Unidad Longitud',
    'width'        : 'Cambio de Ancho',
    'height'       : 'Cambio de Altura',
    'weight'       : 'Cambio de Peso',
    'weight_unit'  : 'Cambio Unidad Peso',
    'volume'       : 'Cambio de Volumen',
    'volume_unit'  : 'Cambio Unidad Volumen',
}

class ProductWriteSerializer(serializers.ModelSerializer):        
    attributes = SchemaValidatedJSONField(
        schema=None,
        required=False
    )
    measurements = ProductMeasurementSerializer(required=False)

    class Meta:
        model = Product  
        fields = [
            'name', 'description', 'category', 'brand',
            'suppliers', 'sale_price', 'purchase_price', 'attributes',
            'measurements', 'minimum_stock', 'stock', 'image'
        ]
        read_only_fields = ('created_by', 'last_updated', 'creation_date')
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        request = self.context.get('request')
        request_method = request.method if request else None

        if request_method in ('POST', 'PUT', 'PATCH'):
            category = self._get_category_from_instance_or_data()
            if category and hasattr(category, 'product_schema'):
                self.fields['attributes'].schema = category.product_schema

    def create(self, validated_data):
        meas_data = validated_data.pop('measurements', None)
        product = super().create(validated_data)
        if meas_data:
            ProductMeasurement.objects.create(product=product, **meas_data)
        return product

    def update(self, instance, validated_data):
        old_prod_vals = {
            field: getattr(instance, field)
            for field in PRODUCT_LABELS
        }

        meas_data = validated_data.pop('measurements', None)
        old_meas_vals = {}
        if hasattr(instance, 'measurements'):
            pm = instance.measurements
            old_meas_vals = {
                field: getattr(pm, field)
                for field in MEASUREMENT_LABELS
            }

        product = super().update(instance, validated_data)

        if meas_data is not None:
            pm, created = ProductMeasurement.objects.update_or_create(
                product=product,
                defaults=meas_data
            )
        else:
            pm, created = None, False

        prod_changes = [
            PRODUCT_LABELS[f]
            for f, old in old_prod_vals.items()
            if f in validated_data and str(old) != str(getattr(product, f))
        ]

        meas_changes = []
        if pm and old_meas_vals:
            for f, old in old_meas_vals.items():
                new = getattr(pm, f)
                if f in meas_data and str(old) != str(new):
                    meas_changes.append(MEASUREMENT_LABELS[f])

        all_changes = []
        if prod_changes:
            all_changes += prod_changes
        if meas_changes:
            all_changes += meas_changes

        if all_changes:
            reason = ", ".join(all_changes)
            update_change_reason(product, reason)

        return product

    def _get_category_from_instance_or_data(self):
        if isinstance(self.instance, Product):
            return getattr(self.instance, 'category', None)

        category_id = self.initial_data.get('category') if hasattr(self, 'initial_data') else None
        if category_id:
            try:
                return Category.objects.get(id=category_id)
            except Category.DoesNotExist:
                return None
        return None
    
class ProductReadSerializer(serializers.ModelSerializer):
    category = CategoryShortSerializer(read_only=True)
    brand = BrandShortSerializer(read_only=True)
    suppliers = SupplierShortSerializer(many=True, read_only=True)
    sale_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, coerce_to_string=False
    )
    purchase_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, coerce_to_string=False
    )
    measurements = ProductMeasurementSerializer(read_only=True)
    created_by = UserShortSerializer(read_only=True)


    class Meta:
        model = Product  
        fields = ['id', 'active', 'name', 'description', 'category', 'brand',
                  'suppliers', 'sale_price', 'purchase_price',
                  'attributes', 'measurements', 'created_by',
                  'last_updated', 'creation_date', 'image', 'stock', 'minimum_stock']