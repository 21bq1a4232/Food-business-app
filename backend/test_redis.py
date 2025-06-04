import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'food_business.settings')
django.setup()

from django.core.cache import cache
import redis

print("Testing Redis setup...")

# Test 1: Direct Redis connection
try:
    r = redis.Redis(host='127.0.0.1', port=6379, db=1)
    r.ping()
    print("✅ Direct Redis connection: OK")
except Exception as e:
    print(f"❌ Direct Redis connection failed: {e}")

# Test 2: Django cache
try:
    cache.set('django_test', 'working', 30)
    result = cache.get('django_test')
    if result == 'working':
        print("✅ Django cache (Redis): OK")
    else:
        print("❌ Django cache failed")
except Exception as e:
    print(f"❌ Django cache failed: {e}")

# Test 3: Cart simulation
try:
    from cart.services import CartService
    cart_service = CartService(user_id=1)
    cart = cart_service.get_cart()
    print("✅ Cart service: OK")
except Exception as e:
    print(f"❌ Cart service failed: {e}")

print("Redis test complete!")
