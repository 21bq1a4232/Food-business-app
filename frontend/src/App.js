import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailedPage from './pages/PaymentFailedPage';

















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

  // Updated addToCart to handle weight selection
  const addToCart = async (productId, quantity = 1, weightOption = null, productInfo = null) => {
    console.log('AddToCart called with:', { productId, quantity, weightOption, productInfo });
    setIsLoading(true);
    try {
      if (weightOption && productInfo) {
        // New weight-based approach (local storage for now)
        const existingItemIndex = cartItems.findIndex(
          item => item.product_id === productId && item.selected_weight === weightOption.weight
        );

        let updatedItems;
        if (existingItemIndex >= 0) {
          // Update existing item
          updatedItems = [...cartItems];
          updatedItems[existingItemIndex].quantity += quantity;
          updatedItems[existingItemIndex].subtotal = updatedItems[existingItemIndex].quantity * parseFloat(weightOption.price);
        } else {
          // Add new item
          const newItem = {
            product_id: productId,
            selected_weight: weightOption.weight,
            weight_display: weightOption.display,
            price: parseFloat(weightOption.price),
            quantity: quantity,
            subtotal: parseFloat(weightOption.price) * quantity,
            name: productInfo.name,
            available_weights: productInfo.weight_options || [weightOption], // Store available options
          };
          updatedItems = [...cartItems, newItem];
        }

        setCartItems(updatedItems);
        updateCartTotals(updatedItems);
        toast.success(`${productInfo.name} (${weightOption.weight}) added to cart! 🛒`);
      } else {
        // Old approach - fallback for products without weights
        try {
          const response = await api.post('/cart/', {
            items: [{ product_id: productId, quantity }]
          });
          
          if (response.data) {
            setCartItems(response.data.items);
            setCartTotal(response.data.total_amount);
            setItemCount(response.data.total_items);
            toast.success(`Item added to cart! 🛒`);
          }
        } catch (error) {
          console.error('Error with API cart:', error);
          toast.error('Failed to add item to cart');
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Updated updateCartItem to handle weight
  const updateCartItem = async (productId, quantity, selectedWeight = null) => {
    console.log('UpdateCartItem called with:', { productId, quantity, selectedWeight });
    setIsLoading(true);
    try {
      if (selectedWeight) {
        // New weight-based approach
        let updatedItems;
        if (quantity === 0) {
          // Remove item
          updatedItems = cartItems.filter(
            item => !(item.product_id === productId && item.selected_weight === selectedWeight)
          );
        } else {
          // Update quantity
          updatedItems = cartItems.map(item => {
            if (item.product_id === productId && item.selected_weight === selectedWeight) {
              return {
                ...item,
                quantity: quantity,
                subtotal: item.price * quantity
              };
            }
            return item;
          });
        }

        setCartItems(updatedItems);
        updateCartTotals(updatedItems);
      } else {
        // Old approach - try API call
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
          console.error('Error with API cart update:', error);
          toast.error('Failed to update cart');
        }
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to change weight of an existing cart item
  const changeCartItemWeight = (productId, oldWeight, newWeightOption) => {
    setIsLoading(true);
    try {
      const existingItemIndex = cartItems.findIndex(
        item => item.product_id === productId && item.selected_weight === oldWeight
      );

      if (existingItemIndex >= 0) {
        const existingItem = cartItems[existingItemIndex];
        
        // Remove old item and add new item with new weight
        let updatedItems = cartItems.filter(
          item => !(item.product_id === productId && item.selected_weight === oldWeight)
        );

        // Check if item with new weight already exists
        const newWeightItemIndex = updatedItems.findIndex(
          item => item.product_id === productId && item.selected_weight === newWeightOption.weight
        );

        if (newWeightItemIndex >= 0) {
          // Add quantity to existing item with new weight
          updatedItems[newWeightItemIndex].quantity += existingItem.quantity;
          updatedItems[newWeightItemIndex].subtotal = updatedItems[newWeightItemIndex].quantity * parseFloat(newWeightOption.price);
        } else {
          // Create new item with new weight
          const newItem = {
            ...existingItem,
            selected_weight: newWeightOption.weight,
            weight_display: newWeightOption.display,
            price: parseFloat(newWeightOption.price),
            subtotal: existingItem.quantity * parseFloat(newWeightOption.price)
          };
          updatedItems.push(newItem);
        }

        setCartItems(updatedItems);
        updateCartTotals(updatedItems);
        toast.success(`Weight changed to ${newWeightOption.weight}`);
      }
    } catch (error) {
      console.error('Error changing weight:', error);
      toast.error('Failed to change weight');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to update totals
  const updateCartTotals = (items) => {
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    setCartTotal(total + 40); // Add delivery fee
    setItemCount(count);
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
      // If API fails, try to load from localStorage
      const savedCart = localStorage.getItem('cart_items');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        setCartItems(items);
        updateCartTotals(items);
      }
    }
  };

  // Save cart to localStorage whenever it changes
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
                    <p>📞 Phone: +91 78934 91514</p>
                    <p>📧 Email: svadishtaflavours@gmail.com</p>
                    <p>📍 Address: Nizampet, Hyderabad, Telangana</p>
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