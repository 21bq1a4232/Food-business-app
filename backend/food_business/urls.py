from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        'message': 'Welcome to Svadishta Food Business API',
        'endpoints': {
            'products': '/api/products/',
            'cart': '/api/cart/',
            'auth': '/api/auth/',
            'orders': '/api/orders/',
            'admin': '/admin/',
        },
        'frontend': 'http://localhost:3000'
    })

urlpatterns = [
    path('', api_root, name='api-root'),  # ← Add root URL
    path('admin/', admin.site.urls),
    path('api/products/', include('products.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/auth/', include('users.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/payments/', include('payments.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)