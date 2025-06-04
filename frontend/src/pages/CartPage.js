import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Clock, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../App';

const CartPage = () => {
  const { cartItems, cartTotal, updateCartItem } = useCart();
  const navigate = useNavigate();

  const deliveryFee = 40;
  const subtotal = cartTotal - deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center page-transition">
        <div className="text-9xl mb-8 animate-bounce-gentle">🛒</div>
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Your cart is empty
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Looks like you haven't added any delicious items to your cart yet. 
          Let's fix that!
        </p>
        <button
          onClick={() => navigate('/menu')}
          className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2 group"
        >
          <ShoppingBag className="h-5 w-5" />
          Browse Menu 
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Your Cart</h1>
        <p className="text-gray-600">Review your items and proceed to checkout</p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, index) => (
            <div 
              key={item.product_id} 
              className="card p-6 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                {/* Product Image */}
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">
                    {item.name.includes('Pickle') && '🥭'}
                    {item.name.includes('Jamun') && '🍮'}
                    {item.name.includes('Chole') && '🍛'}
                    {item.name.includes('Samosa') && '🥟'}
                    {item.name.includes('Dal') && '🍛'}
                    {item.name.includes('Katli') && '🍮'}
                    {!item.name.match(/(Pickle|Jamun|Chole|Samosa|Dal|Katli)/) && '🍽️'}
                  </span>
                </div>
                
                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.weight}</p>
                  <p className="text-orange-600 font-semibold">₹{item.price}</p>
                  
                  {/* Quick Actions */}
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      ✓ <span>In stock</span>
                    </span>
                    <span className="text-xs text-orange-600 flex items-center gap-1">
                      🔥 <span>Popular</span>
                    </span>
                  </div>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                  <button
                    onClick={() => updateCartItem(item.product_id, item.quantity - 1)}
                    className="quantity-btn bg-white text-gray-600 hover:text-orange-600 hover:bg-orange-50 shadow-sm"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-semibold text-lg min-w-[40px] text-center text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartItem(item.product_id, item.quantity + 1)}
                    className="quantity-btn bg-white text-gray-600 hover:text-orange-600 hover:bg-orange-50 shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Price and Remove */}
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="font-bold text-xl text-gray-900">₹{item.subtotal}</p>
                  <button
                    onClick={() => updateCartItem(item.product_id, 0)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Summary */}
        <div className="card p-6 h-fit sticky top-8">
          <h3 className="font-semibold text-xl mb-6 flex items-center gap-2">
            <span>📋</span>
            Order Summary
          </h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Delivery Fee
              </span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-₹0</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span className="gradient-text">₹{cartTotal}</span>
              </div>
            </div>
          </div>

          {/* Promo Code */}
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                className="input-field text-sm"
              />
              <button className="btn-secondary px-4 py-2 text-sm whitespace-nowrap">
                Apply
              </button>
            </div>
          </div>
          
          <button className="btn-primary w-full text-lg py-4 mb-4 flex items-center justify-center gap-2 group">
            Proceed to Checkout
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          {/* Delivery Info */}
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span>Delivery in 30-45 mins</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span>🔒</span>
              <span>Secure checkout</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span>💳</span>
              <span>Multiple payment options</span>
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="mt-6 pt-6 border-t text-center">
            <button
              onClick={() => navigate('/menu')}
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
