from rest_framework import serializers
from backend.models import Product
from .shorts import UserShortSerializer
from django.core.exceptions import FieldDoesNotExist

HistoricalProduct = Product.history.model

class ProductHistorySerializer(serializers.ModelSerializer):
    history_user = UserShortSerializer(read_only=True)
    changes = serializers.SerializerMethodField()

    class Meta:
        model = HistoricalProduct
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
            HistoricalProduct.objects
            .filter(id=obj.id, history_date__lt=obj.history_date)
            .order_by('-history_date')
            .first()
        )
        if not prev:
            return []

        delta = obj.diff_against(prev, foreign_keys_are_objs=True)
        out   = []

        for change in delta.changes:
            old, new = change.old, change.new

            if isinstance(old, list) and old and isinstance(old[0], dict):
                singular = change.field[:-1] if change.field.endswith('s') else None

                def extract(lst):
                    names = []
                    for d in lst or []:
                        if singular and singular in d:
                            names.append(str(d[singular]))
                    return names

                old = extract(old)
                new = extract(new)

                def sanitize(val):
                    if isinstance(val, list):
                        return [sanitize(x) for x in val]
                    if isinstance(val, dict):
                        return {k: sanitize(v) for k, v in val.items()}
                    if isinstance(val, (str, int, float, bool)) or val is None:
                        return val
                    return str(val)

                old = sanitize(old)
                new = sanitize(new)

                out.append({
                    'field': change.field,
                    'old':   old,
                    'new':   new,
                })
            else:
                out.append({
                    'field': change.field,
                    'old': change.old,
                    'new': change.new,
                })

        return out