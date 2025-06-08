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
# from rest_framework import generics
# from rest_framework.response import Response
# from django.core.cache import cache
# from .models import Product, Category
# from .serializers import ProductListSerializer, ProductDetailSerializer

# class ProductListView(generics.ListAPIView):
#     serializer_class = ProductListSerializer
#     print("Initializing ProductListView")
#     print("ProductListView initialized")
    
#     def get_queryset(self):
#         queryset = Product.objects.filter(
#             is_available=True, 
#             stock_quantity__gt=0
#         ).select_related('category')
        
#         # Filter by category
#         category = self.request.query_params.get('category')
#         if category:
#             queryset = queryset.filter(category__slug=category)
#         print(f"Filtered queryset: {queryset.query}")
#         return queryset
    
#     def list(self, request, *args, **kwargs):
#         # Try cache first
#         cache_key = f"products:{request.GET.urlencode()}"
#         cached_response = cache.get(cache_key)
        
#         if cached_response:
#             return Response(cached_response)
        
#         response = super().list(request, *args, **kwargs)
        
#         # Add categories to response
#         categories = Category.objects.filter(is_active=True).values('id', 'name', 'slug')
#         response.data['categories'] = list(categories)
#         print(f"Response data: {response.data}")
#         # Cache for 30 minutes
#         cache.set(cache_key, response.data, timeout=1800)
        
#         return response

# class ProductDetailView(generics.RetrieveAPIView):
#     serializer_class = ProductDetailSerializer
#     lookup_field = 'slug'
    
#     def get_queryset(self):
#         return Product.objects.filter(
#             is_available=True, 
#             stock_quantity__gt=0
#         ).select_related('category')


# from rest_framework import generics
# from rest_framework.response import Response
# from django.core.cache import cache
# from .models import Product, Category
# from .serializers import ProductListSerializer, ProductDetailSerializer

# class ProductListView(generics.ListAPIView):
#     serializer_class = ProductListSerializer
#     pagination_class = None  # Disable pagination for this view
    
#     def get_queryset(self):
#         # Base queryset with available products
#         queryset = Product.objects.filter(
#             is_available=True, 
#             stock_quantity__gt=0
#         ).select_related('category')
        
#         # Filter by category if provided
#         category = self.request.query_params.get('category')
#         if category:
#             queryset = queryset.filter(category__slug=category)
#             print(f"Filtering by category: '{category}' - {queryset.count()} products")
#         else:
#             print(f"No category filter - returning all {queryset.count()} available products")
        
#         return queryset
    
#     def list(self, request, *args, **kwargs):
#         print(f"API Request params: {dict(request.query_params)}")
        
#         # Get the filtered queryset and serialize
#         queryset = self.get_queryset()
#         serializer = self.get_serializer(queryset, many=True)
        
#         # Prepare response data
#         response_data = {
#             'results': serializer.data,
#             'count': len(serializer.data)
#         }
        
#         # Add categories to response when no category filter is applied
#         if not request.query_params.get('category'):
#             categories = Category.objects.filter(is_active=True).values('id', 'name', 'slug')
#             response_data['categories'] = list(categories)
#             print(f"Added {len(categories)} categories to response")
        
#         print(f"API Response contains {len(response_data['results'])} products")
        
#         return Response(response_data)

# class ProductDetailView(generics.RetrieveAPIView):
#     serializer_class = ProductDetailSerializer
#     lookup_field = 'slug'
    
#     def get_queryset(self):
#         return Product.objects.filter(
#             is_available=True, 
#             stock_quantity__gt=0
#         ).select_related('category')



# products/views.py
from rest_framework import generics
from rest_framework.response import Response
from django.core.cache import cache
from .models import Product, Category
from .serializers import ProductListSerializer, ProductDetailSerializer

class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    pagination_class = None  # Disable pagination for this view
    
    def get_queryset(self):
        # Base queryset with available products
        queryset = Product.objects.filter(
            is_available=True, 
            stock_quantity__gt=0
        ).select_related('category')
        
        # Filter by category if provided
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)
            print(f"Filtering by category: '{category}' - {queryset.count()} products")
        else:
            print(f"No category filter - returning all {queryset.count()} available products")
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        print(f"API Request params: {dict(request.query_params)}")
        
        # Get the filtered queryset and serialize with request context
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        
        # Prepare response data
        response_data = {
            'results': serializer.data,
            'count': len(serializer.data)
        }
        
        # Add categories to response when no category filter is applied
        if not request.query_params.get('category'):
            categories = Category.objects.filter(is_active=True).values('id', 'name', 'slug')
            response_data['categories'] = list(categories)
            print(f"Added {len(categories)} categories to response")
        
        print(f"API Response contains {len(response_data['results'])} products")
        
        return Response(response_data)

class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        return Product.objects.filter(
            is_available=True, 
            stock_quantity__gt=0
        ).select_related('category')
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context