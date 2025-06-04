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
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    image = models.ImageField(upload_to='products/')
    
    price = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    stock_quantity = models.PositiveIntegerField(default=0)
    weight = models.CharField(max_length=20, help_text="e.g., 500g, 1kg")
    
    is_available = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    
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
        return f"{self.name} - {self.weight}"
    
    @property
    def is_in_stock(self):
        return self.stock_quantity > 0

