from rest_framework import serializers
from backend.models import PaymentMethod
from djoser.serializers import UserSerializer

class PaymentMethodSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = PaymentMethod
        fields = ['name', 'code', 'description', 'active', 'created_by', 'last_updated']
        read_only_fields = ['created_by', 'last_updated']
