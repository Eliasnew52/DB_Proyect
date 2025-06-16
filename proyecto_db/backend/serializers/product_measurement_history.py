
from rest_framework import serializers
from backend.models import ProductMeasurement
from .shorts import ProductShortSerializer

HistoricalPM = ProductMeasurement.history.model

class ProductMeasurementHistorySerializer(serializers.ModelSerializer):

    history_user   = serializers.StringRelatedField(allow_null=True)
    changes = serializers.SerializerMethodField()
    id = serializers.IntegerField(source='product.id', read_only=True)
    name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model  = HistoricalPM
        fields = [
            'history_id',
            'history_date',
            'history_user',
            'history_type',
            'history_change_reason',
            
            'id',
            'name',

            'changes',
        ]

    def get_changes(self, obj) -> list:
        prev = (
            HistoricalPM.objects
            .filter(id=obj.id, history_date__lt=obj.history_date)
            .order_by('-history_date')
            .first()
        )

        if not prev:
            return []

        delta = obj.diff_against(prev)

        return [
            {
                'field': change.field,
                'old': change.old,
                'new': change.new,
            }
            for change in delta.changes
        ]
    