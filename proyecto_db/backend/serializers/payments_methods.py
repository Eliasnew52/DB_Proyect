from rest_framework import serializers
from backend.models import PaymentMethod
from dj_rest_auth.serializers import UserDetailsSerializer

class PaymentMethodSerializer(serializers.ModelSerializer):
    created_by = UserDetailsSerializer(read_only=True)
    
    class Meta:
        model = PaymentMethod
        fields = ['name', 'code', 'description', 'active', 'created_by', 'last_updated']
        read_only_fields = ['created_by', 'last_updated']
