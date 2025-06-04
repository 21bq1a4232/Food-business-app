from django.core.management.base import BaseCommand
from products.models import Category, Product
from decimal import Decimal

class Command(BaseCommand):
    help = 'Setup initial data for the food business'

    def handle(self, *args, **options):
        # Create categories
        categories = [
            {'name': 'Pickles', 'slug': 'pickles', 'description': 'Traditional homemade pickles'},
            {'name': 'Sweets', 'slug': 'sweets', 'description': 'Delicious Indian sweets'},
            {'name': 'Hot Foods', 'slug': 'hot-foods', 'description': 'Fresh hot meals'},
        ]
        
        for cat_data in categories:
            category, created = Category.objects.get_or_create(
                slug=cat_data['slug'], 
                defaults=cat_data
            )
            if created:
                self.stdout.write(f'Created category: {category.name}')
        
        # Create sample products
        pickle_category = Category.objects.get(slug='pickles')
        sweets_category = Category.objects.get(slug='sweets')
        
        products = [
            {
                'name': 'Mango Pickle',
                'slug': 'mango-pickle',
                'category': pickle_category,
                'description': 'Traditional mango pickle with authentic spices',
                'price': Decimal('150.00'),
                'weight': '500g',
                'stock_quantity': 50,
            },
            {
                'name': 'Gulab Jamun',
                'slug': 'gulab-jamun',
                'category': sweets_category,
                'description': 'Soft and sweet gulab jamun',
                'price': Decimal('120.00'),
                'weight': '500g',
                'stock_quantity': 30,
            },
        ]
        
        for product_data in products:
            product, created = Product.objects.get_or_create(
                slug=product_data['slug'],
                defaults=product_data
            )
            if created:
                self.stdout.write(f'Created product: {product.name}')
        
        self.stdout.write(self.style.SUCCESS('Initial data setup completed!'))
