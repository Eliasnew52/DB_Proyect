from rest_framework import serializers
from backend.models import Supplier
from .shorts import BrandShortSerializer, CompanyShortSerializer, UserShortSerializer

class SupplierWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'
        read_only_fields = ['creation_date', 'created_by', 'last_updated']

class SupplierReadSerializer(serializers.ModelSerializer):
    brands = BrandShortSerializer(many=True, read_only=True)
    company = CompanyShortSerializer(read_only=True)
    created_by = UserShortSerializer(read_only=True)
    class Meta:
        model = Supplier
        fields = ['id', 'name', 'email', 'phone', 'company', 'brands', 'created_by']