from rest_framework import serializers

class ProductSalesSummarySerializer(serializers.Serializer):
    product = serializers.CharField()
    quantity_sold = serializers.IntegerField()
    net_revenue = serializers.FloatField()
    total_cost = serializers.FloatField()
    total_margin = serializers.FloatField()
    margin_pct = serializers.FloatField()

class ProductSalesSummaryTotalsSerializer(serializers.Serializer):
    quantity_sold = serializers.IntegerField()
    net_revenue = serializers.FloatField()
    total_cost = serializers.FloatField()
    total_margin = serializers.FloatField()
    margin_pct = serializers.FloatField()
    total_products = serializers.IntegerField() 