import uuid
from rest_framework import serializers
from django.db import transaction
from backend.models import Sale, SaleDetail, StockMovement, SaleInvoice, Discount, Product
from .sale_detail import SaleDetailWriteSerializer
from .payments_methods import PaymentMethodSerializer
from .customer import CustomerSerializer
from backend.utils.enums import DiscountTypeEnum, ScopeTypeEnum 
from django.utils import timezone
from django.core.exceptions import ValidationError

"""
{
  "customer": 2,
  "payment_method": 1,
  "status": "PENDING",
  "details": [
    { "product": 5, "quantity": 2 },
    { "product": 7, "quantity": 1, "unit_price": "18.50", "discount": 3 }
  ]
}

"""

class SaleWriteSerializer(serializers.ModelSerializer):
    details = SaleDetailWriteSerializer(many=True, write_only=True)

    class Meta:
        model = Sale
        fields = ['customer', 'payment_method', 'status', 'details']

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        user = self.context['request'].user

        with transaction.atomic():
            sale = Sale.objects.create(created_by=user, **validated_data)
            subtotal = 0
            total_discount = 0

            product_ids = [item['product'].id for item in details_data]
            products = {
                p.id: p for p in 
                Product.objects.filter(id__in=product_ids)
                .select_for_update()
                .select_related('category')
            }

            for item in details_data:
                product = products[item['product'].id]
                qty = item['quantity']
                unit_price = product.sale_price
                line_total = qty * unit_price

                discount_data = self._process_discount(item, product, line_total)
                SaleDetail.objects.create(
                    sale=sale,
                    product=product,
                    quantity=qty,
                    unit_price=unit_price,
                    discount_name=discount_data['discount_name'],
                    discount_type=discount_data['discount_type'],
                    discount_value=discount_data['discount_value'],
                    created_by=user
                )
                subtotal += line_total
                total_discount += discount_data['line_total']

            print(discount_data)
            sale.subtotal = subtotal
            sale.total_discount = total_discount
            sale.total = subtotal - total_discount
            sale.save()

            self._create_invoice(sale, user, subtotal, total_discount)
        
        return sale
    
    def _process_discount(self, item, product, line_total):
        """Centraliza la lógica de descuentos"""
        discount = item.get('discount')
        discount_type = item.get('discount_type')
        discount_value = item.get('discount_value')

        result = {
            'discount_type': None,
            'discount_value': None,
            'discount_name': None,
            'line_total': line_total
        }

        if discount:
            if not discount.apply_to_product(product):
                raise serializers.ValidationError(
                    f"El descuento {discount.name} no aplica a {product.name}"
                )
            result.update({
                'discount_type': discount.type,
                'discount_value': discount.value,
                'discount_name': discount.name,
                'line_total': discount.calculate_discount(line_total)
            })

        elif discount_type and discount_value:
            result.update({
                'discount_type': discount_type,
                'discount_value': discount_value,
                'discount_name': "Descuento manual",
                'line_total': self._calculate_manual_discount(
                    discount_type, 
                    discount_value, 
                    line_total
                )
            })

        return result

    def _calculate_manual_discount(self, discount_type, value, line_total):
        """Calcula descuentos manuales con validación"""
        if discount_type == DiscountTypeEnum.PERCENTAGE:
            if value > 100:
                raise serializers.ValidationError(
                    "El descuento porcentual no puede exceder el 100%"
                )
            return line_total * (value / 100)
        else:
            return max(value, 0)

    def _create_invoice(self, sale, user, subtotal, total_discount):
        print(sale)
        """Crea factura de forma separada"""
        try:
            SaleInvoice.objects.create(
                sale=sale,
                invoice_number=uuid.uuid4().hex[:20].upper(),  # Formato más legible
                due_date=timezone.now() + timezone.timedelta(days=30),
                subtotal=subtotal,
                discount=total_discount,
                total_amount=sale.total,
                created_by=user
            )
        except ValidationError as e:
            raise serializers.ValidationError(f"Error al crear factura: {e}")

class SaleReadSerializer(serializers.ModelSerializer):
    payment_method = PaymentMethodSerializer(read_only=True)
    customer = CustomerSerializer(read_only=True)

    class Meta:
        model = Sale
        fields = ['date', 'total', 'payment_method', 'status', 'customer', 'products', 'created_by']
