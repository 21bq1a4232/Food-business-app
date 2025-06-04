from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .services import CartService
from .serializers import CartSerializer, CartResponseSerializer

class CartView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        """Get current cart"""
        cart_service = CartService(
            user_id=request.user.id if request.user.is_authenticated else None,
            session_key=request.session.session_key
        )
        cart = cart_service.get_cart()
        
        serializer = CartResponseSerializer(cart)
        return Response(serializer.data)
    
    def post(self, request):
        """Update cart"""
        serializer = CartSerializer(data=request.data)
        if serializer.is_valid():
            cart_service = CartService(
                user_id=request.user.id if request.user.is_authenticated else None,
                session_key=request.session.session_key
            )
            cart = cart_service.update_cart(serializer.validated_data['items'])
            
            response_serializer = CartResponseSerializer(cart)
            return Response(response_serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)