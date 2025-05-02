from rest_framework import serializers
from backend.models import Brand

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'
        read_only_fields = ['creation_date', 'created_by', 'last_updated']
