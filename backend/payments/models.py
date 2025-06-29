from django.db import models
from orders.models import Order

class Payment(models.Model):
    PAYMENT_METHODS = [
        ('paytm', 'Paytm'),  # Add this line
        ('razorpay', 'Razorpay'),
        ('cod', 'Cash on Delivery'),
    ]
    
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    payment_method = models.CharField(max_length=15, choices=PAYMENT_METHODS)
    status = models.CharField(max_length=10, choices=PAYMENT_STATUS, default='pending')
    transaction_id = models.CharField(max_length=100, blank=True)
    
    # Add these optional fields for Paytm (they'll be null for existing records)
    paytm_order_id = models.CharField(max_length=100, blank=True, null=True)
    gateway_response = models.TextField(blank=True, null=True)  # Store JSON as text
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Payment {self.transaction_id} - ₹{self.amount}"