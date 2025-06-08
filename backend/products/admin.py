# products/admin.py
from django import forms
from django.contrib import admin
from .models import Category, Product

class ProductAdminForm(forms.ModelForm):
    available_weights = forms.MultipleChoiceField(
        choices=Product.WEIGHT_CHOICES,
        widget=forms.CheckboxSelectMultiple,
        help_text="Select all weights available for this product"
    )
    
    class Meta:
        model = Product
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # If editing existing product, pre-select the available weights
        if self.instance and self.instance.pk and self.instance.available_weights:
            self.fields['available_weights'].initial = self.instance.available_weights

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm
    list_display = ['name', 'category', 'base_price', 'get_weights_display', 'stock_quantity', 'is_available', 'is_seasonal']
    list_filter = ['category', 'is_available', 'is_featured', 'is_seasonal']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    
    def get_weights_display(self, obj):
        if obj.available_weights:
            return ", ".join(obj.available_weights)
        return "No weights set"
    get_weights_display.short_description = 'Available Weights'
    
    def save_model(self, request, obj, form, change):
        # Convert form data to list for JSONField
        if 'available_weights' in form.cleaned_data:
            obj.available_weights = list(form.cleaned_data['available_weights'])
        super().save_model(request, obj, form, change)