from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from .models import Payment

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def razorpay_webhook(request):
    """Handle Razorpay webhook"""
    try:
        # In production, verify webhook signature
        payment_id = request.data.get('payment_id')
        order_id = request.data.get('order_id')
        
        # Update payment status
        payment = Payment.objects.get(order__order_number=order_id)
        payment.status = 'completed'
        payment.transaction_id = payment_id
        payment.save()
        
        # Update order status
        order = payment.order
        order.status = 'confirmed'
        order.save()
        
        return Response({'status': 'success'})
    
    except Exception as e:
        return Response({'error': str(e)}, status=400)
