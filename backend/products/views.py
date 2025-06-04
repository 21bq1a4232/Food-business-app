# from rest_framework import generics
# from rest_framework.response import Response
# from django.core.cache import cache
# from .models import Product, Category
# from .serializers import ProductListSerializer, ProductDetailSerializer

# class ProductListView(generics.ListAPIView):
#     serializer_class = ProductListSerializer
    
#     def get_queryset(self):
#         queryset = Product.objects.available().with_category()
        
#         # Filter by category
#         category = self.request.query_params.get('category')
#         if category:
#             queryset = queryset.filter(category__slug=category)
        
#         return queryset
    
#     def list(self, request, *args, **kwargs):
#         # Try cache first
#         cache_key = f"products:{request.GET.urlencode()}"
#         cached_response = cache.get(cache_key)
        
#         if cached_response:
#             return Response(cached_response)
        
#         response = super().list(request, *args, **kwargs)
        
#         # Add categories to response
#         categories = Category.objects.active().values('id', 'name', 'slug')
#         response.data['categories'] = list(categories)
        
#         # Cache for 30 minutes
#         cache.set(cache_key, response.data, timeout=1800)
        
#         return response

# class ProductDetailView(generics.RetrieveAPIView):
#     queryset = Product.objects.available().with_category()
#     serializer_class = ProductDetailSerializer
#     lookup_field = 'slug'
from rest_framework import generics
from rest_framework.response import Response
from django.core.cache import cache
from .models import Product, Category
from .serializers import ProductListSerializer, ProductDetailSerializer

class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    
    def get_queryset(self):
        queryset = Product.objects.filter(
            is_available=True, 
            stock_quantity__gt=0
        ).select_related('category')
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        # Try cache first
        cache_key = f"products:{request.GET.urlencode()}"
        cached_response = cache.get(cache_key)
        
        if cached_response:
            return Response(cached_response)
        
        response = super().list(request, *args, **kwargs)
        
        # Add categories to response
        categories = Category.objects.filter(is_active=True).values('id', 'name', 'slug')
        response.data['categories'] = list(categories)
        
        # Cache for 30 minutes
        cache.set(cache_key, response.data, timeout=1800)
        
        return response

class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        return Product.objects.filter(
            is_available=True, 
            stock_quantity__gt=0
        ).select_related('category')