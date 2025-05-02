from rest_framework import serializers
from backend.models import PaymentMethod
from djoser.serializers import UserSerializer

class PaymentMethodSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_name_display', read_only=True)
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = PaymentMethod
        fields = ['id', 'name', 'type_display', 'description', 'active', 'created_by', 'last_updated']
        read_only_fields = ['created_by', 'last_updated']
