from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, login_view, AddressListCreateView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login_view, name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('addresses/', AddressListCreateView.as_view(), name='addresses'),
]