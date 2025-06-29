from django.contrib import admin
from .models import Cart, CartItem

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'session_key', 'total_items', 'subtotal', 'total_amount', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__username', 'session_key']
    readonly_fields = ['total_items', 'subtotal', 'delivery_fee', 'total_amount']
    
    def total_items(self, obj):
        return obj.total_items
    total_items.short_description = 'Total Items'
    
    def subtotal(self, obj):
        return f"₹{obj.subtotal}"
    subtotal.short_description = 'Subtotal'
    
    def total_amount(self, obj):
        return f"₹{obj.total_amount}"
    total_amount.short_description = 'Total Amount'

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'cart', 'product', 'selected_weight', 'quantity', 'price', 'subtotal']
    list_filter = ['selected_weight', 'created_at']
    search_fields = ['product__name', 'cart__user__username']
    readonly_fields = ['subtotal']
    
    def subtotal(self, obj):
        return f"₹{obj.subtotal}"
    subtotal.short_description = 'Subtotal'
