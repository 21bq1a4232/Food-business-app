from rest_framework import serializers #type: ignore

class CartItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=0)

class CartSerializer(serializers.Serializer):
    items = CartItemSerializer(many=True)

class CartResponseSerializer(serializers.Serializer):
    items = serializers.ListField()
    total_items = serializers.IntegerField()
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2)
    delivery_fee = serializers.DecimalField(max_digits=6, decimal_places=2)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
