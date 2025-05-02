from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from backend.models import SaleDetail, Discount, Product
from backend.utils.enums import DiscountTypeEnum, ScopeTypeEnum 

class SaleDetailWriteSerializer(serializers.ModelSerializer):
    discount_id = serializers.PrimaryKeyRelatedField(
        queryset=Discount.objects.filter(active=True),
        source='discount',
        required=False,
        allow_null=True,
        write_only=True,
        help_text="ID de descuento existente (opcional)"
    )
    discount_type = serializers.ChoiceField(
        choices=DiscountTypeEnum.choices,
        required=False,
        write_only=True,
        help_text="'percentage' o 'fixed_amount' (requerido si no se usa discount_id)"
    )
    discount_value = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=False,
        min_value=0,
        write_only=True,
        help_text="Valor del descuento (requerido si no se usa discount_id)"
    )

    class Meta:
        model = SaleDetail
        fields = ['product', 'quantity', 'discount_id', 'discount_type', 'discount_value']

    def validate(self, data):
        try:
            product = Product.objects.get(pk=data['product'].id)
            
            if not product.active:
                raise serializers.ValidationError("Este producto está desactivado")
                
            if product.stock < data.get('quantity', 0):
                raise serializers.ValidationError("Stock insuficiente")
                
        except ObjectDoesNotExist:
            raise serializers.ValidationError("Producto no encontrado")

        if data['quantity'] <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a 0")


        discount_id = data.get('discount')
        discount_type = data.get('discount_type')
        discount_value = data.get('discount_value')
        product = data.get('product')

        if discount_id and (discount_type or discount_value):
            raise serializers.ValidationError(
                "Use solo descuento existente o valores ad-hoc, no ambos."
            )

        # if not discount_id and not (discount_type or discount_value):
        #     raise serializers.ValidationError(
        #         "Se requieren tipo y valor de descuento para descuentos ad-hoc."
        #     )

        if discount_type == DiscountTypeEnum.PERCENTAGE and discount_value > 100:
            raise serializers.ValidationError(
                "El descuento porcentual no puede exceder el 100%."
            )

        if discount_type == DiscountTypeEnum.FIXED_AMOUNT:
            max_discount = product.sale_price * data['quantity']
            if discount_value > max_discount:
                raise serializers.ValidationError(
                    f"El descuento fijo no puede exceder ${max_discount} para esta cantidad."
                )

        return data