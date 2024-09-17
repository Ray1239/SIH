from rest_framework import serializers
from .models import Complaint

class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ['description', 'priority', 'file', 'mobile', 'PNR', 'analysis', 'sentiment', 'category', 'metadata', 'latitude', 'longitude']
