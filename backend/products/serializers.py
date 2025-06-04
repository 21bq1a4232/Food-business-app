from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ProductListSerializer(serializers.ModelSerializer):
    """Minimal serializer for product listings"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image', 'weight', 'category_name', 'is_in_stock']

class ProductDetailSerializer(serializers.ModelSerializer):
    """Full serializer for product details"""
    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image', 'weight', 
                 'category', 'stock_quantity', 'is_in_stock']