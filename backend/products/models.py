# from django.db import models
# from django.core.validators import MinValueValidator
# from decimal import Decimal

# class CategoryManager(models.Manager):
#     def active(self):
#         return self.filter(is_active=True)

# class Category(models.Model):
#     name = models.CharField(max_length=50, unique=True)
#     slug = models.SlugField(unique=True)
#     description = models.TextField(blank=True)
#     image = models.ImageField(upload_to='categories/', blank=True)
#     is_active = models.BooleanField(default=True)
#     created_at = models.DateTimeField(auto_now_add=True)
    
#     objects = CategoryManager()
    
#     class Meta:
#         verbose_name_plural = "Categories"
#         ordering = ['name']
    
#     def __str__(self):
#         return self.name

# class ProductManager(models.Manager):
#     def available(self):
#         return self.filter(is_available=True, stock_quantity__gt=0)
    
#     def featured(self):
#         return self.filter(is_featured=True, is_available=True)
    
#     def with_category(self):
#         return self.select_related('category')

# class Product(models.Model):
#     category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
#     name = models.CharField(max_length=100)
#     slug = models.SlugField(unique=True)
#     description = models.TextField()
#     image = models.ImageField(upload_to='products/',null=True, blank=True)
    
#     price = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
#     stock_quantity = models.PositiveIntegerField(default=0)
#     weight = models.CharField(max_length=20, help_text="e.g., 500g, 1kg")
    
#     is_available = models.BooleanField(default=True)
#     is_featured = models.BooleanField(default=False)
    
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     objects = ProductManager()
    
#     class Meta:
#         ordering = ['-created_at']
#         indexes = [
#             models.Index(fields=['category', 'is_available']),
#             models.Index(fields=['is_featured']),
#         ]
    
#     def __str__(self):
#         return f"{self.name} - {self.weight}"
    
#     @property
#     def is_in_stock(self):
#         return self.stock_quantity > 0



from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal

class CategoryManager(models.Manager):
    def active(self):
        return self.filter(is_active=True)

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    objects = CategoryManager()
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name

class ProductManager(models.Manager):
    def available(self):
        return self.filter(is_available=True, stock_quantity__gt=0)
    
    def featured(self):
        return self.filter(is_featured=True, is_available=True)
    
    def with_category(self):
        return self.select_related('category')

class Product(models.Model):
    WEIGHT_CHOICES = [
        ('250g', '250 grams'),
        ('500g', '500 grams'),
        ('750g', '750 grams'),
        ('1kg', '1 kilogram'),
        ('2kg', '2 kilograms'),
        ('5kg', '5 kilograms'),
    ]
    
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    
    base_price = models.DecimalField(max_digits=8,default=350,decimal_places=2, help_text="Price for base weight (1kg)", validators=[MinValueValidator(Decimal('0.01'))])
    available_weights = models.JSONField(
        default=list,
        help_text="List of available weights for this product. Example: ['250g', '500g', '1kg']"
    )
    stock_quantity = models.PositiveIntegerField(default=0)
    
    is_available = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_seasonal = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = ProductManager()
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category', 'is_available']),
            models.Index(fields=['is_featured']),
        ]
    
    def __str__(self):
        return f"{self.name}"
    
    @property
    def is_in_stock(self):
        return self.stock_quantity > 0
    
    def get_price_for_weight(self, weight):
        """Calculate price based on weight"""
        weight_multipliers = {
            '250g': 0.25,
            '500g': 0.5,
            '750g': 0.75,
            '1kg': 1.0,
            '2kg': 2.0,
            '5kg': 5.0,
        }
        multiplier = weight_multipliers.get(weight, 1.0)
        return self.base_price * Decimal(str(multiplier))
    
    def get_available_weight_choices(self):
        """Get available weights with prices"""
        choices = []
        for weight in self.available_weights:
            price = self.get_price_for_weight(weight)
            choices.append({
                'weight': weight,
                'display': dict(self.WEIGHT_CHOICES)[weight],
                'price': str(price)  # Convert to string for JSON serialization
            })
        return choices