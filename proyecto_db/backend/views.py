from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.generics import  GenericAPIView
from rest_framework import status
from rest_framework.response import Response
from .models import Category, Product, Customer, Purchase, PurchaseDetail, Company, Brand, Discount, PaymentMethod, Supplier, Sale, TransactionStatus, SaleDetail
from .serializers.category import CategoryWriteSerializer, CategoryReadSerializer, CategorySchemaReadSerializer
from .serializers.product import ProductWriteSerializer, ProductReadSerializer
from .serializers.brand import BrandWriteSerializer, BrandReadSerializer
from .serializers.supplier import SupplierReadSerializer, SupplierWriteSerializer
from .serializers.customer import CustomerSerializer
from .serializers.discount import DiscountReadSerializer, DiscountWriteSerializer
from .serializers.payments_methods import PaymentMethodSerializer
from .serializers.company import CompanySerializer
from .serializers.sale import SaleReadSerializer, SaleWriteSerializer
from .serializers.purchase import PurchaseReadSerializer, PurchaseWriteSerializer
from .serializers.purchase_detail import PurchaseDetailWriteSerializer
from .serializers.transaction_status import TransactionStatusSerializer
from .serializers.discount import DiscountSerializer
from .serializers.discount_type import DiscountTypeSerializer
from .serializers.product_sale_insights import ProductSalesInsightsInputSerializer
from .models import TransactionStatus, Discount, DiscountType
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .pagination import StandardResultsSetPagination
from django.db.models import Sum, F
from django.db.models.functions import TruncHour, TruncDay, TruncWeek, TruncMonth, TruncYear
from django.utils.dateparse import parse_date
from datetime import datetime, timedelta
from django.utils import timezone

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
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = StandardResultsSetPagination

    filterset_fields = {
        'name': ['icontains'],
        'category': ['exact'],
        'stock': ['gte', 'lte'],
        'sale_price': ['gte', 'lte']
    }

    def filter_queryset(self, queryset):
        search_term = self.request.query_params.get('search')
        if search_term:
            queryset = queryset.filter(name__icontains=search_term)
        return super().filter_queryset(queryset)

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProductWriteSerializer
        return ProductReadSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class ProductSalesInsightsView(GenericAPIView):
    serializer_class = ProductSalesInsightsInputSerializer

    def get_group_by(self, period):
        return {
            'd': TruncHour('sale__date'),
            'w': TruncDay('sale__date'),
            'm': TruncWeek('sale__date'),
            'y': TruncMonth('sale__date'),
            'custom_hours': TruncHour('sale__date'),
            'custom_days': TruncDay('sale__date'),
            'custom_weeks': TruncWeek('sale__date'),
            'custom_months': TruncMonth('sale__date'),
            'custom_years': TruncYear('sale__date'),
            'custom_date': TruncDay('sale__date'),
        }.get(period, TruncDay('sale__date'))

    def get_range(self, period, amount, from_date, to_date):
        now = timezone.now()
        if period == 'custom_date' and from_date and to_date:
            return from_date, to_date

        if from_date:
            start = timezone.make_aware(datetime.combine(from_date, datetime.min.time()))
        else:
            start = now

        amount = amount or 1
        delta = {
            'custom_hours': timedelta(hours=amount),
            'custom_days': timedelta(days=amount),
            'custom_weeks': timedelta(weeks=amount),
            'custom_months': timedelta(days=30 * amount),
            'custom_years': timedelta(days=365 * amount),
        }.get(period, timedelta(days=7))

        end = start + delta
        return start, end

    def post(self, request):
        data = request.data
        product_id = data.get('product_id')
        period = data.get('period')
        amount = data.get('amount')
        from_date = parse_date(data.get('from_date')) if data.get('from_date') else None
        to_date = parse_date(data.get('to_date')) if data.get('to_date') else None

        if not product_id or not period:
            return Response({"error": "product_id y period son requeridos"}, status=status.HTTP_400_BAD_REQUEST)

        group_by = self.get_group_by(period)
        start_date, end_date = self.get_range(period, amount, from_date, to_date)

        queryset = SaleDetail.objects.filter(
            product_id=product_id,
            sale__date__range=(start_date, end_date)
        ).annotate(
            period=group_by
        ).values('period').annotate(
            units_sold=Sum('quantity'),
            total_income=Sum(F('quantity') * F('unit_price'))
        ).order_by('period')

        total_units = sum(item['units_sold'] for item in queryset)
        total_income = sum(item['total_income'] for item in queryset)
        num_periods = len(queryset)
        avg_income = total_income / num_periods if num_periods else 0

        return Response({
            "total_units": total_units,
            "total_income": float(total_income),
            "average_income": round(float(avg_income), 2),
            "trend": queryset
        })

class PurchaseViewSet(viewsets.ModelViewSet):
    """
    list, retrieve  -> PurchaseReadSerializer
    create, update  -> PurchaseWriteSerializer
    """
    queryset = (
        Purchase.objects
        .all()
        .select_related('supplier', 'status')
        .prefetch_related('purchasedetail_set')
    )

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return PurchaseReadSerializer
        return PurchaseWriteSerializer

class PurchaseDetailViewSet(viewsets.ModelViewSet):
    """
    CRUD sobre PurchaseDetail individual.
    """
    queryset = PurchaseDetail.objects.all().select_related('purchase', 'product')
    serializer_class = PurchaseDetailWriteSerializer

class SaleViewSet(viewsets.ModelViewSet):
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
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer

class DiscountTypeViewSet(viewsets.ModelViewSet):
    queryset = DiscountType.objects.all()
    serializer_class = DiscountTypeSerializer

class PaymentMethodViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
    filterset_fields = ['active', 'name']
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    filterset_fields = ['name', 'created_by']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.active = False
        instance.save(update_fields=['active'])
        serializer = self.get_serializer(instance)
        return Response(
            {
                'message': 'Marca desactivada correctamente.',
                'data': serializer.data
            },
            status=status.HTTP_200_OK
        )
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return BrandWriteSerializer
        return BrandReadSerializer
    
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

class TransactionStatusViewSet(viewsets.ModelViewSet):
    queryset = TransactionStatus.objects.all()
    serializer_class = TransactionStatusSerializer
