from rest_framework import viewsets, permissions
from .models import *
from .serializers import *
from django.views.decorators.http import require_GET
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
class CategorySchemaView(APIView):
    def get(self, request, category_id):
        try:
            category = Category.objects.get(pk=category_id)
            return Response(category.product_schema)
        except Category.DoesNotExist:
            return Response({'error': 'Categoría no encontrada'}, status=status.HTTP_404_NOT_FOUND)
    
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filterset_fields = ['name', 'created_by']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category', 'brand')
    serializer_class = ProductSerializer
    filterset_fields = {
        'name': ['icontains'],
        'category': ['exact'],
        'stock': ['gte', 'lte'],
        'sale_price': ['gte', 'lte']
    }

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)