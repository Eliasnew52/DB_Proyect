from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from backend.models import SaleDetail, Discount, Product, DiscountType
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
    discount_type  = serializers.SlugRelatedField(
        slug_field='code',
        queryset=DiscountType.objects.all(),
        required=False,
        allow_null=True
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
        except ObjectDoesNotExist:
            raise serializers.ValidationError("Producto no encontrado")

        if not product.active:
            raise serializers.ValidationError("Este producto está desactivado")
        if product.stock < data.get('quantity', 0):
            raise serializers.ValidationError("Stock insuficiente")
        if data['quantity'] <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a 0")

        has_existing = data.get('discount') is not None
        has_manual   = data.get('discount_type') or data.get('discount_value') is not None

        if has_existing and has_manual:
            raise serializers.ValidationError(
                "Use solo discount_id o bien discount_type + discount_value, no ambos."
            )

        discount_type = data.get('discount_type')
        val  = data.get('discount_value')
        if discount_type:
            if val is None:
                raise serializers.ValidationError("Debe indicar discount_value para un descuento manual")
            try:
                dt = DiscountType.objects.get(code=discount_type.code)
            except DiscountType.DoesNotExist:
                raise serializers.ValidationError(f"Tipo de descuento «{discount_type.code}» inválido")

            if dt.code == 'PERCENT' and val > 100:
                raise serializers.ValidationError("El porcentaje no puede exceder 100%")
            if dt.code == 'FIXED':
                max_desc = product.sale_price * data['quantity']
                if val > max_desc:
                    raise serializers.ValidationError(
                        f"El monto fijo no puede exceder ${max_desc} para esta cantidad"
                    )
            data['discount_type'] = dt.id

        return data