import uuid
from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from backend.models import (
    Purchase, PurchaseDetail, PurchaseInvoice,
    Supplier, Product, TransactionStatus
)
from django.core.exceptions import ObjectDoesNotExist

class PurchaseDetailWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = PurchaseDetail
        fields = ['product', 'quantity']

    def validate(self, data):

        try:
            product = Product.objects.get(pk=data['product'].id)
        except ObjectDoesNotExist:
            raise serializers.ValidationError("Producto no encontrado")

        if not product.active:
            raise ValidationError("No se puede comprar un producto inactivo")
        return data