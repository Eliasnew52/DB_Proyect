from rest_framework import serializers
from backend.models import Brand
from .shorts import UserShortSerializer
class BrandWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'
        read_only_fields = ['creation_date', 'created_by', 'last_updated']

class BrandReadSerializer(serializers.ModelSerializer):
    created_by = UserShortSerializer(read_only=True)
    
    class Meta:
        model = Brand
        fields = '__all__'
        read_only_fields = ['creation_date', 'created_by', 'last_updated']