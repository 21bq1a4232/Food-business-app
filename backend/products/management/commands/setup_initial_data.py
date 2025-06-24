# # from django.core.management.base import BaseCommand
# # from products.models import Category, Product
# # from decimal import Decimal

# # class Command(BaseCommand):
# #     help = 'Setup initial data for the food business'

# #     def handle(self, *args, **options):
# #         # Create categories
# #         categories = [
# #             {'name': 'Pickles', 'slug': 'pickles', 'description': 'Traditional homemade pickles'},
# #             {'name': 'Sweets', 'slug': 'sweets', 'description': 'Delicious Indian sweets'},
# #             {'name': 'Hot Foods', 'slug': 'hot-foods', 'description': 'Fresh hot meals'},
# #         ]
        
# #         for cat_data in categories:
# #             category, created = Category.objects.get_or_create(
# #                 slug=cat_data['slug'], 
# #                 defaults=cat_data
# #             )
# #             if created:
# #                 self.stdout.write(f'Created category: {category.name}')
        
# #         # Create sample products
# #         pickle_category = Category.objects.get(slug='pickles')
# #         sweets_category = Category.objects.get(slug='sweets')
        
# #         products = [
# #             {
# #                 'name': 'Mango Pickle',
# #                 'slug': 'mango-pickle',
# #                 'category': pickle_category,
# #                 'description': 'Traditional mango pickle with authentic spices',
# #                 'price': Decimal('150.00'),
# #                 'weight': '500g',
# #                 'stock_quantity': 50,
# #             },
# #             {
# #                 'name': 'Gulab Jamun',
# #                 'slug': 'gulab-jamun',
# #                 'category': sweets_category,
# #                 'description': 'Soft and sweet gulab jamun',
# #                 'price': Decimal('120.00'),
# #                 'weight': '500g',
# #                 'stock_quantity': 30,
# #             },
# #         ]
        
# #         for product_data in products:
# #             product, created = Product.objects.get_or_create(
# #                 slug=product_data['slug'],
# #                 defaults=product_data
# #             )
# #             if created:
# #                 self.stdout.write(f'Created product: {product.name}')
        
# #         self.stdout.write(self.style.SUCCESS('Initial data setup completed!'))

# # products/management/commands/setup_data.py

# from django.core.management.base import BaseCommand
# from products.models import Category, Product
# from decimal import Decimal
# import random

# class Command(BaseCommand):
#     help = 'Setup initial data for the food business with at least 40 products.'

#     def handle(self, *args, **options):
#         self.stdout.write(self.style.SUCCESS('Starting initial data setup...'))

#         # Create categories if they don't exist
#         categories_data = [
#             {'name': 'Pickles', 'slug': 'pickles', 'description': 'Traditional homemade pickles'},
#             {'name': 'Sweets', 'slug': 'sweets', 'description': 'Delicious Indian sweets'},
#             {'name': 'Hot Foods', 'slug': 'hot-foods', 'description': 'Fresh hot meals, ready to eat'},
#         ]
        
#         for cat_data in categories_data:
#             category, created = Category.objects.get_or_create(
#                 slug=cat_data['slug'], 
#                 defaults=cat_data
#             )
#             if created:
#                 self.stdout.write(f'Created category: {category.name}')
#             else:
#                 self.stdout.write(f'Category already exists: {category.name}')
        
#         # Get category objects
#         pickle_category = Category.objects.get(slug='pickles')
#         sweets_category = Category.objects.get(slug='sweets')
#         hot_foods_category = Category.objects.get(slug='hot-foods')

#         # Generate sample products (aiming for over 40)
#         products_to_create = []

#         # Pickles (15 items)
#         pickle_names = [
#             'Traditional Mango Pickle', 'Spicy Mixed Vegetable Pickle', 'Lemon Ginger Pickle',
#             'Garlic Pickle', 'Green Chilli Pickle', 'Tomato Pickle', 'Amla Pickle',
#             'Red Chilli Pickle', 'Carrot Pickle', 'Cauliflower Pickle', 'Brinjal Pickle',
#             'Gongura Pickle', 'Drumstick Pickle', 'Bitter Gourd Pickle', 'Hyderabadi Mango Pickle',
#         ]
#         for name in pickle_names:
#             slug = name.lower().replace(' ', '-').replace('--', '-')
#             products_to_create.append({
#                 'name': name,
#                 'slug': slug,
#                 'category': pickle_category,
#                 'description': f'A {name.lower()} made with authentic spices and fresh ingredients.',
#                 'price': Decimal(str(random.randint(100, 250) * 5 / 5)),
#                 'weight': f'{random.choice([250, 500, 750, 1000])}g',
#                 'stock_quantity': random.randint(20, 100),
#                 'is_available': True,
#             })

#         # Sweets (15 items)
#         sweet_names = [
#             'Classic Gulab Jamun', 'Rasgulla', 'Kaju Katli', 'Mysore Pak', 'Jalebi',
#             'Boondi Laddu', 'Mohan Thal', 'Balushahi', 'Ghewar', 'Petha',
#             'Coconut Laddu', 'Motichoor Laddu', 'Shahi Tukda', 'Basundi', 'Cham Cham',
#         ]
#         for name in sweet_names:
#             slug = name.lower().replace(' ', '-').replace('--', '-')
#             products_to_create.append({
#                 'name': name,
#                 'slug': slug,
#                 'category': sweets_category,
#                 'description': f'Delicious {name.lower()} prepared with traditional recipes.',
#                 'price': Decimal(str(random.randint(150, 300) * 5 / 5)),
#                 'weight': f'{random.choice([250, 500, 750])}g',
#                 'stock_quantity': random.randint(15, 80),
#                 'is_available': True,
#             })

#         # Hot Foods (15 items - to ensure over 40 total)
#         hot_food_names = [
#             'Vegetable Biryani', 'Chicken Curry Meal', 'Paneer Butter Masala Combo',
#             'Dal Makhani with Rice', 'Hyderabadi Chicken Biryani', 'Mutton Rogan Josh',
#             'Aloo Gobi with Roti', 'Chole Bhature', 'Rajma Chawal', 'Chicken Korma',
#             'Kadhi Chawal', 'Dum Aloo', 'Matar Paneer', 'Palak Paneer', 'Butter Chicken',
#         ]
#         for name in hot_food_names:
#             slug = name.lower().replace(' ', '-').replace('--', '-')
#             products_to_create.append({
#                 'name': name,
#                 'slug': slug,
#                 'category': hot_foods_category,
#                 'description': f'Freshly prepared {name.lower()} for a hearty meal.',
#                 'price': Decimal(str(random.randint(180, 400) * 5 / 5)),
#                 'weight': 'Portion',
#                 'stock_quantity': random.randint(10, 50),
#                  'is_available': True,
#             })
        
#         self.stdout.write(f'Attempting to create {len(products_to_create)} products...')

#         for product_data in products_to_create:
#             try:
#                 product, created = Product.objects.get_or_create(
#                     slug=product_data['slug'],
#                     defaults=product_data
#                 )
#                 if created:
#                     self.stdout.write(f'Created product: {product.name} ({product.category.name})')
#                 else:
#                     self.stdout.write(f'Product already exists: {product.name}')
#             except Exception as e:
#                 self.stdout.write(self.style.ERROR(f'Error creating product {product_data["name"]}: {e}'))

#         self.stdout.write(self.style.SUCCESS('Initial data setup completed!'))
#         self.stdout.write(self.style.SUCCESS(f'Total products in database: {Product.objects.count()}'))


# products/management/commands/migrate_products_data.py

from django.core.management.base import BaseCommand
from products.models import Category, Product
from decimal import Decimal
import json
import ast

class Command(BaseCommand):
    help = 'Migrate existing product data from old database structure to new Django models'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be migrated without actually creating records'
        )

    def handle(self, *args, **options):
        dry_run = options.get('dry_run', False)
        
        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN MODE - No data will be created'))
        
        # First, create the categories based on the category_id mapping from your data
        categories_data = [
            {'id': 1, 'name': 'Pickles', 'slug': 'pickles', 'description': 'Traditional homemade pickles'},
            {'id': 2, 'name': 'Sweets', 'slug': 'sweets', 'description': 'Delicious Indian sweets and desserts'},
            {'id': 3, 'name': 'Snacks', 'slug': 'snacks', 'description': 'Crispy and tasty snacks'},
            {'id': 4, 'name': 'Spice Powders', 'slug': 'spice-powders', 'description': 'Authentic spice powders and kaaram'},
        ]
        
        # Create categories
        for cat_data in categories_data:
            if not dry_run:
                category, created = Category.objects.get_or_create(
                    id=cat_data['id'],
                    defaults={
                        'name': cat_data['name'],
                        'slug': cat_data['slug'],
                        'description': cat_data['description'],
                        'is_active': True
                    }
                )
                if created:
                    self.stdout.write(f'Created category: {category.name}')
                else:
                    self.stdout.write(f'Category already exists: {category.name}')
            else:
                self.stdout.write(f'Would create category: {cat_data["name"]}')

        # Your existing product data (from paste.txt)
        # Format: id, name, slug, description, image, stock_quantity, is_available, is_featured, 
        #         created_at, updated_at, category_id, available_weights, base_price, is_seasonal
        existing_products = [
            (3, "Chicken Pickle ( Boneless )", "chicken-pickle-boneless", "This is a good pickle", "products/chicken_boneless.jpeg", 100, True, True, "2025-06-03 22:33:48.557078+05:30", "2025-06-08 17:28:18.574133+05:30", 1, '["500g", "1kg"]', 1000.00, False),
            (49, "Avakaya Pickle", "traditional-mango-pickle", "A traditional mango pickle made with authentic spices and fresh ingredients.", "products/Andhra_Avakaya_Mango_Pickle.jpeg", 35, True, True, "2025-06-04 12:29:55.10339+05:30", "2025-06-08 16:01:28.249632+05:30", 1, '["500g", "1kg"]', 440.00, True),
            (51, "Nimmakaya Pickle", "nimmakaya-pickle", "A lemon pickle made with authentic spices and fresh ingredients.", "products/WhatsApp_Image_2025-06-08_at_16.28.34.jpeg", 75, True, True, "2025-06-04 12:29:55.107399+05:30", "2025-06-08 16:28:52.852955+05:30", 1, '["500g", "1kg"]', 420.00, False),
            (52, "Allam Pickle", "Allam-pickle", "A allam pickle made with authentic spices and fresh ingredients.", "products/Allam_Pickle.png", 20, True, True, "2025-06-04 12:29:55.108648+05:30", "2025-06-15 21:39:50.74852+05:30", 1, '["500g", "1kg"]', 420.00, False),
            (53, "Pandu Mirapakaya Pickle", "pandu-chilli-pickle", "A Red chilli pickle made with authentic spices and fresh ingredients.", "", 66, True, True, "2025-06-04 12:29:55.10966+05:30", "2025-06-08 16:08:07.323167+05:30", 1, '["500g", "1kg"]', 500.00, True),
            (54, "Tomato Pickle", "tomato-pickle", "A tomato pickle made with authentic spices and fresh ingredients.", "products/Tomato_Pickle1.PNG", 64, True, False, "2025-06-04 12:29:55.110978+05:30", "2025-06-08 18:15:08.96301+05:30", 1, '["500g", "1kg"]', 400.00, False),
            (55, "Usirikaya Pickle", "Usirikaya-pickle", "A amla pickle made with authentic spices and fresh ingredients.", "products/amla_pickle.jpeg", 45, True, True, "2025-06-04 12:29:55.111785+05:30", "2025-06-08 19:29:30.733974+05:30", 1, '["500g", "1kg", "2kg"]', 500.00, True),
            (56, "chikkudukaya pickle", "chikkudukaya-pickle", "A chikkudukaya pickle made with authentic spices and fresh ingredients.", "products/chikkudukaya.png", 90, True, True, "2025-06-04 12:29:55.112781+05:30", "2025-06-15 21:40:49.906124+05:30", 1, '["500g", "1kg"]', 500.00, True),
            (58, "Cauliflower Pickle", "cauliflower-pickle", "A cauliflower pickle made with authentic spices and fresh ingredients.", "products/cauliflower.jpg", 54, True, True, "2025-06-04 12:29:55.114565+05:30", "2025-06-15 21:40:24.554602+05:30", 1, '["500g", "1kg"]', 500.00, True),
            (61, "Prawns Pickle", "Pranws-pickle", "A Prawns pickle made with authentic spices and fresh ingredients.", "products/prawns_1.png", 76, True, True, "2025-06-04 12:29:55.117629+05:30", "2025-06-08 19:30:52.82451+05:30", 1, '["500g", "1kg"]', 1500.00, False),
            (62, "Karivepaku Kaaram Podi", "karivepaku-kaaram-podi", "A Karivepaku Kaaram Podi made with authentic spices and fresh ingredients.", "products/Karivepaku_kaaram.png", 74, True, True, "2025-06-04 12:29:55.118533+05:30", "2025-06-08 19:41:55.465595+05:30", 4, '["500g", "1kg"]', 360.00, False),
            (95, "Nalla Kaaram Podi", "nalla-kaaram-podi", "A nalla kaaram podi made with authentic spices and fresh ingredients.", "products/Nalla_Kaaram.png", 40, True, False, "2025-06-07 19:38:19.207321+05:30", "2025-06-08 23:22:25.332304+05:30", 4, '["500g", "1kg"]', 360.00, False),
            (96, "Putnala Kaaram Podi", "putnala-kaaram-podi", "It is an authentic spices", "products/Putnala_Podi.jpeg", 94, True, True, "2025-06-07 19:38:19.209949+05:30", "2025-06-08 23:21:47.55808+05:30", 4, '["500g", "1kg"]', 380.00, False),
            (97, "Guntur Kaaram", "guntur-kaaram", "A natural made karam made from guntur mirchi", "products/red_chili.jpeg", 82, True, False, "2025-06-07 19:38:19.21071+05:30", "2025-06-08 15:57:34.261686+05:30", 4, '["500g", "1kg"]', 450.00, False),
            (98, "Chicken Pickle ( Bone)", "Chicken-Pickle-Bone", "A chicken pickle made with authentic spices and fresh ingredients.", "", 89, True, True, "2025-06-07 19:38:19.211668+05:30", "2025-06-08 16:06:24.526338+05:30", 1, '["500g", "1kg"]', 850.00, False),
            (129, "Murukulu", "murukulu", "murukulu", "", 30, True, False, "2025-06-08 17:00:22.133943+05:30", "2025-06-08 17:01:31.6882+05:30", 3, '["500g", "1kg"]', 450.00, False),
            (130, "Chekkalu", "chekkalu", "Chekkalu", "", 30, True, False, "2025-06-08 17:02:51.526237+05:30", "2025-06-08 17:02:51.526263+05:30", 3, '["500g", "1kg"]', 450.00, False),
            (131, "Karapusa", "karapusa", "karapusa", "", 20, True, False, "2025-06-08 17:03:43.811874+05:30", "2025-06-08 17:03:43.811892+05:30", 3, '["500g", "1kg"]', 450.00, False),
            (132, "Kaaram Boondi", "boondi", "boondi", "products/kaaram_bondi.png", 20, True, False, "2025-06-08 17:04:12.8137+05:30", "2025-06-08 19:38:21.889659+05:30", 3, '["500g", "1kg"]', 440.00, False),
            (133, "Jantikalu", "jantikalu", "jantikalu", "", 20, True, False, "2025-06-08 17:04:48.280493+05:30", "2025-06-08 17:04:48.280523+05:30", 3, '["500g", "1kg"]', 450.00, False),
            (134, "Chekka Pakodi", "chekka-pakodi", "chekka padodi", "products/Chekka_Pakodi.JPG", 10, True, False, "2025-06-08 17:05:22.891276+05:30", "2025-06-08 18:54:42.497056+05:30", 3, '["500g", "1kg"]', 450.00, False),
            (135, "Dry fruit laddu", "dry-fruit-laddu", "dry fruit laddu", "products/Dry_fruit_.png", 10, True, False, "2025-06-08 17:08:51.695049+05:30", "2025-06-08 20:25:15.19959+05:30", 2, '["500g", "1kg"]', 1100.00, False),
            (136, "Nethi Ariselu", "nethi-ariselu", "nethi ariselu", "", 10, True, True, "2025-06-08 17:09:26.452035+05:30", "2025-06-08 23:28:34.807538+05:30", 2, '["500g", "1kg"]', 700.00, False),
            (137, "Sunnundalu", "sunnundalu", "sunnundalu", "", 10, True, False, "2025-06-08 17:09:59.769414+05:30", "2025-06-08 17:24:52.735909+05:30", 2, '["500g", "1kg"]', 560.00, False),
            (138, "Gavvalu", "gavvalu", "gavvalu", "", 10, True, False, "2025-06-08 17:10:58.252898+05:30", "2025-06-08 17:10:58.252925+05:30", 2, '["500g", "1kg"]', 440.00, False),
            (139, "Boondi Mithai", "boondi-mithai", "boondi mithai", "", 10, True, False, "2025-06-08 17:11:45.361623+05:30", "2025-06-08 17:22:25.813121+05:30", 2, '["500g", "1kg"]', 420.00, False),
            (140, "Boondi Laddu", "boondi-laddu", "boondi laddu", "products/Laddo_22.png", 10, True, False, "2025-06-08 17:12:29.103072+05:30", "2025-06-08 19:04:09.596646+05:30", 2, '["500g", "1kg"]', 420.00, False),
            (141, "Nuvvula Laddu", "nuvvula-laddu", "nuvvula laddu", "", 10, True, False, "2025-06-08 17:13:05.981819+05:30", "2025-06-08 17:20:32.858575+05:30", 2, '["500g", "1kg"]', 440.00, False),
            (142, "Boorelu", "boorelu", "boorelu", "", 10, True, False, "2025-06-08 17:13:30.026336+05:30", "2025-06-08 17:13:30.026362+05:30", 2, '["500g", "1kg"]', 400.00, False),
            (143, "Kajjikayalu", "kajjikayalu", "kajjikayalu", "products/kajjakaya.JPG", 10, True, False, "2025-06-08 17:14:04.773642+05:30", "2025-06-08 19:31:45.893616+05:30", 2, '["500g", "1kg"]', 460.00, False),
            (144, "Ravva Laddu", "ravva-laddu", "ravva laddu", "products/Ravva_Laddu.png", 10, True, False, "2025-06-08 17:14:40.488223+05:30", "2025-06-08 23:22:06.808362+05:30", 2, '["500g", "1kg"]', 420.00, False),
            (145, "Palli Chekka", "palli-chekka", "palli chekka", "products/Palli_chekka.png", 10, True, False, "2025-06-08 17:15:41.430403+05:30", "2025-06-08 19:52:11.412931+05:30", 2, '["500g", "1kg"]', 420.00, False),
            (146, "Kobbari Vundalu", "kobbari-vundalu", "kobbari vundalu", "products/kobbari_vundalu.webp", 10, True, False, "2025-06-08 17:23:48.983143+05:30", "2025-06-08 23:26:31.622964+05:30", 2, '["500g", "1kg"]', 440.00, False),
        ]

        self.stdout.write(f'Found {len(existing_products)} products to migrate')

        # Migrate products
        migrated_count = 0
        error_count = 0

        for product_data in existing_products:
            try:
                (id_val, name, slug, description, image, stock_quantity, is_available, 
                 is_featured, created_at, updated_at, category_id, available_weights_str, 
                 base_price, is_seasonal) = product_data

                # Parse the available_weights JSON string
                try:
                    # Handle both string representations: '["500g", "1kg"]' and ["500g", "1kg"]
                    if isinstance(available_weights_str, str):
                        available_weights = ast.literal_eval(available_weights_str)
                    else:
                        available_weights = available_weights_str
                except (ValueError, SyntaxError):
                    # Fallback to default weights if parsing fails
                    available_weights = ["500g", "1kg"]
                    self.stdout.write(self.style.WARNING(f'Could not parse weights for {name}, using default'))

                # Get the category
                try:
                    if not dry_run:
                        category = Category.objects.get(id=category_id)
                    else:
                        category = None
                except Category.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f'Category with id {category_id} not found for product {name}'))
                    error_count += 1
                    continue

                if not dry_run:
                    # Create or update the product
                    product, created = Product.objects.get_or_create(
                        slug=slug,
                        defaults={
                            'category': category,
                            'name': name,
                            'description': description,
                            'image': image if image else None,
                            'base_price': Decimal(str(base_price)),
                            'available_weights': available_weights,
                            'stock_quantity': stock_quantity,
                            'is_available': is_available,
                            'is_featured': is_featured,
                            'is_seasonal': is_seasonal,
                        }
                    )

                    if created:
                        self.stdout.write(f'✓ Created product: {product.name} (Category: {product.category.name})')
                        migrated_count += 1
                    else:
                        # Update existing product
                        product.category = category
                        product.name = name
                        product.description = description
                        if image:
                            product.image = image
                        product.base_price = Decimal(str(base_price))
                        product.available_weights = available_weights
                        product.stock_quantity = stock_quantity
                        product.is_available = is_available
                        product.is_featured = is_featured
                        product.is_seasonal = is_seasonal
                        product.save()
                        self.stdout.write(f'↻ Updated product: {product.name} (Category: {product.category.name})')
                        migrated_count += 1
                else:
                    # Dry run - just show what would be created
                    category_name = {1: 'Pickles', 2: 'Sweets', 3: 'Snacks', 4: 'Spice Powders'}.get(category_id, 'Unknown')
                    self.stdout.write(f'Would create/update: {name} (Category: {category_name}, Price: ₹{base_price}, Stock: {stock_quantity})')
                    migrated_count += 1

            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error processing product {name}: {str(e)}'))
                error_count += 1

        # Summary
        self.stdout.write(self.style.SUCCESS(f'\n=== Migration Summary ==='))
        if dry_run:
            self.stdout.write(f'Products that would be migrated: {migrated_count}')
        else:
            self.stdout.write(f'Products successfully migrated: {migrated_count}')
            self.stdout.write(f'Total products in database: {Product.objects.count()}')
        
        if error_count > 0:
            self.stdout.write(self.style.ERROR(f'Errors encountered: {error_count}'))
        
        if not dry_run:
            self.stdout.write(self.style.SUCCESS('Migration completed successfully!'))
        else:
            self.stdout.write(self.style.WARNING('Dry run completed. Use without --dry-run to actually migrate the data.'))