from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('products/add/', NewProduct, name='NewProduct'),
    path('products/buy/', BuyProduct, name ='BuyProduct'),
    path('products/sell/', SellProduct, name ='SellProduct'),
    path('products/inventory/', Inventory, name='Inventory'),
    path('products/edit/<int:product_id>/', EditProduct, name='EditProduct'),

    path('', DashboardView.as_view(), name='dashboard'),
    
    path('list/product/', ProductoListView.as_view(), name='list_product'),
    path('list/category/', CategoryListView.as_view(), name='list_category'),


    path('new/product/', ProductoCreateView.as_view(), name='create_product'),
    path('update/product/<int:pk>/', ProductoUpdateView.as_view(), name='update_product'),
    path('new/category/', CategoryCreateView.as_view(), name='create_category'),
    path('new/sale/', SaleCreateView.as_view(), name='create_sale'),
    path('detail/product/<int:pk>/', ProductoDetailView.as_view(), name='detail_product'),
    path('detail/category/<int:pk>/', CategoryDetailView.as_view(), name='detail_category'),

]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)