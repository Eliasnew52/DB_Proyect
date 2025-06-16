from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.generics import  GenericAPIView, ListAPIView, RetrieveAPIView
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
from .serializers.stock_movement import StockMovementSerializer
from .serializers.product_history import ProductHistorySerializer
from .serializers.product_measurement_history import ProductMeasurementHistorySerializer
from .models import TransactionStatus, Discount, DiscountType, StockMovement, SaleDetail, ProductMeasurement
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .pagination import StandardResultsSetPagination
from django.db.models import Sum, F
from django.db.models.functions import TruncHour, TruncDay, TruncWeek, TruncMonth, TruncYear
from django.utils.dateparse import parse_date
from datetime import datetime, timedelta
from django.utils import timezone
from decimal import Decimal
from itertools import chain
from operator import attrgetter
from simple_history.utils import update_change_reason

HistoricalProduct = Product.history.model
HistoricalPM = ProductMeasurement.history.model

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
    queryset = Product.objects.select_related('category', 'brand').order_by('name', 'creation_date')
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

def generate_periods(start, end, period):
    periods = []
    current = start

    increments = {
        'd': lambda dt: (dt.replace(minute=0, second=0, microsecond=0), timedelta(hours=1)),
        'w': lambda dt: (dt.replace(hour=0, minute=0, second=0, microsecond=0), timedelta(days=1)),
        'm': lambda dt: (
            (dt - timedelta(days=dt.weekday())).replace(hour=0, minute=0, second=0, microsecond=0), timedelta(weeks=1)
        ),
        'y': lambda dt: (dt.replace(day=1, hour=0, minute=0, second=0, microsecond=0), 'month'),
    }
    normalize_func = increments.get(period, increments['w'])

    if period == 'y':
        current, _ = normalize_func(current)
        while current <= end:
            periods.append(current)
            if current.month == 12:
                current = current.replace(year=current.year + 1, month=1)
            else:
                current = current.replace(month=current.month + 1)
    else:
        current, delta = normalize_func(current)
        while current <= end:
            periods.append(current)
            current += delta

    return periods

class ProductSalesInsightsView(GenericAPIView):
    serializer_class = ProductSalesInsightsInputSerializer

    def get_group_by(self, period):
        return {
            'd': TruncHour('sale__creation_date'),
            'w': TruncDay('sale__creation_date'),
            'm': TruncWeek('sale__creation_date'),
            'y': TruncMonth('sale__creation_date'),
            'custom_creation_date': TruncDay('sale__creation_date'),
        }.get(period, TruncDay('sale__creation_date'))

    def get_range(self, period, amount, from_date, to_date):
        now = timezone.now()
        if period == 'custom_date' and from_date and to_date:
            start = timezone.make_aware(datetime.combine(from_date, datetime.min.time()))
            end = timezone.make_aware(datetime.combine(to_date, datetime.max.time()))
            return start, end

        if period == 'd':
            today = now.date()
            start = timezone.make_aware(datetime.combine(today, datetime.min.time()))
            end = timezone.make_aware(datetime.combine(today, datetime.max.time()))
            return start, end

        if period == 'w':
            start = now - timedelta(days=6)
            end = now
            return start, end

        if period == 'm':
            start = now - timedelta(days=29)
            end = now
            return start, end

        if period == 'y':
            start = now - timedelta(days=364)
            end = now
            return start, end

        start = now - timedelta(days=6)
        end = now
        return start, end

    def post(self, request):
        data = request.data
        product_id = data.get('product_id')
        period = data.get('period')
        amount = data.get('amount')
        from_date = parse_date(data.get('from_date')) if data.get('from_date') else None
        to_date = parse_date(data.get('to_date')) if data.get('to_date') else None
        group_by = data.get('group_by')

        if period == 'custom_date':
            if group_by not in ['day', 'week', 'month']:
                return Response(
                    {"error": "Solo se permite agrupar por día, semana o mes en periodo personalizado."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            period_map = {'day': 'w', 'week': 'm', 'month': 'y'}
            period = 'custom_date'
            internal_period = period_map[group_by]
        else:
            internal_period = period

        group_by_func = self.get_group_by(internal_period)
        start_date, end_date = self.get_range(period, amount, from_date, to_date)

        queryset = SaleDetail.objects.filter(
            product_id=product_id,
            sale__creation_date__range=(start_date, end_date)
        ).annotate(
            period=group_by_func
        ).values('period').annotate(
            units_sold=Sum('quantity'),
            total_income=Sum(F('quantity') * F('unit_price'))
        ).order_by('period')

        all_periods = generate_periods(start_date, end_date, internal_period)

        sales_by_periods = {item['period'].replace(hour=0, minute=0, second=0, microsecond=0): item for item in queryset}

        trend = []
        for p in all_periods:
            ventas = sales_by_periods.get(p)
            trend.append({
                "period": p.isoformat(),
                "units_sold": ventas['units_sold'] if ventas else 0,
                "total_income": float(ventas['total_income']) if ventas else 0,
            })

        # trend = [item for item in queryset if item['units_sold'] > 0]


        total_units = sum(item['units_sold'] for item in trend)
        total_income = sum(item['total_income'] for item in trend)
        num_days = (end_date.date() - start_date.date()).days + 1
        average_income = total_income / num_days if num_days else 0
        avg_units = total_units / len(trend) if trend else 0
        zero_days = sum(1 for item in trend if item['units_sold'] == 0)
        max_point = max(trend, key=lambda x: x['total_income'], default=None)
        
        sales_days = sum(1 for item in trend if item['units_sold'] > 0)
        average_income_sales_days = total_income / sales_days if sales_days > 0 else 0

        max_sale = (
            SaleDetail.objects
            .filter(product_id=product_id, sale__creation_date__range=(start_date, end_date))
            .annotate(total_income=F('quantity') * F('unit_price'))
            .order_by('-total_income', '-sale__creation_date')
            .values('sale__creation_date', 'quantity', 'unit_price', 'total_income')
            .first()
        )

        last_sale = (
            SaleDetail.objects
            .filter(product_id=product_id, sale__creation_date__range=(start_date, end_date))
            .order_by('-sale__creation_date')
            .values('sale__creation_date', 'quantity', 'unit_price')
            .first()
        )

        num_sales = (
            SaleDetail.objects
            .filter(product_id=product_id, sale__creation_date__range=(start_date, end_date))
            .values('sale_id')
            .distinct()
            .count()
        )

        average_ticket = total_income / num_sales if num_sales else 0

        last_sale_obj = (
            SaleDetail.objects
            .filter(product_id=product_id)
            .order_by('-sale__creation_date')
            .values('sale__creation_date')
            .first()
        )
        if last_sale_obj and last_sale_obj['sale__creation_date']:
            days_since_last_sale = (timezone.now().date() - last_sale_obj['sale__creation_date'].date()).days
        else:
            days_since_last_sale = None

        periods_with_sales = sum(1 for item in trend if item['units_sold'] > 0)
        percent_periods_with_sales = (periods_with_sales / len(trend) * 100) if trend else 0

        total_cost = SaleDetail.objects.filter(
            product_id=product_id,
            sale__creation_date__range=(start_date, end_date)
        ).aggregate(
            total_cost=Sum(F('quantity') * F('purchase_price'))
        )['total_cost'] or 0

        real_profit = Decimal(str(total_income)) - total_cost

        MAX_PERIODS = 30
        MIN_PERIODS = 1

        if len(all_periods) > MAX_PERIODS:
            return Response(
                {"error": f"El rango de fechas y agrupamiento seleccionado genera {len(all_periods)} puntos. Por favor, selecciona un rango más corto o un agrupamiento mayor (máximo {MAX_PERIODS} puntos)."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if len(all_periods) < MIN_PERIODS:
            return Response(
                {"error": f"El rango de fechas y agrupamiento seleccionado genera muy pocos puntos para mostrar una tendencia."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "total_units": total_units,
            "total_income": float(total_income),
            "real_profit": round(float(real_profit), 2),
            "ticket_average": round(float(average_ticket), 2),
            "num_sales": num_sales,
            "days_since_last_sale": days_since_last_sale,
            "percent_periods_with_sales": round(percent_periods_with_sales, 2),
            "zero_sales_periods": zero_days,
            "max_sales_period": max_point,
            "max_sale": {
                "date": max_sale['sale__creation_date'] if max_sale else None,
                "units_sold": max_sale['quantity'] if max_sale else 0,
                "total_income": float(max_sale['total_income']) if max_sale else 0
            },
            "last_sale": {
                "date": last_sale['sale__creation_date'] if last_sale else None,
                "units_sold": last_sale['quantity'] if last_sale else 0,
                "total_income": float(last_sale['unit_price']) * last_sale['quantity'] if last_sale else 0
            },
            "trend": trend,
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
    queryset = Sale.objects.select_related('created_by', 'customer', 'payment_method').prefetch_related('products', 'saledetail_set').order_by('-creation_date')
    filterset_fields = {
        'status': ['exact'],
        'customer': ['exact'],
        'creation_date': ['gte', 'lte', 'exact'],
        'payment_method': ['exact']
    }
    
    search_fields = ['customer__name', 'payment_method__name']
    ordering_fields = ['creation_date', 'total']

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

class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.select_related('product', 'created_by').order_by('-creation_date')
    filterset_fields = ['product', 'movement_type', 'created_by', 'creation_date']
    serializer_class = StockMovementSerializer
    pagination_class = StandardResultsSetPagination

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class StockMovementByProductView(ListAPIView):
    queryset = StockMovement.objects.all().order_by('-creation_date')
    serializer_class = StockMovementSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return StockMovement.objects.filter(
            product_id=self.kwargs['product_id']
        ).order_by('-creation_date')
    
class ProductHistoryListView(ListAPIView):
    queryset = StockMovement.objects.all().order_by('-creation_date')
    serializer_class = ProductHistorySerializer
    pagination_class = StandardResultsSetPagination

    
    def get_queryset(self):
        product_pk = self.kwargs['pk']
        return Product.history.filter(id=product_pk).order_by('-history_date')
    
    def list(self, request, *args, **kwargs):
        pk = self.kwargs['pk']

        prod_qs = Product.history.filter(id=pk).order_by('-history_date')
        page     = self.paginate_queryset(prod_qs)

        try:
            pm     = ProductMeasurement.objects.get(product_id=pk)
            meas_qs = pm.history.all().order_by('-history_date')
        except ProductMeasurement.DoesNotExist:
            meas_qs = []
        
        merged = sorted(
            chain(prod_qs, meas_qs),
            key=attrgetter('history_date'),
            reverse=True
        )

        data = []
        for entry in merged:
            if isinstance(entry, HistoricalProduct):
                data.append(ProductHistorySerializer(entry).data)
            else:
                data.append(ProductMeasurementHistorySerializer(entry).data)

        page = self.paginate_queryset(data)
        if page is not None:
            return self.get_paginated_response(page)

        return Response(data)
    
class ProductHistoryDetailView(RetrieveAPIView):
    serializer_class = ProductHistorySerializer
    pagination_class = StandardResultsSetPagination

    lookup_field = 'history_id'

    def get_queryset(self):
        return Product.history.filter(id=self.kwargs['pk'])