from backend.models import Product, ProductMeasurement 
from rest_framework import serializers

class ProductMeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductMeasurement
        fields = [
            'length', 'length_unit',
            'width', 'height',
            'weight', 'weight_unit',
            'volume', 'volume_unit',
        ]