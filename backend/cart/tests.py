from django.test import TestCase
from django.contrib.auth.models import User
from django.test import Client
from products.models import Category, Product
from .models import Cart, CartItem
from decimal import Decimal

class CartModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.category = Category.objects.create(name='Test Category', slug='test-category')
        self.product = Product.objects.create(
            category=self.category,
            name='Test Product',
            slug='test-product',
            description='Test description',
            base_price=Decimal('100.00'),
            available_weights=['500g', '1kg']
        )
    
    def test_cart_creation(self):
        cart = Cart.objects.create(user=self.user)
        self.assertEqual(cart.user, self.user)
        self.assertEqual(cart.total_items, 0)
        self.assertEqual(cart.subtotal, Decimal('0'))
        self.assertEqual(cart.total_amount, Decimal('0'))
    
    def test_cart_item_creation(self):
        cart = Cart.objects.create(user=self.user)
        cart_item = CartItem.objects.create(
            cart=cart,
            product=self.product,
            selected_weight='500g',
            quantity=2,
            price=Decimal('50.00')
        )
        
        self.assertEqual(cart_item.subtotal, Decimal('100.00'))
        self.assertEqual(cart.total_items, 2)
        self.assertEqual(cart.subtotal, Decimal('100.00'))
        self.assertEqual(cart.total_amount, Decimal('140.00'))  # 100 + 40 delivery fee

class CartAPITest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.category = Category.objects.create(name='Test Category', slug='test-category')
        self.product = Product.objects.create(
            category=self.category,
            name='Test Product',
            slug='test-product',
            description='Test description',
            base_price=Decimal('100.00'),
            available_weights=['500g', '1kg']
        )
    
    def test_get_empty_cart(self):
        response = self.client.get('/api/cart/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['items'], [])
        self.assertEqual(data['total_items'], 0)
        self.assertEqual(data['subtotal'], '0.00')
    
    def test_add_item_to_cart(self):
        response = self.client.post('/api/cart/', {
            'product_id': self.product.id,
            'selected_weight': '500g',
            'quantity': 2
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data['items']), 1)
        self.assertEqual(data['items'][0]['product_id'], self.product.id)
        self.assertEqual(data['items'][0]['selected_weight'], '500g')
        self.assertEqual(data['items'][0]['quantity'], 2)
