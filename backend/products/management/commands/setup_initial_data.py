# from django.core.management.base import BaseCommand
# from products.models import Category, Product
# from decimal import Decimal

# class Command(BaseCommand):
#     help = 'Setup initial data for the food business'

#     def handle(self, *args, **options):
#         # Create categories
#         categories = [
#             {'name': 'Pickles', 'slug': 'pickles', 'description': 'Traditional homemade pickles'},
#             {'name': 'Sweets', 'slug': 'sweets', 'description': 'Delicious Indian sweets'},
#             {'name': 'Hot Foods', 'slug': 'hot-foods', 'description': 'Fresh hot meals'},
#         ]
        
#         for cat_data in categories:
#             category, created = Category.objects.get_or_create(
#                 slug=cat_data['slug'], 
#                 defaults=cat_data
#             )
#             if created:
#                 self.stdout.write(f'Created category: {category.name}')
        
#         # Create sample products
#         pickle_category = Category.objects.get(slug='pickles')
#         sweets_category = Category.objects.get(slug='sweets')
        
#         products = [
#             {
#                 'name': 'Mango Pickle',
#                 'slug': 'mango-pickle',
#                 'category': pickle_category,
#                 'description': 'Traditional mango pickle with authentic spices',
#                 'price': Decimal('150.00'),
#                 'weight': '500g',
#                 'stock_quantity': 50,
#             },
#             {
#                 'name': 'Gulab Jamun',
#                 'slug': 'gulab-jamun',
#                 'category': sweets_category,
#                 'description': 'Soft and sweet gulab jamun',
#                 'price': Decimal('120.00'),
#                 'weight': '500g',
#                 'stock_quantity': 30,
#             },
#         ]
        
#         for product_data in products:
#             product, created = Product.objects.get_or_create(
#                 slug=product_data['slug'],
#                 defaults=product_data
#             )
#             if created:
#                 self.stdout.write(f'Created product: {product.name}')
        
#         self.stdout.write(self.style.SUCCESS('Initial data setup completed!'))

# products/management/commands/setup_data.py

from django.core.management.base import BaseCommand
from products.models import Category, Product
from decimal import Decimal
import random

class Command(BaseCommand):
    help = 'Setup initial data for the food business with at least 40 products.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting initial data setup...'))

        # Create categories if they don't exist
        categories_data = [
            {'name': 'Pickles', 'slug': 'pickles', 'description': 'Traditional homemade pickles'},
            {'name': 'Sweets', 'slug': 'sweets', 'description': 'Delicious Indian sweets'},
            {'name': 'Hot Foods', 'slug': 'hot-foods', 'description': 'Fresh hot meals, ready to eat'},
        ]
        
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                slug=cat_data['slug'], 
                defaults=cat_data
            )
            if created:
                self.stdout.write(f'Created category: {category.name}')
            else:
                self.stdout.write(f'Category already exists: {category.name}')
        
        # Get category objects
        pickle_category = Category.objects.get(slug='pickles')
        sweets_category = Category.objects.get(slug='sweets')
        hot_foods_category = Category.objects.get(slug='hot-foods')

        # Generate sample products (aiming for over 40)
        products_to_create = []

        # Pickles (15 items)
        pickle_names = [
            'Traditional Mango Pickle', 'Spicy Mixed Vegetable Pickle', 'Lemon Ginger Pickle',
            'Garlic Pickle', 'Green Chilli Pickle', 'Tomato Pickle', 'Amla Pickle',
            'Red Chilli Pickle', 'Carrot Pickle', 'Cauliflower Pickle', 'Brinjal Pickle',
            'Gongura Pickle', 'Drumstick Pickle', 'Bitter Gourd Pickle', 'Hyderabadi Mango Pickle',
        ]
        for name in pickle_names:
            slug = name.lower().replace(' ', '-').replace('--', '-')
            products_to_create.append({
                'name': name,
                'slug': slug,
                'category': pickle_category,
                'description': f'A {name.lower()} made with authentic spices and fresh ingredients.',
                'price': Decimal(str(random.randint(100, 250) * 5 / 5)),
                'weight': f'{random.choice([250, 500, 750, 1000])}g',
                'stock_quantity': random.randint(20, 100),
                'is_available': True,
            })

        # Sweets (15 items)
        sweet_names = [
            'Classic Gulab Jamun', 'Rasgulla', 'Kaju Katli', 'Mysore Pak', 'Jalebi',
            'Boondi Laddu', 'Mohan Thal', 'Balushahi', 'Ghewar', 'Petha',
            'Coconut Laddu', 'Motichoor Laddu', 'Shahi Tukda', 'Basundi', 'Cham Cham',
        ]
        for name in sweet_names:
            slug = name.lower().replace(' ', '-').replace('--', '-')
            products_to_create.append({
                'name': name,
                'slug': slug,
                'category': sweets_category,
                'description': f'Delicious {name.lower()} prepared with traditional recipes.',
                'price': Decimal(str(random.randint(150, 300) * 5 / 5)),
                'weight': f'{random.choice([250, 500, 750])}g',
                'stock_quantity': random.randint(15, 80),
                'is_available': True,
            })

        # Hot Foods (15 items - to ensure over 40 total)
        hot_food_names = [
            'Vegetable Biryani', 'Chicken Curry Meal', 'Paneer Butter Masala Combo',
            'Dal Makhani with Rice', 'Hyderabadi Chicken Biryani', 'Mutton Rogan Josh',
            'Aloo Gobi with Roti', 'Chole Bhature', 'Rajma Chawal', 'Chicken Korma',
            'Kadhi Chawal', 'Dum Aloo', 'Matar Paneer', 'Palak Paneer', 'Butter Chicken',
        ]
        for name in hot_food_names:
            slug = name.lower().replace(' ', '-').replace('--', '-')
            products_to_create.append({
                'name': name,
                'slug': slug,
                'category': hot_foods_category,
                'description': f'Freshly prepared {name.lower()} for a hearty meal.',
                'price': Decimal(str(random.randint(180, 400) * 5 / 5)),
                'weight': 'Portion',
                'stock_quantity': random.randint(10, 50),
                 'is_available': True,
            })
        
        self.stdout.write(f'Attempting to create {len(products_to_create)} products...')

        for product_data in products_to_create:
            try:
                product, created = Product.objects.get_or_create(
                    slug=product_data['slug'],
                    defaults=product_data
                )
                if created:
                    self.stdout.write(f'Created product: {product.name} ({product.category.name})')
                else:
                    self.stdout.write(f'Product already exists: {product.name}')
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error creating product {product_data["name"]}: {e}'))

        self.stdout.write(self.style.SUCCESS('Initial data setup completed!'))
        self.stdout.write(self.style.SUCCESS(f'Total products in database: {Product.objects.count()}'))