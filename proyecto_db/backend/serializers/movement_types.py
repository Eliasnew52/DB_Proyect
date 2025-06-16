from rest_framework import serializers
from backend.models import MovementType

class MovementTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovementType
        fields = '__all__'
