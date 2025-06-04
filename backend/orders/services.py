from django.db import transaction
from .models import Order, OrderItem
from payments.models import Payment
from cart.services import CartService
from users.models import Address

class OrderService:
    @transaction.atomic
    def create_order(self, user, address_id, payment_method, notes=""):
        """Create order from cart"""
        # Get cart
        cart_service = CartService(user_id=user.id)
        cart = cart_service.get_cart()
        
        if not cart['items']:
            raise ValueError("Cart is empty")
        
        # Get address
        address = Address.objects.get(id=address_id, user=user)
        
        # Create order
        order = Order.objects.create(
            user=user,
            delivery_address=address,
            subtotal=cart['subtotal'],
            delivery_fee=cart['delivery_fee'],
            total_amount=cart['total_amount'],
            notes=notes
        )
        
        # Create order items
        for item in cart['items']:
            OrderItem.objects.create(
                order=order,
                product_id=item['product_id'],
                product_name=item['name'],
                product_price=item['price'],
                quantity=item['quantity']
            )
        
        # Create payment record
        Payment.objects.create(
            order=order,
            payment_method=payment_method,
            amount=cart['total_amount']
        )
        
        # Clear cart
        cart_service.clear_cart()
        
        return order