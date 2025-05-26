from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from jsonschema.exceptions import ValidationError as SchemaError
from jsonschema import validate as jsonschema_validate
from jsonschema import Draft202012Validator
from backend.models import Category
import json

class CategoryWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ('created_by', 'last_updated')

    def validate_product_schema(self, value):
        if isinstance(value, str):
            try:
                value = json.loads(value)
            except Exception:
                raise serializers.ValidationError("El esquema debe ser un JSON válido.")
        try:
            Draft202012Validator.check_schema(value)
        except SchemaError as e:
            raise ValidationError(f"Esquema JSON inválido: {e.message}")
        return value
    
class CategoryReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class CategorySchemaReadSerializer(serializers.Serializer):
    product_schema = serializers.JSONField()
