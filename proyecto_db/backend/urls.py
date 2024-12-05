from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth.decorators import login_required

urlpatterns = [
    path('products/add/', login_required(NewProduct), name='NewProduct'),
    path('products/buy/', login_required(BuyProduct), name='BuyProduct'),
    path('products/sell/', login_required(SellProduct), name='SellProduct'),
    path('products/inventory/', login_required(Inventory), name='Inventory'),


    path('new/purchase/', login_required(PurchaseCreateView.as_view()), name='create_purchase'),

    path('list/product/', login_required(ProductoListView.as_view()), name='list_product'),
    path('list/category/', login_required(CategoryListView.as_view()), name='list_category'),
    path('list/supplier/', login_required(SupplierListView.as_view()), name='list_supplier'),
    path('list/customer/', login_required(CustomerListView.as_view()), name='list_customer'),

    path('new/customer/', login_required(CustomerCreateView.as_view()), name='create_customer'),
    path('update/customer/<int:pk>/', login_required(CustomerUpdateView.as_view()), name='update_customer'),
    path('delete/customer/<int:pk>/', login_required(CustomerDeleteView.as_view()), name='delete_customer'),

    path('new/supplier/', login_required(SupplierCreateView.as_view()), name='create_supplier'),
    path('update/supplier/<int:pk>/', login_required(SupplierUpdateView.as_view()), name='update_supplier'),
    path('delete/supplier/<int:pk>/', login_required(SupplierDeleteView.as_view()), name='delete_supplier'),

    path('new/product/', login_required(ProductoCreateView.as_view()), name='create_product'),
    path('update/product/<int:pk>/', login_required(ProductoUpdateView.as_view()), name='update_product'),
    path('detail/product/<int:pk>/', login_required(ProductoDetailView.as_view()), name='detail_product'),
    path('delete/product/<int:pk>/', login_required(ProductoDeleteView.as_view()), name='delete_product'),

    path('new/category/', login_required(CategoryCreateView.as_view()), name='create_category'),
    path('detail/category/<int:pk>/', login_required(CategoryDetailView.as_view()), name='detail_category'),
    path('update/category/<int:pk>/', login_required(CategoryUpdateView.as_view()), name='update_category'),
    path('delete/category/<int:pk>/', login_required(CategoryDeleteView.as_view()), name='delete_category'),

    path('import/new/',login_required(ExcelUploadView.as_view()),name='upload_excel'),
    
    path('new/sale/', login_required(SaleCreateView.as_view()), name='create_sale'),

    path('report/inventory/', login_required(InventoryReportView.as_view()), name='report_inventory'),
    path('report/sales/', login_required(SalesReportView.as_view()), name='report_sales'),
    path('report/purchases/', login_required(PurchasesReportView.as_view()), name='report_purchases'),
    path('report/invoices/', login_required(InvoicesReportView.as_view()), name='report_invoices'),

    path('', login_required(DashboardView.as_view()), name='dashboard'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)