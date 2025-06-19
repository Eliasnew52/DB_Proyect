from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'brands', views.BrandViewSet, basename='brand')
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'customers', views.CustomerViewSet, basename='customer')
router.register(r'discounts', views.DiscountViewSet, basename='discount')
router.register(r'discount-types', views.DiscountTypeViewSet, basename='discount-type')
router.register(r'suppliers', views.SupplierViewSet, basename='supplier')
router.register(r'companies', views.CompanyViewSet, basename='company')
router.register(r'payment_methods', views.PaymentMethodViewSet, basename='payment-method')
router.register(r'sales', views.SaleViewSet, basename='sale')
router.register(r'purchases', views.PurchaseViewSet, basename='purchase')
router.register(r'purchase-details', views.PurchaseDetailViewSet, basename='purchase-detail')
router.register(r'transaction-status', views.TransactionStatusViewSet, basename='transaction-status')
router.register(r'stock-movements', views.StockMovementViewSet, basename='stock-movement')

urlpatterns = [
    path('api/category-schema/<int:category_id>/', views.CategorySchemaView.as_view(), name='get_category_schema'),
    path('api/products/sales-insights/', views.ProductSalesInsightsView.as_view(), name='product_sales_insights'),
    path('api/stock-movements/product/<int:product_id>/', views.StockMovementByProductView.as_view(), name='stock-movements-by-product'),
    path('api/products/<int:pk>/history/',views.ProductHistoryListView.as_view(), name='product-history-list'),
    path('api/products/<int:pk>/history/<int:history_id>/', views.ProductHistoryDetailView.as_view(), name='product-history-detail'),
    path('api/reports/products-sales-summary/', views.ProductSalesSummaryView.as_view(), name='product_sales_summary'),

    path('api/', include(router.urls)),
    
]