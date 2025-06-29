from django.db import models
from django.contrib.auth.models import User
from products.models import Product
from decimal import Decimal

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_key = models.CharField(max_length=40, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = [['user', 'session_key']]
    
    def __str__(self):
        if self.user:
            return f"Cart for {self.user.username}"
        return f"Cart (Session: {self.session_key})"
    
    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())
    
    @property
    def subtotal(self):
        return sum(item.subtotal for item in self.items.all())
    
    @property
    def delivery_fee(self):
        return Decimal('40.00') if self.subtotal > 0 else Decimal('0.00')
    
    @property
    def total_amount(self):
        return self.subtotal + self.delivery_fee

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    selected_weight = models.CharField(max_length=20, help_text="Selected weight (e.g., 500g, 1kg)")
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=8, decimal_places=2, help_text="Price for selected weight")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = [['cart', 'product', 'selected_weight']]
    
    def __str__(self):
        return f"{self.product.name} ({self.selected_weight}) x {self.quantity}"
    
    @property
    def subtotal(self):
        return self.price * self.quantity
