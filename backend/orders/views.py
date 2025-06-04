from rest_framework import generics, status
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer, OrderCreateSerializer
from .services import OrderService

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')

class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderCreateSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                order_service = OrderService()
                order = order_service.create_order(
                    user=request.user,
                    address_id=serializer.validated_data['address_id'],
                    payment_method=serializer.validated_data['payment_method'],
                    notes=serializer.validated_data.get('notes', '')
                )
                
                order_serializer = OrderSerializer(order)
                return Response(order_serializer.data, status=status.HTTP_201_CREATED)
            
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
