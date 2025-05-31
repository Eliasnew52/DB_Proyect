from rest_framework import serializers
from ..models import TransactionStatus

class TransactionStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionStatus
        fields = '__all__'