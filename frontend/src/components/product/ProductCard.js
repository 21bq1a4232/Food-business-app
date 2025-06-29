import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, ShoppingCart, Image, ChevronDown } from 'lucide-react';
import { useCart } from '../../App';
import toast from 'react-hot-toast';
// Add this function at the top of your component file

const MinimalWeightDropdown = ({ weightOptions, selectedWeight, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 shadow-sm"
      >
        <span className="font-semibold">{selectedWeight?.weight || 'Select Weight'}</span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[200px]">
          <div className="py-2">
            {weightOptions && weightOptions.length > 0 ? (
              weightOptions.map((option, index) => (
                <button
                  key={option.weight}
                  onClick={() => {
                    onSelect(option);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedWeight?.weight === option.weight 
                      ? 'bg-orange-50 text-orange-600 font-semibold' 
                      : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{option.weight}</div>
                      <div className="text-xs text-gray-500">{option.display}</div>
                    </div>
                    <div className="text-sm font-semibold text-orange-600">
                      ₹{parseFloat(option.price).toFixed(0)}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No weight options available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const EnhancedProductCard = ({ product }) => {
  // Set default selected weight to 1kg if available, otherwise first available option
  const getDefaultWeight = (weightOptions) => {
    if (!weightOptions || weightOptions.length === 0) return null;
    
    // Try to find 1kg option first
    const oneKgOption = weightOptions.find(option => 
      option.weight.toLowerCase().includes('1kg') || 
      option.weight.toLowerCase().includes('1 kg') ||
      option.weight.toLowerCase().includes('1000g') ||
      option.weight.toLowerCase().includes('1000 g')
    );
    
    // Return 1kg option if found, otherwise return first option
    return oneKgOption || weightOptions[0];
  };
  
  const [selectedWeight, setSelectedWeight] = useState(getDefaultWeight(product.weight_options));
  const { cartItems, addToCart, updateCartItem } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Find cart item with this product and weight combination
  const cartItem = cartItems.find(item => 
    item.product_id === product.id && item.selected_weight === selectedWeight?.weight
  );
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    if (!selectedWeight) {
      toast.error('Please select a weight option');
      return;
    }
    
    if (quantity === 0) {
      // Pass complete product info including weight options
      const productInfo = {
        id: product.id,
        name: product.name,
        weight_options: product.weight_options, // Include all weight options
      };
      addToCart(product.id, 1, selectedWeight, productInfo);
    } else {
      updateCartItem(product.id, quantity + 1, selectedWeight.weight);
    }
  };

  const handleDecrement = () => {
    if (!selectedWeight) return;
    
    if (quantity > 1) {
      updateCartItem(product.id, quantity - 1, selectedWeight.weight);
    } else {
      updateCartItem(product.id, 0, selectedWeight.weight);
      toast.success(`${product.name} (${selectedWeight.weight}) removed from cart`);
    }
  };

  const imageUrl = product.image_url || product.image;

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  // Handle products without weight options (backward compatibility)
  if (!product.weight_options || product.weight_options.length === 0) {
    return (
      <div className="card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white rounded-2xl overflow-hidden">
        <div className="p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
          <p className="text-gray-500">Weight options not configured</p>
          <p className="text-sm text-gray-400 mt-2">Please contact admin to set up weight options</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white rounded-2xl">
      {/* Enhanced Image Container */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 rounded-t-2xl">
        {/* Seasonal Badge */}
        {product.is_seasonal && (
      <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10 seasonal-pulse-fast">
        🌟 Seasonal
      </div>
)}
        
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200 flex items-center justify-center">
            <Image className="w-8 h-8 text-gray-400" />
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-100 flex flex-col items-center justify-center text-gray-500">
            <Image className="w-12 h-12 mb-2" />
            <span className="text-sm font-medium">{product.name}</span>
            <span className="text-xs text-gray-400">Image coming soon</span>
          </div>
        ) : (
          imageUrl && (
            <img
              src={imageUrl}
              alt={product.name}
              className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                filter: 'contrast(1.15) brightness(1.1) saturate(1.2)',
                imageRendering: 'high-quality',
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          )
        )}
        
        {/* Stock overlay */}
        {!product.is_in_stock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-semibold bg-red-500 px-4 py-2 rounded-lg shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
        
        {/* Category badge */}
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white bg-opacity-90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
            {product.category_name}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
            {product.name}
          </h3>
          
          {/* Minimal Weight Selection with Price on the right */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Weight:</span>
              <MinimalWeightDropdown
                weightOptions={product.weight_options}
                selectedWeight={selectedWeight}
                onSelect={setSelectedWeight}
              />
            </div>
            {selectedWeight && (
              <span className="text-xl font-bold text-orange-600">
                ₹{selectedWeight.price}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        {product.is_in_stock && selectedWeight ? (
          quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-2">
              <button
                onClick={handleDecrement}
                className="bg-white hover:bg-red-50 text-red-500 font-semibold w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-bold text-lg px-4 text-gray-800">
                {quantity}
              </span>
              <button
                onClick={handleAddToCart}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )
        ) : (
          <button disabled className="w-full bg-gray-300 text-gray-500 font-semibold py-3 px-4 rounded-xl cursor-not-allowed">
            {!selectedWeight ? 'Select Weight' : 'Out of Stock'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EnhancedProductCard;