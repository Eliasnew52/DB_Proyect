from rest_framework import serializers
from jsonschema import validate
from jsonschema.exceptions import ValidationError as SchemaError

class SchemaValidatedJSONField(serializers.JSONField):
    def __init__(self, schema, **kwargs):
        super().__init__(**kwargs)
        self.schema = schema

    def to_internal_value(self, data):
        data = super().to_internal_value(data)
        try:
            validate(instance=data, schema=self.schema)
        except SchemaError as e:
            raise serializers.ValidationError(
                f"Error en esquema JSON: {e.message}"
            )
        return data