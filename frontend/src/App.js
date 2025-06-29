import { Phone } from 'lucide-react';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

// Import components at the top
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import Footer from './components/layout/Footer';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken
          });
          
          localStorage.setItem('access_token', response.data.access);
          
          // Retry original request
          error.config.headers.Authorization = `Bearer ${response.data.access}`;
          return api.request(error.config);
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.reload();
        }
      }
    }
    return Promise.reject(error);
  }
);

// Context for Cart Management
const CartContext = createContext();

// Replace your CartProvider in App.js with this:

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Updated addToCart to use database API
  const addToCart = async (productId, quantity = 1, weightOption = null, productInfo = null) => {
    console.log('AddToCart called with:', { productId, quantity, weightOption, productInfo });
    setIsLoading(true);
    try {
      if (weightOption && productInfo) {
        // Use database API for weight-based cart
        const response = await api.post('/cart/', {
          product_id: productId,
          selected_weight: weightOption.weight,
          quantity: quantity
        });
        
        if (response.data) {
          setCartItems(response.data.items);
          setCartTotal(response.data.total_amount);
          setItemCount(response.data.total_items);
          toast.success(`${productInfo.name} (${weightOption.weight}) added to cart! 🛒`);
        }
      } else {
        // Fallback for products without weights
        toast.error('Please select a weight option');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Updated updateCartItem to use database API
  const updateCartItem = async (productId, quantity, selectedWeight = null) => {
    console.log('UpdateCartItem called with:', { productId, quantity, selectedWeight });
    setIsLoading(true);
    try {
      if (selectedWeight) {
        // Use database API for weight-based cart
        const response = await api.put('/cart/', {
          product_id: productId,
          selected_weight: selectedWeight,
          quantity: quantity
        });
        
        if (response.data) {
          setCartItems(response.data.items);
          setCartTotal(response.data.total_amount);
          setItemCount(response.data.total_items);
          
          if (quantity === 0) {
            toast.success('Item removed from cart');
          }
        }
      } else {
        toast.error('Weight information required');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId, selectedWeight) => {
    setIsLoading(true);
    try {
      const response = await api.delete('/cart/', {
        data: {
          product_id: productId,
          selected_weight: selectedWeight
        }
      });
      
      if (response.data) {
        setCartItems(response.data.items);
        setCartTotal(response.data.total_amount);
        setItemCount(response.data.total_items);
        toast.success('Item removed from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    setIsLoading(true);
    try {
      const response = await api.delete('/cart/');
      
      if (response.data) {
        setCartItems(response.data.items);
        setCartTotal(response.data.total_amount);
        setItemCount(response.data.total_items);
        toast.success('Cart cleared');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Change cart item weight (remove old, add new)
  const changeCartItemWeight = async (productId, oldWeight, newWeight, quantity) => {
    setIsLoading(true);
    try {
      // First remove the item with old weight
      await api.delete('/cart/', {
        data: {
          product_id: productId,
          selected_weight: oldWeight
        }
      });
      
      // Then add with new weight
      const response = await api.post('/cart/', {
        product_id: productId,
        selected_weight: newWeight,
        quantity: quantity
      });
      
      if (response.data) {
        setCartItems(response.data.items);
        setCartTotal(response.data.total_amount);
        setItemCount(response.data.total_items);
        toast.success('Weight updated successfully');
      }
    } catch (error) {
      console.error('Error changing weight:', error);
      toast.error('Failed to update weight');
    } finally {
      setIsLoading(false);
    }
  };

  const getCart = async () => {
    try {
      const response = await api.get('/cart/');
      if (response.data) {
        setCartItems(response.data.items);
        setCartTotal(response.data.total_amount);
        setItemCount(response.data.total_items);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // If API fails, try to load from localStorage as fallback
      const savedCart = localStorage.getItem('cart_items');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        setCartItems(items);
        updateCartTotals(items);
      }
    }
  };

  // Helper function to update totals (for localStorage fallback)
  const updateCartTotals = (items) => {
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    setCartTotal(total + 40); // Add delivery fee
    setItemCount(count);
  };

  // Save cart to localStorage as backup (for offline scenarios)
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart_items', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  useEffect(() => {
    getCart();
  }, []);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartTotal,
      itemCount,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      changeCartItemWeight,
      getCart,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};

// ← EXPORT the useCart hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

// Main App Component
const App = () => {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/about" element={
                <div className="flex-1 flex items-center justify-center py-16">
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">About Svadishta</h1>
                    <p className="text-xl text-gray-600">
                      We bring you the authentic taste of Indian home cooking with traditional recipes 
                      passed down through generations. Every dish is made with love and the finest ingredients.
                    </p>
                  </div>
                </div>
              } />
              <Route path="/contact" element={
                <div className="flex-1 bg-gradient-to-br from-orange-50 to-red-50 py-16">
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="text-center mb-16">
                      <h1 className="text-5xl font-bold text-gray-900 mb-4">Get in Touch</h1>
                      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                      We'd absolutely love to hear from you! Whether you're ready to order, have a question, or just want to say hi, we're always here.
                      </p>
                    </div>

                    {/* Contact Information Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                      {/* Phone Card */}
                      <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Phone className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
                        <a 
                          href="tel:+917893491514" 
                          className="text-lg text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          +91 78934 91514
                        </a>
                        <p className="text-gray-500 mt-2">Available 9 AM - 6 PM</p>
                      </div>

                      {/* WhatsApp Card */}
                      <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16">
                            <path fill="#25D366" d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">WhatsApp</h3>
                        <a 
                          href="https://wa.me/917893491514" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-lg text-green-600 hover:text-green-800 font-medium transition-colors"
                        >
                          Chat with us
                        </a>
                        <p className="text-gray-500 mt-2">Quick responses</p>
                      </div>

                      {/* Instagram Card */}
                      <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <img 
                            src={require('./assets/instagram.png')} 
                            alt="Instagram Icon" 
                            className="h-8 w-8" 
                          />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Follow Us</h3>
                        <a 
                          href="https://www.instagram.com/svadishta_flavours/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-lg text-purple-600 hover:text-purple-800 font-medium transition-colors"
                        >
                          @svadishta_flavours
                        </a>
                        <p className="text-gray-500 mt-2">Latest updates & photos</p>
                      </div>
                    </div>

                    {/* Email Section - Moved down to prevent cutoff */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-16">
                      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <img 
                          src={require('./assets/mail.png')} 
                          alt="Email Icon" 
                          className="h-10 w-10" 
                        />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4">Email Us</h3>
                      <a 
                        href="mailto:svadishtaflavours@gmail.com" 
                        className="text-xl text-orange-600 hover:text-orange-800 font-medium transition-colors break-all"
                      >
                        svadishtaflavours@gmail.com
                      </a>
                      <p className="text-gray-500 mt-3">We'll reply as soon as possible</p>
                    </div>

                  </div>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </Router>
    </CartProvider>
  );
};
export default App;