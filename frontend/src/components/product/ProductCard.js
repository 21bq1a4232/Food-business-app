import React, { useState } from 'react';
import { Plus, Minus, Heart, Star } from 'lucide-react';
import { useCart } from '../../App';

const ProductCard = ({ product }) => {
  const { addToCart, updateCartItem, isLoading } = useCart();
  const [quantity, setQuantity] = useState(0);

  const handleAddToCart = async () => {
    await addToCart(product, 1);
    setQuantity(quantity + 1);
  };

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 0) return;
    setQuantity(newQuantity);
    await updateCartItem(product.id, newQuantity);
  };

  const categoryEmojis = {
    'Pickles': '🥭',
    'Sweets': '🍮',
    'Hot Foods': '🍛',
    'Dry Snacks': '🥟'
  };

  return (
    <div className="food-card group">
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
        <span className="text-6xl opacity-80">
          {categoryEmojis[product.category_name] || '🍽️'}
        </span>
        
        {/* Quick Add Button */}
        <button
          onClick={handleAddToCart}
          disabled={isLoading || !product.is_in_stock}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 disabled:opacity-50"
        >
          <Plus className="h-4 w-4 text-orange-600" />
        </button>

        {/* Stock Badge */}
        {!product.is_in_stock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="badge-danger">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
          <button className="text-gray-400 hover:text-red-500 transition-colors">
            <Heart className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{product.weight}</p>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-sm text-gray-500 ml-1">(4.8)</span>
        </div>

        {/* Price and Quantity */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
          </div>
          
          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={isLoading || !product.is_in_stock}
              className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add +'}
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-orange-50 rounded-lg p-1">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="p-1 hover:bg-orange-100 rounded transition-colors"
                disabled={isLoading}
              >
                <Minus className="h-4 w-4 text-orange-600" />
              </button>
              <span className="font-semibold text-orange-600 min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="p-1 hover:bg-orange-100 rounded transition-colors"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 text-orange-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
