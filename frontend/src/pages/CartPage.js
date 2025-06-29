import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Clock, Trash2, ShoppingBag, ArrowRight, ChevronDown } from 'lucide-react';
import { useCart } from '../App';

const WeightDropdown = ({ weightOptions, selectedWeight, onSelect, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors bg-white text-sm"
      >
        <span className="font-medium">{selectedWeight}</span>
        <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
          {weightOptions.map((option) => (
            <button
              key={option.weight}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-orange-50 flex items-center justify-between border-b border-gray-100 last:border-b-0 text-sm"
            >
              <span>{option.weight}</span>
              <span className="text-orange-600 font-semibold">₹{option.price}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CartPage = () => {
  const { cartItems, cartTotal, updateCartItem, changeCartItemWeight } = useCart();
  const navigate = useNavigate();

  const deliveryFee = 40;
  const subtotal = cartTotal - deliveryFee;

  // Helper function to ensure full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/media/')) {
      return `http://localhost:8000${imagePath}`;
    }
    return imagePath;
  };

  // Debug: Log cart items to see what data we're getting
  console.log('Cart items:', cartItems);
  
  // Debug: Log each item's product_image specifically
  cartItems.forEach((item, index) => {
    console.log(`Item ${index} product_image:`, item.product_image);
    console.log(`Item ${index} full object:`, item);
  });

  const handleWeightChange = (item, newWeightOption) => {
    console.log('Weight change requested:', { item, newWeightOption });
    // This function will update the cart item with new weight and price
    if (changeCartItemWeight) {
      changeCartItemWeight(item.product_id, item.selected_weight, newWeightOption.weight, item.quantity);
    } else {
      console.error('changeCartItemWeight function not available');
    }
  };

  const handleQuantityUpdate = (productId, newQuantity, selectedWeight) => {
    console.log('Quantity update requested:', { productId, newQuantity, selectedWeight });
    if (updateCartItem) {
      updateCartItem(productId, newQuantity, selectedWeight);
    } else {
      console.error('updateCartItem function not available');
    }
  };

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
              key={`${item.product_id}_${item.selected_weight}`}
              className="card p-6 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                {/* Product Image */}
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  {item.product_image ? (
                    <img 
                      src={getFullImageUrl(item.product_image)} 
                      alt={item.product_name} 
                      className="w-full h-full object-cover rounded-xl"
                      onLoad={() => console.log('Image loaded successfully:', item.product_image)}
                      onError={(e) => console.error('Image failed to load:', item.product_image, e)}
                    />
                  ) : (
                    <span className="text-2xl">
                      {item.product_name && item.product_name.includes('Pickle') && '🥭'}
                      {item.product_name && item.product_name.includes('Jamun') && '🍮'}
                      {item.product_name && item.product_name.includes('Chole') && '🍛'}
                      {item.product_name && item.product_name.includes('Samosa') && '🥟'}
                      {item.product_name && item.product_name.includes('Dal') && '🍛'}
                      {item.product_name && item.product_name.includes('Katli') && '🍮'}
                      {(!item.product_name || !item.product_name.match(/(Pickle|Jamun|Chole|Samosa|Dal|Katli)/)) && '🍽️'}
                    </span>
                  )}
                </div>
                
                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {item.product_name || 'Product'}
                  </h3>
                  
                  {/* Weight Display */}
                  <div className="flex items-center gap-2 mt-1 mb-2">
                    <span className="text-sm text-gray-600">Weight:</span>
                    <span className="text-sm font-medium text-gray-700">
                      {item.selected_weight || 'N/A'}
                    </span>
                  </div>
                  
                  <p className="text-orange-600 font-semibold">
                    ₹{item.price} per {item.selected_weight}
                  </p>
                  
                  {/* Category Badge */}
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      ✓ <span>In stock</span>
                    </span>
                    {item.category_name && (
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        {item.category_name}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                  <button
                    onClick={() => handleQuantityUpdate(
                      item.product_id, 
                      item.quantity - 1, 
                      item.selected_weight
                    )}
                    className="quantity-btn bg-white text-gray-600 hover:text-orange-600 hover:bg-orange-50 shadow-sm w-8 h-8 rounded-lg flex items-center justify-center"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-semibold text-lg min-w-[40px] text-center text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityUpdate(
                      item.product_id, 
                      item.quantity + 1, 
                      item.selected_weight
                    )}
                    className="quantity-btn bg-white text-gray-600 hover:text-orange-600 hover:bg-orange-50 shadow-sm w-8 h-8 rounded-lg flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Price and Remove */}
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="font-bold text-xl text-gray-900">₹{item.subtotal}</p>
                  <button
                    onClick={() => handleQuantityUpdate(
                      item.product_id, 
                      0, 
                      item.selected_weight
                    )}
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
                className="input-field text-sm flex-1 px-3 py-2 border border-gray-200 rounded-lg"
              />
              <button className="btn-secondary px-4 py-2 text-sm whitespace-nowrap bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Apply
              </button>
            </div>
          </div>
          
          <button className="btn-primary w-full text-lg py-4 mb-4 flex items-center justify-center gap-2 group bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600">
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