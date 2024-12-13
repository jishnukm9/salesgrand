

from rest_framework import serializers
from django.contrib.auth.models import User
from core.models import Service,CustomerBookingRepair


class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model=User
        fields = ['id','username','password','email']


# class ServiceSerializer(serializers.ModelSerializer):
#     class Meta(object):
#         model=Service
#         fields = '__all__'






