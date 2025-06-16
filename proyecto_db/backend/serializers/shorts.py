from rest_framework import serializers
from backend.models import Category, Brand, Supplier, Product, User, Company, StockMovement, Sale, TransactionStatus

class CompanyShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name']
class CategoryShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image']

class BrandShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'description', 'image']

class SupplierShortSerializer(serializers.ModelSerializer):
    company = CompanyShortSerializer(read_only=True)
    class Meta:
        model = Supplier
        fields = ['id', 'name', 'email', 'phone', 'company']

class ProductShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'sale_price', 'purchase_price', 'stock']

class UserShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']
    
class TransactionStatusShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionStatus
        fields = ['id', 'code', 'label']   
class StockMovementShortSerializer(serializers.ModelSerializer):
    product = ProductShortSerializer(read_only=True)
    created_by = UserShortSerializer(read_only=True)
    movement_type = serializers.CharField(source='get_movement_type_display', read_only=True)
    class Meta:
        model = StockMovement
        fields = ['id', 'product', 'quantity', 'movement_type', 'created_by', 'creation_date']


