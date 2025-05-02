from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.generics import  GenericAPIView
from rest_framework import status
from rest_framework.response import Response
from .models import Category, Product, Customer, Company, Brand, Discount, PaymentMethod, Supplier, Sale
from .serializers.category import CategoryWriteSerializer, CategoryReadSerializer, CategorySchemaReadSerializer
from .serializers.product import ProductWriteSerializer, ProductReadSerializer
from .serializers.brand import BrandSerializer
from .serializers.supplier import SupplierReadSerializer, SupplierWriteSerializer
from .serializers.customer import CustomerSerializer
from .serializers.discount import DiscountReadSerializer, DiscountWriteSerializer
from .serializers.payments_methods import PaymentMethodSerializer
from .serializers.company import CompanySerializer
from .serializers.sale import SaleReadSerializer, SaleWriteSerializer

class CategorySchemaView(GenericAPIView):
    serializer_class = CategorySchemaReadSerializer
    def get(self, request, category_id):
        try:
            category = Category.objects.get(pk=category_id)
            return Response(category.product_schema)
        except Category.DoesNotExist:
            return Response({'error': 'Categoría no encontrada'}, status=status.HTTP_404_NOT_FOUND)
    
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    filterset_fields = ['name', 'created_by']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CategoryWriteSerializer
        return CategoryReadSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category', 'brand')
    filterset_fields = {
        'name': ['icontains'],
        'category': ['exact'],
        'stock': ['gte', 'lte'],
        'sale_price': ['gte', 'lte']
    }

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProductWriteSerializer
        return ProductReadSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class SaleViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    queryset = Sale.objects.select_related('created_by', 'customer', 'payment_method').prefetch_related('products', 'saledetail_set').order_by('-date')
    filterset_fields = {
        'status': ['exact'],
        'customer': ['exact'],
        'date': ['gte', 'lte', 'exact'],
        'payment_method': ['exact']
    }
    
    search_fields = ['customer__name', 'payment_method__name']
    ordering_fields = ['date', 'total']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return SaleWriteSerializer
        return SaleReadSerializer
    
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    filterset_fields = ['name', 'email', 'phone']
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class DiscountViewSet(viewsets.ModelViewSet):
    queryset = Discount.objects.prefetch_related('products', 'categories')
    filterset_fields = ['active', 'type', 'scope']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return DiscountWriteSerializer
        return DiscountReadSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class PaymentMethodViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
    filterset_fields = ['active', 'name']
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    filterset_fields = ['name', 'created_by']
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.select_related('company', 'created_by').prefetch_related('brands')
    filterset_fields = ['name', 'created_by', 'email', 'phone']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return SupplierWriteSerializer
        return SupplierReadSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.select_related('created_by')
    serializer_class = CompanySerializer
    filterset_fields = ['name']


class PaymentMethodViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.select_related('created_by')
    filterset_fields = ['name']
    serializer_class = PaymentMethodSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
