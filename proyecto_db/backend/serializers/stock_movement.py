from rest_framework import serializers
from backend.models import StockMovement
from .shorts import ProductShortSerializer, UserShortSerializer
from .movement_types import MovementTypeSerializer

class StockMovementSerializer(serializers.ModelSerializer):
    product = ProductShortSerializer(read_only=True)
    created_by = UserShortSerializer(read_only=True)
    movement_type = MovementTypeSerializer(read_only=True)    

    class Meta:
        model = StockMovement
        fields = ['id', 'product', 'reason', 'quantity', 'movement_type', 'created_by', 'creation_date', 'purchase', 'sale', 'purchase_return', 'sale_return']