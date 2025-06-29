from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .services import CartService
from .serializers import CartSerializer, CartItemCreateSerializer, CartItemUpdateSerializer

class CartView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Get current cart"""
        cart_service = CartService(
            user_id=request.user.id if request.user.is_authenticated else None,
            session_key=request.session.session_key
        )
        cart = cart_service.get_cart()
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    def post(self, request):
        """Add item to cart"""
        serializer = CartItemCreateSerializer(data=request.data)
        if serializer.is_valid():
            cart_service = CartService(
                user_id=request.user.id if request.user.is_authenticated else None,
                session_key=request.session.session_key
            )
            
            try:
                cart = cart_service.add_item(
                    product_id=serializer.validated_data['product_id'],
                    selected_weight=serializer.validated_data['selected_weight'],
                    quantity=serializer.validated_data['quantity']
                )
                
                response_serializer = CartSerializer(cart)
                return Response(response_serializer.data)
                
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        """Update item quantity in cart"""
        serializer = CartItemUpdateSerializer(data=request.data)
        if serializer.is_valid():
            cart_service = CartService(
                user_id=request.user.id if request.user.is_authenticated else None,
                session_key=request.session.session_key
            )
            
            try:
                cart = cart_service.update_item(
                    product_id=request.data.get('product_id'),
                    selected_weight=request.data.get('selected_weight'),
                    quantity=serializer.validated_data['quantity']
                )
                
                response_serializer = CartSerializer(cart)
                return Response(response_serializer.data)
                
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        """Remove item from cart or clear cart"""
        cart_service = CartService(
            user_id=request.user.id if request.user.is_authenticated else None,
            session_key=request.session.session_key
        )
        
        # If product_id and selected_weight are provided, remove specific item
        if 'product_id' in request.data and 'selected_weight' in request.data:
            try:
                cart = cart_service.remove_item(
                    product_id=request.data['product_id'],
                    selected_weight=request.data['selected_weight']
                )
                response_serializer = CartSerializer(cart)
                return Response(response_serializer.data)
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Clear entire cart
            cart = cart_service.clear_cart()
            response_serializer = CartSerializer(cart)
            return Response(response_serializer.data)