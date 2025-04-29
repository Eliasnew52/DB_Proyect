from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from jsonschema import validate as jsonschema_validate
from jsonschema.exceptions import ValidationError as SchemaError
from .models import *
from .field import SchemaValidatedJSONField

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ('created_by', 'last_updated')

    def validate_product_schema(self, value):
        try:
            jsonschema_validate({}, value)
        except SchemaError as e:
            raise ValidationError(f"Esquema JSON inválido: {e.message}")
        return value

class ProductSerializer(serializers.ModelSerializer):
    attributes = SchemaValidatedJSONField(
        schema=None,
        write_only=True,
        required=False
    )

    class Meta:
        model = Product  
        fields = '__all__'
        read_only_fields = ('created_by', 'last_updated')  
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if 'category' in self.fields:
            self.fields['attributes'].schema = self.get_schema()

    def get_schema(self):
        if self.instance and self.instance.category:
            return self.instance.category.product_schema
        return {}

