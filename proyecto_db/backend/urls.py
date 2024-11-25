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
    path('products/edit/<int:product_id>/', login_required(EditProduct), name='EditProduct'),

    path('', login_required(DashboardView.as_view()), name='dashboard'),
    
    path('list/product/', login_required(ProductoListView.as_view()), name='list_product'),
    path('list/category/', login_required(CategoryListView.as_view()), name='list_category'),

    path('new/product/', login_required(ProductoCreateView.as_view()), name='create_product'),
    path('update/product/<int:pk>/', login_required(ProductoUpdateView.as_view()), name='update_product'),
    path('new/category/', login_required(CategoryCreateView.as_view()), name='create_category'),
    path('new/sale/', login_required(SaleCreateView.as_view()), name='create_sale'),
    path('detail/product/<int:pk>/', login_required(ProductoDetailView.as_view()), name='detail_product'),
    path('detail/category/<int:pk>/', login_required(CategoryDetailView.as_view()), name='detail_category'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)