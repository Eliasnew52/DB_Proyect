from backend.models import (
    Purchase, PurchaseDetail, PurchaseInvoice,
    Supplier, Product, TransactionStatus, PaymentMethod
)
from rest_framework import serializers
from django.db import transaction
from decimal import Decimal
import uuid
from django.utils import timezone
from .purchase_detail import PurchaseDetailWriteSerializer
from .supplier import SupplierReadSerializer
from .transaction_status import TransactionStatusSerializer
from .payments_methods import PaymentMethodSerializer
from .purchase_detail import PurchaseDetailReadSerializer
from typing import Dict, Any, List, Optional
from drf_spectacular.utils import extend_schema_field
import json

class PurchaseInvoiceReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseInvoice
        fields = ['invoice_number', 'issue_date', 'due_date', 'subtotal', 'discount', 'total_amount']

class PurchaseWriteSerializer(serializers.ModelSerializer):
    """
    Serializer para crear una compra completa con sus detalles e invoice.
    """
    supplier = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all(),
        help_text="ID del proveedor"
    )
    status = serializers.SlugRelatedField(
        slug_field='code',
        queryset=TransactionStatus.objects.all(),
        help_text="Código de estado"
    )
    payment_method  = serializers.SlugRelatedField(
                         slug_field='code',
                         queryset=PaymentMethod.objects.all()
    )
    details = serializers.CharField(write_only=True)
    class Meta:
        model = Purchase
        fields = ['supplier', 'status', 'notes', 'invoice_number', 'payment_method', 'details', 'invoice_image']

    def validate(self, data):
        raw_details = data.pop('details', '[]')

        try:
            parsed_details = json.loads(raw_details)
        except json.JSONDecodeError:
            raise serializers.ValidationError({"details": "Formato inválido. Se esperaba un JSON válido."})

        detail_serializer = PurchaseDetailWriteSerializer(data=parsed_details, many=True)
        detail_serializer.is_valid(raise_exception=True)

        self._validated_details = detail_serializer.validated_data
        return data

    def create(self, validated_data):
        details_data = getattr(self, '_validated_details', [])

        user = self.context['request'].user

        total = Decimal('0')
        with transaction.atomic():
            purchase = Purchase.objects.create(
                created_by=user,
                **validated_data
            )

            product_ids = [item['product'].id for item in details_data]
            products = {
                p.id: p for p in Product.objects
                                .filter(id__in=product_ids)
                                .select_for_update()
            }

            for item in details_data:
                product = products[item['product'].id]
                qty = item['quantity']
                price = product.purchase_price
                line_total = qty * price

                PurchaseDetail.objects.create(
                    purchase=purchase,
                    product=product,
                    quantity=qty,
                    unit_price=price
                )
                total += line_total

            purchase.total = total
            purchase.save()
            self._create_invoice(purchase, user)

        return purchase
    
    def _create_invoice(self, purchase, user):
        from django.core.exceptions import ValidationError as DjangoValidationError
        try:

            PurchaseInvoice.objects.create(
                purchase=purchase,
                invoice_number=purchase.invoice_number,
                issue_date=timezone.now(),
                due_date=timezone.now() + timezone.timedelta(days=30),
                subtotal=purchase.total,
                discount=0,
                total_amount=purchase.total
            )
        except DjangoValidationError as e:
            raise serializers.ValidationError(
                f"Error al crear la factura: {str(e)}"
            )


class PurchaseReadSerializer(serializers.ModelSerializer):
    supplier = SupplierReadSerializer(read_only=True)
    status = TransactionStatusSerializer(read_only=True)
    payment_method = PaymentMethodSerializer(read_only=True)
    details = PurchaseDetailReadSerializer(source='purchasedetail_set', many=True, read_only=True)

    class Meta:
        model = Purchase
        fields = [
            'id', 'date', 'supplier', 'status', 'details', 'invoice',
            'total', 'payment_method', 'notes', 'invoice_image'
        ]