from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'brands', views.BrandViewSet)
router.register(r'customers', views.CustomerViewSet)
router.register(r'discounts', views.DiscountViewSet)
router.register(r'suppliers', views.SupplierViewSet)
router.register(r'companies', views.CompanyViewSet)
router.register(r'payment_methods', views.PaymentMethodViewSet)
router.register(r'sales', views.SaleViewSet)

urlpatterns = [
    path('api/category-schema/<int:category_id>/', views.CategorySchemaView.as_view(), name='get_category_schema'),

    path('api/', include(router.urls)),

]