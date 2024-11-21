from django.urls import path
from .views import *

urlpatterns = [
    path('products/add/', NewProduct, name='NewProduct'),
    path('products/buy/', BuyProduct, name ='BuyProduct'),
    path('products/sell/', SellProduct, name ='SellProduct'),
    path('products/inventory/', Inventory, name='Inventory'),
    path('products/edit/<int:product_id>/', EditProduct, name='EditProduct'),

    path('', DashboardView.as_view(), name='dashboard'),
    path('new/product/', ProductoCreateView.as_view(), name='create_product'),
    path('list/product/', ProductoListView.as_view(), name='list_product'),


]
