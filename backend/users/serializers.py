from rest_framework import serializers # type: ignore
from django.contrib.auth.models import User
from .models import CustomerProfile, Address

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    phone = serializers.CharField()
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'phone']
    
    def create(self, validated_data):
        phone = validated_data.pop('phone')
        user = User.objects.create_user(**validated_data)
        CustomerProfile.objects.create(user=user, phone=phone)
        return user

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'type', 'full_name', 'phone', 'address_line_1', 
                 'city', 'state', 'postal_code', 'is_default']