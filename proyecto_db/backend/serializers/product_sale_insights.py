from rest_framework import serializers

class ProductSalesInsightsInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    period = serializers.CharField()
    amount = serializers.IntegerField(required=False)
    from_date = serializers.DateField(required=False)
    to_date = serializers.DateField(required=False)