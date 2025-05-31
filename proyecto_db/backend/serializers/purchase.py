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
from typing import Dict, Any, List, Optional
from drf_spectacular.utils import extend_schema_field

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
    details = PurchaseDetailWriteSerializer(many=True, write_only=True)

    class Meta:
        model = Purchase
        fields = ['supplier', 'status', 'notes', 'invoice_number', 'payment_method', 'details', 'invoice_image']
        read_only_fields = ['invoice_number']

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        user = self.context['request'].user

        total = Decimal('0')
        with transaction.atomic():
            purchase = Purchase.objects.create(
                created_by=user,
                invoice_number=uuid.uuid4().hex[:20].upper(),
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
    supplier = serializers.SerializerMethodField()
    status   = serializers.SerializerMethodField()
    details  = serializers.SerializerMethodField()
    invoice  = serializers.SerializerMethodField()

    class Meta:
        model  = Purchase
        fields = ['id', 'date', 'supplier', 'status', 'details', 'invoice', 'total']

    @extend_schema_field(
        {
            'type': 'object',
            'properties': {
                'id':   {'type': 'integer'},
                'name': {'type': 'string'},
            }
        }
    )
    def get_supplier(self, obj) -> Dict[str, Any]:
        return {
            'id':   obj.supplier.id,
            'name': obj.supplier.name
        }

    @extend_schema_field(
        {
            'type': 'object',
            'properties': {
                'code':  {'type': 'string'},
                'label': {'type': 'string'},
            }
        }
    )
    def get_status(self, obj) -> Dict[str, Any]:
        return {
            'code':  obj.status.code,
            'label': obj.status.label
        }

    @extend_schema_field(
        {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'product': {
                        'type': 'object',
                        'properties': {
                            'id':   {'type': 'integer'},
                            'name': {'type': 'string'},
                        }
                    },
                    'quantity':   {'type': 'integer'},
                    'unit_price': {'type': 'number'},
                    'line_total': {'type': 'number'},
                }
            }
        }
    )
    def get_details(self, obj) -> List[Dict[str, Any]]:
        return [
            {
                'product': {
                    'id':   d.product.id,
                    'name': d.product.name
                },
                'quantity':   d.quantity,
                'unit_price': d.unit_price,
                'line_total': d.quantity * d.unit_price
            }
            for d in obj.purchasedetail_set.all()
        ]

    @extend_schema_field(
        {
            'oneOf': [
                {'type': 'null'},
                {
                    'type': 'object',
                    'properties': {
                        'invoice_number': {'type': 'string'},
                        'issue_date':     {'type': 'string', 'format': 'date-time'},
                        'due_date':       {'type': 'string', 'format': 'date'},
                        'subtotal':       {'type': 'number'},
                        'discount':       {'type': 'number'},
                        'total_amount':   {'type': 'number'},
                    }
                }
            ]
        }
    )
    def get_invoice(self, obj) -> Optional[Dict[str, Any]]:
        inv = getattr(obj, 'invoice', None)
        if not inv:
            return None
        return {
            'invoice_number': inv.invoice_number,
            'issue_date':     inv.issue_date,
            'due_date':       inv.due_date,
            'subtotal':       inv.subtotal,
            'discount':       inv.discount,
            'total_amount':   inv.total_amount
        }
