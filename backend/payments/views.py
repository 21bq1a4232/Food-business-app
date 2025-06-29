
# Update your existing views.py to add Paytm support
# backend/payments/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect
from django.conf import settings
from .models import Payment
from orders.models import Order
import hashlib
import uuid
import json

# Simple Paytm checksum function (no external library needed)
def generate_paytm_checksum(params, merchant_key):
    """Generate simple checksum for Paytm"""
    # Sort parameters and create string
    sorted_params = sorted(params.items())
    param_string = '&'.join([f"{k}={v}" for k, v in sorted_params if k != 'CHECKSUMHASH'])
    
    # Add merchant key and generate hash
    final_string = param_string + merchant_key
    checksum = hashlib.sha256(final_string.encode()).hexdigest()
    return checksum

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_payment(request):
    """Initiate payment process"""
    try:
        order_id = request.data.get('order_id')
        payment_method = request.data.get('payment_method')
        
        if not order_id or not payment_method:
            return Response({'error': 'Order ID and payment method required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Get order
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, 
                          status=status.HTTP_404_NOT_FOUND)
        
        # Create or get payment record
        payment, created = Payment.objects.get_or_create(
            order=order,
            defaults={
                'payment_method': payment_method,
                'amount': order.total_amount,
                'status': 'pending'
            }
        )
        
        if payment_method == 'paytm':
            return handle_paytm_payment(order, payment, request.user)
        elif payment_method == 'cod':
            return handle_cod_payment(order, payment)
        else:
            return Response({'error': 'Invalid payment method'}, 
                          status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({'error': str(e)}, 
                      status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def handle_paytm_payment(order, payment, user):
    """Handle Paytm payment initiation"""
    
    # Paytm configuration (add these to your settings.py)
    PAYTM_MERCHANT_ID = getattr(settings, 'PAYTM_MERCHANT_ID', 'YOUR_MERCHANT_ID')
    PAYTM_MERCHANT_KEY = getattr(settings, 'PAYTM_MERCHANT_KEY', 'YOUR_MERCHANT_KEY')
    
    # For testing, use staging URL
    PAYTM_URL = "https://securegw-stage.paytm.in/order/process"
    
    # Generate unique transaction ID
    txn_id = f"TXN{order.id}_{uuid.uuid4().hex[:8].upper()}"
    
    # Prepare Paytm parameters
    params = {
        'MID': PAYTM_MERCHANT_ID,
        'WEBSITE': 'WEBSTAGING',  # Use 'DEFAULT' for production
        'INDUSTRY_TYPE_ID': 'Retail',
        'CHANNEL_ID': 'WEB',
        'ORDER_ID': str(order.id),
        'TXN_AMOUNT': str(order.total_amount),
        'CUST_ID': str(user.id),
        'MOBILE_NO': getattr(user, 'phone', '9999999999'),
        'EMAIL': user.email or 'customer@example.com',
        'CALLBACK_URL': 'http://localhost:8000/api/payments/paytm/callback/',
    }
    
    # Generate checksum (simplified version)
    checksum = generate_paytm_checksum(params, PAYTM_MERCHANT_KEY)
    params['CHECKSUMHASH'] = checksum
    
    # Update payment record
    payment.transaction_id = txn_id
    payment.paytm_order_id = str(order.id)
    payment.save()
    
    return Response({
        'status': 'success',
        'payment_url': PAYTM_URL,
        'params': params,
        'order_id': order.id,
        'amount': order.total_amount
    })

def handle_cod_payment(order, payment):
    """Handle Cash on Delivery"""
    
    # Update payment
    payment.transaction_id = f'COD_{order.order_number}'
    payment.status = 'completed'
    payment.save()
    
    # Update order
    order.status = 'confirmed'
    order.save()
    
    return Response({
        'status': 'success',
        'message': 'Order confirmed with Cash on Delivery',
        'order_id': order.id
    })

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def paytm_callback(request):
    """Handle Paytm callback"""
    try:
        # Get response data
        response_data = dict(request.POST)
        
        # Flatten QueryDict to regular dict
        flattened_data = {}
        for key, value in response_data.items():
            flattened_data[key] = value[0] if isinstance(value, list) else value
        
        order_id = flattened_data.get('ORDERID')
        txn_id = flattened_data.get('TXNID')
        response_code = flattened_data.get('RESPCODE')
        
        if order_id:
            try:
                order = Order.objects.get(id=order_id)
                payment = Payment.objects.get(order=order)
                
                # Store gateway response
                payment.gateway_response = json.dumps(flattened_data)
                payment.transaction_id = txn_id or payment.transaction_id
                
                # Check if payment was successful
                if response_code == '01':  # Paytm success code
                    payment.status = 'completed'
                    order.status = 'confirmed'
                else:
                    payment.status = 'failed'
                
                payment.save()
                order.save()
                
                # Redirect to appropriate page
                if payment.status == 'completed':
                    return HttpResponseRedirect(f'http://localhost:3000/payment-success?order_id={order_id}')
                else:
                    return HttpResponseRedirect(f'http://localhost:3000/payment-failed?order_id={order_id}')
                    
            except (Order.DoesNotExist, Payment.DoesNotExist):
                return HttpResponseRedirect('http://localhost:3000/payment-failed?error=order_not_found')
        
        return HttpResponseRedirect('http://localhost:3000/payment-failed?error=invalid_response')
        
    except Exception as e:
        return HttpResponseRedirect(f'http://localhost:3000/payment-failed?error={str(e)}')

# Keep your existing razorpay_webhook function
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_status(request, order_id):
    """Check payment status"""
    try:
        order = Order.objects.get(id=order_id, user=request.user)
        payment = Payment.objects.get(order=order)
        
        return Response({
            'status': payment.status,
            'order_status': order.status,
            'transaction_id': payment.transaction_id,
            'amount': payment.amount,
            'payment_method': payment.payment_method
        })
        
    except (Order.DoesNotExist, Payment.DoesNotExist):
        return Response({'error': 'Order or payment not found'}, 
                      status=status.HTTP_404_NOT_FOUND)