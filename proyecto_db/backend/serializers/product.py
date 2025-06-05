from rest_framework import serializers
from backend.utils.schema_validation import SchemaValidatedJSONField
from backend.models import Category, Product, ProductMeasurement
from .shorts import BrandShortSerializer, CategoryShortSerializer, SupplierShortSerializer, UserShortSerializer
from .product_measurement import ProductMeasurementSerializer
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
        meas_data = validated_data.pop('measurements', None)
        product = super().update(instance, validated_data)
        if meas_data is not None:
            ProductMeasurement.objects.update_or_create(
                product=product,
                defaults=meas_data
            )
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