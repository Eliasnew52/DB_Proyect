from rest_framework import serializers
from backend.utils.schema_validation import SchemaValidatedJSONField
from backend.models import Category, Product
from .shorts import BrandShortSerializer, CategoryShortSerializer, SupplierShortSerializer

class ProductWriteSerializer(serializers.ModelSerializer):        
    attributes = SchemaValidatedJSONField(
        schema=None,
        required=False
    )

    class Meta:
        model = Product  
        fields = '__all__'
        read_only_fields = ('created_by', 'last_updated', 'creation_date')
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        request = self.context.get('request')
        request_method = request.method if request else None

        if request_method in ('POST', 'PUT', 'PATCH'):
            category = self._get_category_from_instance_or_data()
            if category and hasattr(category, 'product_schema'):
                self.fields['attributes'].schema = category.product_schema

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

    class Meta:
        model = Product  
        fields = '__all__'