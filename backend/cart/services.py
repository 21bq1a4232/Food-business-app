from django.db import transaction
from products.models import Product
from .models import Cart, CartItem
from decimal import Decimal

class CartService:
    def __init__(self, user_id=None, session_key=None):
        self.user_id = user_id
        self.session_key = session_key
        self.cart = self._get_or_create_cart()
    
    def _get_or_create_cart(self):
        """Get existing cart or create new one"""
        if self.user_id:
            cart, created = Cart.objects.get_or_create(user_id=self.user_id)
        else:
            cart, created = Cart.objects.get_or_create(session_key=self.session_key)
        return cart
    
    def get_cart(self):
        """Get cart with all items and totals"""
        # Return the cart model instance directly for serialization
        return self.cart
    
    @transaction.atomic
    def add_item(self, product_id, selected_weight, quantity=1):
        """Add item to cart or update quantity"""
        try:
            product = Product.objects.get(id=product_id)
            
            # Calculate price for selected weight
            price = product.get_price_for_weight(selected_weight)
            
            # Check if item already exists in cart
            cart_item, created = CartItem.objects.get_or_create(
                cart=self.cart,
                product=product,
                selected_weight=selected_weight,
                defaults={'quantity': quantity, 'price': price}
            )
            
            if not created:
                # Update existing item
                cart_item.quantity += quantity
                cart_item.save()
            
            return self.cart
            
        except Product.DoesNotExist:
            raise ValueError(f"Product with id {product_id} does not exist")
    
    @transaction.atomic
    def update_item(self, product_id, selected_weight, quantity):
        """Update item quantity in cart"""
        try:
            cart_item = CartItem.objects.get(
                cart=self.cart,
                product_id=product_id,
                selected_weight=selected_weight
            )
            
            if quantity <= 0:
                cart_item.delete()
            else:
                cart_item.quantity = quantity
                cart_item.save()
            
            return self.cart
            
        except CartItem.DoesNotExist:
            raise ValueError("Item not found in cart")
    
    @transaction.atomic
    def remove_item(self, product_id, selected_weight):
        """Remove item from cart"""
        try:
            cart_item = CartItem.objects.get(
                cart=self.cart,
                product_id=product_id,
                selected_weight=selected_weight
            )
            cart_item.delete()
            return self.cart
            
        except CartItem.DoesNotExist:
            raise ValueError("Item not found in cart")
    
    @transaction.atomic
    def clear_cart(self):
        """Clear all items from cart"""
        self.cart.items.all().delete()
        return self.cart
    
    def merge_carts(self, session_cart):
        """Merge session cart with user cart after login"""
        if not self.user_id or not session_cart:
            return
        
        for item in session_cart.items.all():
            self.add_item(
                product_id=item.product.id,
                selected_weight=item.selected_weight,
                quantity=item.quantity
            )
        
        # Delete session cart after merging
        session_cart.delete()