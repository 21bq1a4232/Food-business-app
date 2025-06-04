from django.urls import path
from .views import razorpay_webhook

urlpatterns = [
    path('webhook/', razorpay_webhook, name='payment-webhook'),
]