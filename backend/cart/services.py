import json
from django.core.cache import cache
from products.models import Product
from decimal import Decimal

class CartService:
    def __init__(self, user_id=None, session_key=None):
        self.user_id = user_id
        self.session_key = session_key
        self.cache_key = f"cart:{user_id or session_key}"
    
    def get_cart(self):
        """Get cart from Redis"""
        cart_data = cache.get(self.cache_key, {})
        if not cart_data:
            return self._empty_cart()
        
        # Get product details for cart items
        product_ids = list(cart_data.get('items', {}).keys())
        products = Product.objects.filter(id__in=product_ids).values(
            'id', 'name', 'price', 'image', 'weight', 'stock_quantity'
        )
        
        items = []
        subtotal = Decimal('0')
        
        for product in products:
            product_id = str(product['id'])
            if product_id in cart_data['items']:
                quantity = cart_data['items'][product_id]
                
                # Check stock
                if quantity > product['stock_quantity']:
                    quantity = product['stock_quantity']
                    cart_data['items'][product_id] = quantity
                
                item_total = Decimal(str(product['price'])) * quantity
                subtotal += item_total
                
                items.append({
                    'product_id': product['id'],
                    'name': product['name'],
                    'price': product['price'],
                    'image': product['image'],
                    'weight': product['weight'],
                    'quantity': quantity,
                    'subtotal': item_total
                })
        
        delivery_fee = Decimal('40.00') if subtotal > 0 else Decimal('0')
        total_amount = subtotal + delivery_fee
        
        cart_response = {
            'items': items,
            'total_items': sum(item['quantity'] for item in items),
            'subtotal': subtotal,
            'delivery_fee': delivery_fee,
            'total_amount': total_amount
        }
        
        # Update cache with cleaned data
        cache.set(self.cache_key, cart_data, timeout=3600)  # 1 hour
        
        return cart_response
    
    def update_cart(self, items):
        """Update cart with new items"""
        cart_data = cache.get(self.cache_key, {'items': {}})
        
        for item in items:
            product_id = str(item['product_id'])
            quantity = item['quantity']
            
            if quantity > 0:
                cart_data['items'][product_id] = quantity
            elif product_id in cart_data['items']:
                del cart_data['items'][product_id]
        
        cache.set(self.cache_key, cart_data, timeout=3600)
        return self.get_cart()
    
    def clear_cart(self):
        """Clear cart completely"""
        cache.delete(self.cache_key)
    
    def _empty_cart(self):
        return {
            'items': [],
            'total_items': 0,
            'subtotal': Decimal('0'),
            'delivery_fee': Decimal('0'),
            'total_amount': Decimal('0')
        }