import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/product/ProductCard';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-gradient-to-br from-orange-100 via-red-50 to-yellow-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Authentic
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {" "}Indian Flavors
              </span>
              <br />
              Delivered Fresh
            </h1>
            <p className="text-xl text-gray-600 mt-6 leading-relaxed">
              Experience the taste of home with our traditional pickles, sweets, and hot meals. 
              Made with love, delivered with care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => navigate('/menu')}
                className="btn-primary text-lg px-8 py-4"
              >
                Order Now 🍽️
              </button>
              <button 
                onClick={() => navigate('/menu')}
                className="btn-secondary text-lg px-8 py-4"
              >
                View Menu 📋
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">500+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">4.8★</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">30min</div>
                <div className="text-sm text-gray-600">Delivery Time</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in">
            <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-8 shadow-2xl transform rotate-3">
              <div className="bg-white rounded-2xl p-6 transform -rotate-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-4 text-center">
                    <span className="text-4xl">🥭</span>
                    <p className="font-medium mt-2">Mango Pickle</p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-100 to-red-100 rounded-xl p-4 text-center">
                    <span className="text-4xl">🍮</span>
                    <p className="font-medium mt-2">Gulab Jamun</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-yellow-100 rounded-xl p-4 text-center">
                    <span className="text-4xl">🍛</span>
                    <p className="font-medium mt-2">Dal Makhani</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-4 text-center">
                    <span className="text-4xl">🥟</span>
                    <p className="font-medium mt-2">Samosas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products/');
      const products = response.data.results || [];
      setFeaturedProducts(products.slice(0, 4)); // Show first 4 products
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  return (
    <div>
      <HeroSection />
      
      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Delights
          </h2>
          <p className="text-xl text-gray-600">
            Our most loved traditional recipes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/menu" className="btn-primary text-lg px-8 py-4">
            View All Items 🍽️
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Svadishta?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-400 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="font-semibold text-xl mb-2">Homemade Quality</h3>
              <p className="text-gray-600">
                Every dish is prepared with the same love and care as you'd find in an Indian home.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-400 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-xl mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Hot, fresh food delivered to your doorstep in 30-45 minutes or less.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-400 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="font-semibold text-xl mb-2">Pure Ingredients</h3>
              <p className="text-gray-600">
                We use only the finest, freshest ingredients with no artificial preservatives.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;