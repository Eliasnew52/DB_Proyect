from rest_framework import serializers
from backend.models import Product, Category, Discount
from .shorts import ProductShortSerializer, CategoryShortSerializer
from backend.utils.enums import DiscountTypeEnum, ScopeTypeEnum 


class DiscountWriteSerializer(serializers.ModelSerializer):
    product_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Product.objects.all(), source='products', required=False
    )
    category_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Category.objects.all(), source='categories', required=False
    )

    class Meta:
        model = Discount
        fields = '__all__'
        read_only_fields = ['created_by', 'last_updated']

    def validate(self, data):
        scope = data.get('scope', self.instance.scope if self.instance else None)

        if scope == ScopeTypeEnum.SELECTED_PRODUCTS and not data.get('products'):
            raise serializers.ValidationError("Debe seleccionar al menos un producto para este alcance")
        if scope == ScopeTypeEnum.SELECTED_CATEGORIES and not data.get('categories'):
            raise serializers.ValidationError("Debe seleccionar al menos una categoría para este alcance")

        return data

class DiscountReadSerializer(serializers.ModelSerializer):
    products = ProductShortSerializer(many=True, read_only=True)
    categories = CategoryShortSerializer(many=True, read_only=True)
    
    class Meta:
        model = Discount
        fields = '__all__'
    