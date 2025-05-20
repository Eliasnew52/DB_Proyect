import uuid
from rest_framework import serializers
from django.db import transaction
from backend.models import Sale, SaleDetail, PaymentMethod, StockMovement, SaleInvoice, Discount, Product
from .sale_detail import SaleDetailWriteSerializer
from .payments_methods import PaymentMethodSerializer
from .customer import CustomerSerializer
from backend.utils.enums import DiscountTypeEnum, ScopeTypeEnum 
from django.utils import timezone
from django.core.exceptions import ValidationError

import uuid
from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
from backend.models import (
    Sale, SaleDetail, SaleInvoice,
    Product, PaymentMethod, Discount, DiscountType
)
from .sale_detail import SaleDetailWriteSerializer
from .customer import CustomerSerializer

class SaleWriteSerializer(serializers.ModelSerializer):
    payment_method = serializers.SlugRelatedField(
        slug_field='code',
        queryset=PaymentMethod.objects.all()
    )
    details = SaleDetailWriteSerializer(many=True, write_only=True)

    class Meta:
        model  = Sale
        fields = ['customer', 'payment_method', 'status', 'details']

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        user         = self.context['request'].user

        subtotal       = Decimal('0')
        total_discount = Decimal('0')

        with transaction.atomic():
            sale = Sale.objects.create(created_by=user, **validated_data)

            product_ids = [item['product'].id for item in details_data]
            products    = {
                p.id: p for p in Product.objects
                                 .filter(id__in=product_ids)
                                 .select_for_update()
                                 .select_related('category')
            }

            for item in details_data:
                product    = products[item['product'].id]
                qty        = item['quantity']
                unit_price = product.sale_price
                line_sub   = qty * unit_price

                discount_amount, disc_name, disc_type, disc_value = (
                    self._process_discount(item, product, line_sub)
                )

                SaleDetail.objects.create(
                    sale          = sale,
                    product       = product,
                    quantity      = qty,
                    unit_price    = unit_price,
                    discount_name = disc_name,
                    discount_type = disc_type,
                    discount_value= disc_value,
                    created_by    = user,
                )

                subtotal       += line_sub
                total_discount += discount_amount

            sale.subtotal = subtotal
            sale.total    = subtotal - total_discount
            sale.save()

            self._create_invoice(sale, user, subtotal, total_discount)

        return sale

    def _process_discount(self, item, product, line_sub):
        """
        Devuelve: (discount_amount, discount_name, discount_type_code, discount_value)
        """
        discount_obj = item.get('discount')
        if discount_obj:
            if not discount_obj.apply_to_product(product):
                raise serializers.ValidationError(
                    f"El descuento «{discount_obj.name}» no aplica a «{product.name}»"
                )
            amount = discount_obj.calculate_discount(line_sub)
            return (
                amount,
                discount_obj.name,
                discount_obj.type.id,
                discount_obj.value
            )

        manual_type  = item.get('discount_type')
        manual_value = item.get('discount_value')
        if manual_type and manual_value is not None:
            try:
                dt = DiscountType.objects.get(pk=manual_type)
            except DiscountType.DoesNotExist:
                raise serializers.ValidationError(f"Tipo de descuento «{manual_type}» inválido")

            if dt.code == 'PERCENT':
                if manual_value > 100:
                    raise serializers.ValidationError("El porcentaje no puede exceder 100%")
                amount = (line_sub * manual_value) / Decimal('100')
            else:
                amount = min(Decimal(manual_value), line_sub)

            return (
                amount,
                "Descuento manual",
                dt.id,
                Decimal(manual_value)
            )

        return (Decimal('0'), None, None, None)

    def _create_invoice(self, sale, user, subtotal, total_discount):
        from django.core.exceptions import ValidationError as DjangoValidationError

        try:
            SaleInvoice.objects.create(
                sale           = sale,
                invoice_number = uuid.uuid4().hex[:20].upper(),
                due_date       = timezone.now().date() + timezone.timedelta(days=30),
                subtotal       = subtotal,
                discount       = total_discount,
                total_amount   = sale.total,
                created_by     = user,
            )
        except DjangoValidationError as e:
            raise serializers.ValidationError(f"Error al crear factura: {e}")


class SaleReadSerializer(serializers.ModelSerializer):
    payment_method = PaymentMethodSerializer(read_only=True)
    customer = CustomerSerializer(read_only=True)

    class Meta:
        model = Sale
        fields = ['date', 'total', 'payment_method', 'status', 'customer', 'products', 'created_by']
