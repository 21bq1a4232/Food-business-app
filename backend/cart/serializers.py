from rest_framework import serializers
from .models import Cart, CartItem

class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True, use_url=True)
    category_name = serializers.CharField(source='product.category.name', read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = CartItem
        fields = [
            'id', 'product_id', 'product', 'product_name', 'product_image', 'category_name',
            'selected_weight', 'quantity', 'price', 'subtotal'
        ]
        read_only_fields = ['id', 'product_id', 'product_name', 'product_image', 'category_name', 'subtotal']

class CartItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    selected_weight = serializers.CharField(max_length=20)
    quantity = serializers.IntegerField(min_value=1)

class CartItemUpdateSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=0)

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    delivery_fee = serializers.DecimalField(max_digits=6, decimal_places=2, read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Cart
        fields = [
            'id', 'items', 'total_items', 'subtotal', 
            'delivery_fee', 'total_amount', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class CartResponseSerializer(serializers.Serializer):
    items = serializers.ListField()
    total_items = serializers.IntegerField()
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2)
    delivery_fee = serializers.DecimalField(max_digits=6, decimal_places=2)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
