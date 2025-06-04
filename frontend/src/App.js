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

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const addToCart = async (product, quantity = 1) => {
    setIsLoading(true);
    try {
      const response = await api.post('/cart/', {
        items: [{ product_id: product.id, quantity }]
      });
      
      if (response.data) {
        setCartItems(response.data.items);
        setCartTotal(response.data.total_amount);
        setItemCount(response.data.total_items);
        toast.success(`${product.name} added to cart! 🛒`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    setIsLoading(true);
    try {
      const response = await api.post('/cart/', {
        items: [{ product_id: productId, quantity }]
      });
      
      if (response.data) {
        setCartItems(response.data.items);
        setCartTotal(response.data.total_amount);
        setItemCount(response.data.total_items);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
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
    }
  };

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
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/about" element={
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-8">About Svadishta</h1>
                  <p className="text-xl text-gray-600">
                    We bring you the authentic taste of Indian home cooking with traditional recipes 
                    passed down through generations. Every dish is made with love and the finest ingredients.
                  </p>
                </div>
              } />
              <Route path="/contact" element={
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
                  <div className="space-y-4 text-lg text-gray-600">
                    <p>📞 Phone: +91 98765 43210</p>
                    <p>📧 Email: hello@svadishta.com</p>
                    <p>📍 Address: Mumbai, Maharashtra</p>
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