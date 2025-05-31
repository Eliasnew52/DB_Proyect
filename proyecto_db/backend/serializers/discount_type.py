from rest_framework import serializers
from ..models import DiscountType

class DiscountTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscountType
        fields = '__all__'