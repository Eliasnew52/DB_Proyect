from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from jsonschema.exceptions import ValidationError as SchemaError
from jsonschema import validate as jsonschema_validate
from backend.models import Category

class CategoryWriteSerializer(serializers.ModelSerializer):
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
    
class CategoryReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class CategorySchemaReadSerializer(serializers.Serializer):
    product_schema = serializers.JSONField()
