// import React, { useState } from 'react';
// import { Plus, Minus, Heart, Star } from 'lucide-react';
// import { useCart } from '../../App';

// const ProductCard = ({ product }) => {
//   const { addToCart, updateCartItem, isLoading } = useCart();
//   const [quantity, setQuantity] = useState(0);

//   const handleAddToCart = async () => {
//     await addToCart(product, 1);
//     setQuantity(quantity + 1);
//   };

//   const handleQuantityChange = async (newQuantity) => {
//     if (newQuantity < 0) return;
//     setQuantity(newQuantity);
//     await updateCartItem(product.id, newQuantity);
//   };

//   const categoryEmojis = {
//     'Pickles': '🥭',
//     'Sweets': '🍮',
//     'Hot Foods': '🍛',
//     'Dry Snacks': '🥟'
//   };

//   return (
//     <div className="food-card group">
//       {/* Product Image */}
//       <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
//         <span className="text-6xl opacity-80">
//           {categoryEmojis[product.category_name] || '🍽️'}
//         </span>
        
//         {/* Quick Add Button */}
//         <button
//           onClick={handleAddToCart}
//           disabled={isLoading || !product.is_in_stock}
//           className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 disabled:opacity-50"
//         >
//           <Plus className="h-4 w-4 text-orange-600" />
//         </button>

//         {/* Stock Badge */}
//         {!product.is_in_stock && (
//           <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//             <span className="badge-danger">Out of Stock</span>
//           </div>
//         )}
//       </div>

//       {/* Product Info */}
//       <div className="p-6">
//         <div className="flex justify-between items-start mb-2">
//           <h3 className="font-semibold text-lg text-gray-900 group-hover:text-orange-600 transition-colors">
//             {product.name}
//           </h3>
//           <button className="text-gray-400 hover:text-red-500 transition-colors">
//             <Heart className="h-5 w-5" />
//           </button>
//         </div>
        
//         <p className="text-gray-600 text-sm mb-3">{product.weight}</p>
        
//         {/* Rating */}
//         <div className="flex items-center gap-1 mb-4">
//           {[...Array(5)].map((_, i) => (
//             <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//           ))}
//           <span className="text-sm text-gray-500 ml-1">(4.8)</span>
//         </div>

//         {/* Price and Quantity */}
//         <div className="flex items-center justify-between">
//           <div>
//             <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
//           </div>
          
//           {quantity === 0 ? (
//             <button
//               onClick={handleAddToCart}
//               disabled={isLoading || !product.is_in_stock}
//               className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
//             >
//               {isLoading ? 'Adding...' : 'Add +'}
//             </button>
//           ) : (
//             <div className="flex items-center gap-3 bg-orange-50 rounded-lg p-1">
//               <button
//                 onClick={() => handleQuantityChange(quantity - 1)}
//                 className="p-1 hover:bg-orange-100 rounded transition-colors"
//                 disabled={isLoading}
//               >
//                 <Minus className="h-4 w-4 text-orange-600" />
//               </button>
//               <span className="font-semibold text-orange-600 min-w-[20px] text-center">
//                 {quantity}
//               </span>
//               <button
//                 onClick={() => handleQuantityChange(quantity + 1)}
//                 className="p-1 hover:bg-orange-100 rounded transition-colors"
//                 disabled={isLoading}
//               >
//                 <Plus className="h-4 w-4 text-orange-600" />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;


// components/product/EnhancedProductCard.js
// import React, { useState } from 'react';
// import { Plus, Minus, ShoppingCart, ImageIcon } from 'lucide-react';
// import { useCart } from '../../App';
// import toast from 'react-hot-toast';

// const EnhancedProductCard = ({ product }) => {
//   const { cartItems, addToCart, updateCartItem } = useCart();
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [imageError, setImageError] = useState(false);
  
//   const cartItem = cartItems.find(item => item.product_id === product.id);
//   const quantity = cartItem ? cartItem.quantity : 0;

//   const handleAddToCart = () => {
//     if (quantity === 0) {
//       addToCart(product.id, 1);
//       toast.success(`${product.name} added to cart!`);
//     } else {
//       updateCartItem(product.id, quantity + 1);
//     }
//   };

//   const handleDecrement = () => {
//     if (quantity > 1) {
//       updateCartItem(product.id, quantity - 1);
//     } else {
//       updateCartItem(product.id, 0);
//       toast.success(`${product.name} removed from cart`);
//     }
//   };

//   const imageUrl = product.image_url || product.image;

//   const handleImageLoad = () => {
//     setImageLoaded(true);
//     setImageError(false);
//   };

//   const handleImageError = () => {
//     setImageError(true);
//     setImageLoaded(true);
//   };

//   return (
//     <div className="card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white rounded-2xl overflow-hidden">
//       {/* Enhanced Image Container */}
//       <div className="relative h-56 overflow-hidden bg-gradient-to-br from-orange-50 to-red-50">
//         {!imageLoaded && (
//           <div className="absolute inset-0 animate-pulse bg-gray-200 flex items-center justify-center">
//             <ImageIcon className="w-8 h-8 text-gray-400" />
//           </div>
//         )}
        
//         {imageError ? (
//           <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-100 flex flex-col items-center justify-center text-gray-500">
//             <ImageIcon className="w-12 h-12 mb-2" />
//             <span className="text-sm font-medium">{product.name}</span>
//             <span className="text-xs text-gray-400">Image coming soon</span>
//           </div>
//         ) : (
//           imageUrl && (
//             <img
//               src={imageUrl}
//               alt={product.name}
//               className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ${
//                 imageLoaded ? 'opacity-100' : 'opacity-0'
//               }`}
//               style={{
//                 filter: 'contrast(1.15) brightness(1.1) saturate(1.2)',
//                 imageRendering: 'high-quality',
//               }}
//               onLoad={handleImageLoad}
//               onError={handleImageError}
//               loading="lazy"
//             />
//           )
//         )}
        
//         {/* Stock overlay */}
//         {!product.is_in_stock && (
//           <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
//             <span className="text-white font-semibold bg-red-500 px-4 py-2 rounded-lg shadow-lg">
//               Out of Stock
//             </span>
//           </div>
//         )}
        
//         {/* Category badge */}
//         <div className="absolute top-3 left-3">
//           <span className="bg-white bg-opacity-90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
//             {product.category_name}
//           </span>
//         </div>
//       </div>
      
//       {/* Content */}
//       <div className="p-6">
//         <div className="mb-4">
//           <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
//             {product.name}
//           </h3>
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-2xl font-bold text-orange-600">
//               ₹{product.price}
//             </span>
//             <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
//               {product.weight}
//             </span>
//           </div>
//         </div>

//         {/* Action buttons */}
//         {product.is_in_stock ? (
//           quantity === 0 ? (
//             <button
//               onClick={handleAddToCart}
//               className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
//             >
//               <ShoppingCart className="h-4 w-4" />
//               Add to Cart
//             </button>
//           ) : (
//             <div className="flex items-center justify-between bg-gray-50 rounded-xl p-2">
//               <button
//                 onClick={handleDecrement}
//                 className="bg-white hover:bg-red-50 text-red-500 font-semibold w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
//               >
//                 <Minus className="h-4 w-4" />
//               </button>
//               <span className="font-bold text-lg px-4 text-gray-800">
//                 {quantity}
//               </span>
//               <button
//                 onClick={handleAddToCart}
//                 className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
//               >
//                 <Plus className="h-4 w-4" />
//               </button>
//             </div>
//           )
//         ) : (
//           <button disabled className="w-full bg-gray-300 text-gray-500 font-semibold py-3 px-4 rounded-xl cursor-not-allowed">
//             Out of Stock
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EnhancedProductCard;

// import React, { useState } from 'react';
// import { Plus, Minus, ShoppingCart, Image } from 'lucide-react';
// import { useCart } from '../../App';
// import toast from 'react-hot-toast';

// const EnhancedProductCard = ({ product }) => {
//   // Set default selected weight to first available option
//   const [selectedWeight, setSelectedWeight] = useState(product.weight_options?.[0] || null);
//   const { cartItems, addToCart, updateCartItem } = useCart();
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [imageError, setImageError] = useState(false);
  
//   // Find cart item with this product and weight combination
//   const cartItem = cartItems.find(item => 
//     item.product_id === product.id && item.selected_weight === selectedWeight?.weight
//   );
//   const quantity = cartItem ? cartItem.quantity : 0;

//   const handleAddToCart = () => {
//     if (!selectedWeight) {
//       toast.error('Please select a weight option');
//       return;
//     }
    
//     if (quantity === 0) {
//       // Pass product info to addToCart
//       const productInfo = {
//         id: product.id,
//         name: product.name,
//       };
//       addToCart(product.id, 1, selectedWeight, productInfo);
//     } else {
//       updateCartItem(product.id, quantity + 1, selectedWeight.weight);
//     }
//   };

//   const handleDecrement = () => {
//     if (!selectedWeight) return;
    
//     if (quantity > 1) {
//       updateCartItem(product.id, quantity - 1, selectedWeight.weight);
//     } else {
//       updateCartItem(product.id, 0, selectedWeight.weight);
//       toast.success(`${product.name} (${selectedWeight.weight}) removed from cart`);
//     }
//   };

//   const imageUrl = product.image_url || product.image;

//   const handleImageLoad = () => {
//     setImageLoaded(true);
//     setImageError(false);
//   };

//   const handleImageError = () => {
//     setImageError(true);
//     setImageLoaded(true);
//   };

//   // Handle products without weight options (backward compatibility)
//   if (!product.weight_options || product.weight_options.length === 0) {
//     return (
//       <div className="card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white rounded-2xl overflow-hidden">
//         <div className="p-6 text-center">
//           <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
//           <p className="text-gray-500">Weight options not configured</p>
//           <p className="text-sm text-gray-400 mt-2">Please contact admin to set up weight options</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white rounded-2xl overflow-hidden">
//       {/* Enhanced Image Container */}
//       <div className="relative h-56 overflow-hidden bg-gradient-to-br from-orange-50 to-red-50">
//         {/* Seasonal Badge */}
//         {product.is_seasonal && (
//           <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
//             🌟 Seasonal
//           </div>
//         )}
        
//         {!imageLoaded && (
//           <div className="absolute inset-0 animate-pulse bg-gray-200 flex items-center justify-center">
//             <Image className="w-8 h-8 text-gray-400" />
//           </div>
//         )}
        
//         {imageError ? (
//           <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-100 flex flex-col items-center justify-center text-gray-500">
//             <Image className="w-12 h-12 mb-2" />
//             <span className="text-sm font-medium">{product.name}</span>
//             <span className="text-xs text-gray-400">Image coming soon</span>
//           </div>
//         ) : (
//           imageUrl && (
//             <img
//               src={imageUrl}
//               alt={product.name}
//               className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ${
//                 imageLoaded ? 'opacity-100' : 'opacity-0'
//               }`}
//               style={{
//                 filter: 'contrast(1.15) brightness(1.1) saturate(1.2)',
//                 imageRendering: 'high-quality',
//               }}
//               onLoad={handleImageLoad}
//               onError={handleImageError}
//               loading="lazy"
//             />
//           )
//         )}
        
//         {/* Stock overlay */}
//         {!product.is_in_stock && (
//           <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
//             <span className="text-white font-semibold bg-red-500 px-4 py-2 rounded-lg shadow-lg">
//               Out of Stock
//             </span>
//           </div>
//         )}
        
//         {/* Category badge */}
//         <div className="absolute top-3 left-3">
//           <span className="bg-white bg-opacity-90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
//             {product.category_name}
//           </span>
//         </div>
//       </div>
      
//       {/* Content */}
//       <div className="p-6">
//         <div className="mb-4">
//           <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
//             {product.name}
//           </h3>
          
//           {/* Weight Selection */}
//           <div className="mb-4">
//             <p className="text-sm font-medium text-gray-700 mb-2">Choose Size:</p>
//             <div className="grid grid-cols-2 gap-2">
//               {product.weight_options.map((weightOption) => (
//                 <button
//                   key={weightOption.weight}
//                   onClick={() => setSelectedWeight(weightOption)}
//                   className={`
//                     p-2 rounded-lg border-2 text-center transition-all text-sm
//                     ${selectedWeight?.weight === weightOption.weight 
//                       ? 'border-orange-500 bg-orange-50 text-orange-700' 
//                       : 'border-gray-200 hover:border-orange-300'
//                     }
//                   `}
//                 >
//                   <div className="font-semibold">{weightOption.weight}</div>
//                   <div className="text-xs text-orange-600">₹{weightOption.price}</div>
//                 </button>
//               ))}
//             </div>
//           </div>
          
//           {/* Selected Price Display */}
//           {selectedWeight && (
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-2xl font-bold text-orange-600">
//                 ₹{selectedWeight.price}
//               </span>
//               <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
//                 {selectedWeight.weight}
//               </span>
//             </div>
//           )}
//         </div>

//         {/* Action buttons */}
//         {product.is_in_stock && selectedWeight ? (
//           quantity === 0 ? (
//             <button
//               onClick={handleAddToCart}
//               className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
//             >
//               <ShoppingCart className="h-4 w-4" />
//               Add {selectedWeight.weight} to Cart
//             </button>
//           ) : (
//             <div className="flex items-center justify-between bg-gray-50 rounded-xl p-2">
//               <button
//                 onClick={handleDecrement}
//                 className="bg-white hover:bg-red-50 text-red-500 font-semibold w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
//               >
//                 <Minus className="h-4 w-4" />
//               </button>
//               <span className="font-bold text-lg px-4 text-gray-800">
//                 {quantity}
//               </span>
//               <button
//                 onClick={handleAddToCart}
//                 className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
//               >
//                 <Plus className="h-4 w-4" />
//               </button>
//             </div>
//           )
//         ) : (
//           <button disabled className="w-full bg-gray-300 text-gray-500 font-semibold py-3 px-4 rounded-xl cursor-not-allowed">
//             {!selectedWeight ? 'Select Weight' : 'Out of Stock'}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EnhancedProductCard;
// import React, { useState } from 'react';
// import { Plus, Minus, ShoppingCart, Image, ChevronDown } from 'lucide-react';
// import { useCart } from '../../App'; // Import your actual useCart hook
// import toast from 'react-hot-toast'; // Import your actual toast

// const WeightDropdown = ({ weightOptions, selectedWeight, onSelect, className = "" }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className={`relative ${className}`}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg hover:border-orange-300 transition-colors bg-white"
//       >
//         <div className="flex items-center gap-2">
//           <span className="font-medium">{selectedWeight?.weight || 'Select Weight'}</span>
//           {selectedWeight && (
//             <span className="text-sm text-orange-600">₹{selectedWeight.price}</span>
//           )}
//         </div>
//         <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//       </button>
      
//       {isOpen && (
//         <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
//           {weightOptions.map((option) => (
//             <button
//               key={option.weight}
//               onClick={() => {
//                 onSelect(option);
//                 setIsOpen(false);
//               }}
//               className="w-full text-left p-3 hover:bg-orange-50 flex items-center justify-between border-b border-gray-100 last:border-b-0"
//             >
//               <span className="font-medium">{option.weight}</span>
//               <span className="text-orange-600 font-semibold">₹{option.price}</span>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const EnhancedProductCard = ({ product }) => {
//   // Set default selected weight to first available option
//   const [selectedWeight, setSelectedWeight] = useState(product.weight_options?.[0] || null);
//   const { cartItems, addToCart, updateCartItem } = useCart(); // Use real cart hook
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [imageError, setImageError] = useState(false);
  
//   // Find cart item with this product and weight combination
//   const cartItem = cartItems.find(item => 
//     item.product_id === product.id && item.selected_weight === selectedWeight?.weight
//   );
//   const quantity = cartItem ? cartItem.quantity : 0;

//   const handleAddToCart = () => {
//     if (!selectedWeight) {
//       toast.error('Please select a weight option');
//       return;
//     }
    
//     if (quantity === 0) {
//       // Pass complete product info including weight options
//       const productInfo = {
//         id: product.id,
//         name: product.name,
//         weight_options: product.weight_options, // Include all weight options
//       };
//       addToCart(product.id, 1, selectedWeight, productInfo);
//     } else {
//       updateCartItem(product.id, quantity + 1, selectedWeight.weight);
//     }
//   };

//   const handleDecrement = () => {
//     if (!selectedWeight) return;
    
//     if (quantity > 1) {
//       updateCartItem(product.id, quantity - 1, selectedWeight.weight);
//     } else {
//       updateCartItem(product.id, 0, selectedWeight.weight);
//       toast.success(`${product.name} (${selectedWeight.weight}) removed from cart`);
//     }
//   };

//   const imageUrl = product.image_url || product.image;

//   const handleImageLoad = () => {
//     setImageLoaded(true);
//     setImageError(false);
//   };

//   const handleImageError = () => {
//     setImageError(true);
//     setImageLoaded(true);
//   };

//   // Handle products without weight options (backward compatibility)
//   if (!product.weight_options || product.weight_options.length === 0) {
//     return (
//       <div className="card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white rounded-2xl overflow-hidden">
//         <div className="p-6 text-center">
//           <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
//           <p className="text-gray-500">Weight options not configured</p>
//           <p className="text-sm text-gray-400 mt-2">Please contact admin to set up weight options</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white rounded-2xl overflow-hidden">
//       {/* Enhanced Image Container */}
//       <div className="relative h-56 overflow-hidden bg-gradient-to-br from-orange-50 to-red-50">
//         {/* Seasonal Badge */}
//         {product.is_seasonal && (
//           <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
//             🌟 Seasonal
//           </div>
//         )}
        
//         {!imageLoaded && (
//           <div className="absolute inset-0 animate-pulse bg-gray-200 flex items-center justify-center">
//             <Image className="w-8 h-8 text-gray-400" />
//           </div>
//         )}
        
//         {imageError ? (
//           <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-100 flex flex-col items-center justify-center text-gray-500">
//             <Image className="w-12 h-12 mb-2" />
//             <span className="text-sm font-medium">{product.name}</span>
//             <span className="text-xs text-gray-400">Image coming soon</span>
//           </div>
//         ) : (
//           imageUrl && (
//             <img
//               src={imageUrl}
//               alt={product.name}
//               className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ${
//                 imageLoaded ? 'opacity-100' : 'opacity-0'
//               }`}
//               style={{
//                 filter: 'contrast(1.15) brightness(1.1) saturate(1.2)',
//                 imageRendering: 'high-quality',
//               }}
//               onLoad={handleImageLoad}
//               onError={handleImageError}
//               loading="lazy"
//             />
//           )
//         )}
        
//         {/* Stock overlay */}
//         {!product.is_in_stock && (
//           <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
//             <span className="text-white font-semibold bg-red-500 px-4 py-2 rounded-lg shadow-lg">
//               Out of Stock
//             </span>
//           </div>
//         )}
        
//         {/* Category badge */}
//         <div className="absolute top-3 left-3">
//           <span className="bg-white bg-opacity-90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
//             {product.category_name}
//           </span>
//         </div>
//       </div>
      
//       {/* Content */}
//       <div className="p-6">
//         <div className="mb-4">
//           <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
//             {product.name}
//           </h3>
          
//           {/* Weight Selection Dropdown */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Choose Weight:
//             </label>
//             <WeightDropdown
//               weightOptions={product.weight_options}
//               selectedWeight={selectedWeight}
//               onSelect={setSelectedWeight}
//             />
//           </div>
          
//           {/* Selected Price Display */}
//           {selectedWeight && (
//             <div className="text-center mb-4">
//               <span className="text-3xl font-bold text-orange-600">
//                 ₹{selectedWeight.price}
//               </span>
//               <p className="text-sm text-gray-500 mt-1">
//                 for {selectedWeight.display}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Action buttons */}
//         {product.is_in_stock && selectedWeight ? (
//           quantity === 0 ? (
//             <button
//               onClick={handleAddToCart}
//               className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
//             >
//               <ShoppingCart className="h-4 w-4" />
//               Add to Cart
//             </button>
//           ) : (
//             <div className="flex items-center justify-between bg-gray-50 rounded-xl p-2">
//               <button
//                 onClick={handleDecrement}
//                 className="bg-white hover:bg-red-50 text-red-500 font-semibold w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
//               >
//                 <Minus className="h-4 w-4" />
//               </button>
//               <span className="font-bold text-lg px-4 text-gray-800">
//                 {quantity}
//               </span>
//               <button
//                 onClick={handleAddToCart}
//                 className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
//               >
//                 <Plus className="h-4 w-4" />
//               </button>
//             </div>
//           )
//         ) : (
//           <button disabled className="w-full bg-gray-300 text-gray-500 font-semibold py-3 px-4 rounded-xl cursor-not-allowed">
//             {!selectedWeight ? 'Select Weight' : 'Out of Stock'}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EnhancedProductCard;


import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Image, ChevronDown } from 'lucide-react';
import { useCart } from '../../App';
import toast from 'react-hot-toast';
// Add this function at the top of your component file

const MinimalWeightDropdown = ({ weightOptions, selectedWeight, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
      >
        <span>{selectedWeight?.weight || 'Select'}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown content */}
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[100px]">
            {weightOptions.map((option) => (
              <button
                key={option.weight}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-orange-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                  selectedWeight?.weight === option.weight ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                }`}
              >
                {option.weight}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const EnhancedProductCard = ({ product }) => {
  // Set default selected weight to first available option
  const [selectedWeight, setSelectedWeight] = useState(product.weight_options?.[0] || null);
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
    <div className="card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white rounded-2xl overflow-hidden">
      {/* Enhanced Image Container */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-orange-50 to-red-50">
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
        {/* {product.is_in_stock && selectedWeight ? (
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
        )} */}
      </div>
    </div>
  );
};

export default EnhancedProductCard;