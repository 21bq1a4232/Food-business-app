# # orders/models.py
# from django.db import models
# from django.contrib.auth.models import User
# from users.models import Address
# from products.models import Product
# from decimal import Decimal
# import uuid

# class Order(models.Model):
#     ORDER_STATUS = [
#         ('pending', 'Pending'),
#         ('confirmed', 'Confirmed'),
#         ('delivered', 'Delivered'),
#     ]
    
#     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
#     order_number = models.CharField(max_length=20, unique=True, blank=True)
#     status = models.CharField(max_length=20, choices=ORDER_STATUS, default='pending')
    
#     delivery_address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True)
    
#     subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
#     delivery_fee = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('40.00'))
#     total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    
#     notes = models.TextField(blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)
    
#     class Meta:
#         ordering = ['-created_at']
    
#     def save(self, *args, **kwargs):
#         if not self.order_number:
#             self.order_number = f"ORD{uuid.uuid4().hex[:8].upper()}"
#         super().save(*args, **kwargs)
    
#     def __str__(self):
#         return f"Order {self.order_number}"

# class OrderItem(models.Model):
#     order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
#     product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
#     product_name = models.CharField(max_length=100, blank=True)
#     product_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
#     quantity = models.PositiveIntegerField(null=True, blank=True)
    
#     def __str__(self):
#         if self.product_name and self.quantity:
#             return f"{self.product_name} x {self.quantity}"
#         return f"OrderItem {self.id}"
    
#     @property
#     def subtotal(self):
#         """Calculate subtotal, handling None values safely"""
#         if self.product_price is not None and self.quantity is not None:
#             return self.product_price * self.quantity
#         return Decimal('0.00')
    
#     def save(self, *args, **kwargs):
#         """Auto-populate product details from product if not set"""
#         if self.product and not self.product_name:
#             self.product_name = self.product.name
#         if self.product and not self.product_price:
#             self.product_price = self.product.price
#         super().save(*args, **kwargs)





# orders/models.py
from django.db import models
from django.contrib.auth.models import User
from users.models import Address
from products.models import Product
from decimal import Decimal
import uuid

class Order(models.Model):
    ORDER_STATUS = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('delivered', 'Delivered'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    order_number = models.CharField(max_length=20, unique=True, blank=True)
    status = models.CharField(max_length=20, choices=ORDER_STATUS, default='pending')
    
    delivery_address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True)
    
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    delivery_fee = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('40.00'))
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = f"ORD{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Order {self.order_number}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    product_name = models.CharField(max_length=100, blank=True)
    product_weight = models.CharField(max_length=20, blank=True, help_text="Selected weight (e.g., 500g, 1kg)")
    product_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    quantity = models.PositiveIntegerField(null=True, blank=True)
    
    def __str__(self):
        if self.product_name and self.quantity and self.product_weight:
            return f"{self.product_name} ({self.product_weight}) x {self.quantity}"
        return f"OrderItem {self.id}"
    
    @property
    def subtotal(self):
        """Calculate subtotal, handling None values safely"""
        if self.product_price is not None and self.quantity is not None:
            return self.product_price * self.quantity
        return Decimal('0.00')
    
    def save(self, *args, **kwargs):
        """Auto-populate product details from product if not set"""
        if self.product and not self.product_name:
            self.product_name = self.product.name
        # Note: product_price and product_weight should be set based on user's selection
        super().save(*args, **kwargs)