# from rest_framework import serializers
# from .models import Category, Product

# class CategorySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Category
#         fields = ['id', 'name', 'slug']

# class ProductListSerializer(serializers.ModelSerializer):
#     """Minimal serializer for product listings"""
#     category_name = serializers.CharField(source='category.name', read_only=True)
    
#     class Meta:
#         model = Product
#         fields = ['id', 'name', 'price', 'image', 'weight', 'category_name', 'is_in_stock']

# class ProductDetailSerializer(serializers.ModelSerializer):
#     """Full serializer for product details"""
#     category = CategorySerializer(read_only=True)
    
#     class Meta:
#         model = Product
#         fields = ['id', 'name', 'description', 'price', 'image', 'weight', 
#                  'category', 'stock_quantity', 'is_in_stock']

# products/serializers.py
from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ProductListSerializer(serializers.ModelSerializer):
    """Minimal serializer for product listings with weight options"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    image_url = serializers.SerializerMethodField()
    weight_options = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'base_price', 'image', 'image_url', 'weight_options', 
                 'category_name', 'is_in_stock', 'is_seasonal']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def get_weight_options(self, obj):
        """Get available weights with calculated prices"""
        return obj.get_available_weight_choices()

class ProductDetailSerializer(serializers.ModelSerializer):
    """Full serializer for product details"""
    category = CategorySerializer(read_only=True)
    image_url = serializers.SerializerMethodField()
    weight_options = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'base_price', 'image', 'image_url', 
                 'weight_options', 'category', 'stock_quantity', 'is_in_stock', 'is_seasonal']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def get_weight_options(self, obj):
        """Get available weights with calculated prices"""
        return obj.get_available_weight_choices()