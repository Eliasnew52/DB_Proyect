from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'products', views.ProductViewSet)

urlpatterns = [
    path('api/category-schema/<int:category_id>/', views.CategorySchemaView.as_view(), name='get_category_schema'),

    path('api/', include(router.urls)),

]