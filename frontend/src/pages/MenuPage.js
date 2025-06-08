import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter } from 'lucide-react';
import axios from 'axios';
import EnhancedProductCard from '../components/product/ProductCard';

const MenuPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');

  // const fetchProducts = useCallback(async () => {
  //   setIsLoading(true);
  //   try {
  //     const url = selectedCategory === 'all' 
  //       ? 'http://127.0.0.1:8000/api/products/'
  //       : `http://127.0.0.1:8000/api/products/?category=${selectedCategory}`;
      
  //     const response = await axios.get(url);
  //     setProducts(response.data.results || []);
  //     if (response.data.categories) {
  //       setCategories(response.data.categories);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [selectedCategory]);
// Updated fetchProducts function in your MenuPage component

const fetchProducts = useCallback(async () => {
  setIsLoading(true);
  try {
    let allProducts = [];
    let nextUrl = selectedCategory === 'all' 
      ? 'http://127.0.0.1:8000/api/products/'
      : `http://127.0.0.1:8000/api/products/?category=${selectedCategory}`;
    
    // Fetch all pages
    while (nextUrl) {
      console.log('Fetching from URL:', nextUrl);
      const response = await axios.get(nextUrl);
      
      // Add products from this page
      const pageProducts = response.data.results || [];
      allProducts = [...allProducts, ...pageProducts];
      
      // Check if there's a next page
      nextUrl = response.data.next;
      
      // Store categories from first response
      if (response.data.categories && allProducts.length === pageProducts.length) {
        setCategories(response.data.categories);
      }
      
      console.log(`Loaded ${pageProducts.length} products, total: ${allProducts.length}`);
    }
    
    setProducts(allProducts);
    console.log(`Final product count: ${allProducts.length}`);
    
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    setIsLoading(false);
  }
}, [selectedCategory]);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Rest of the component code stays the same...
  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const categoryEmojis = {
    'pickles': '',
    'sweets': '',
    'hot-foods': '',
    'dry-snacks': ''
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-transition">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Our Delicious Menu
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Authentic flavors crafted with traditional recipes and premium ingredients.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search your favorite food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field appearance-none pr-10"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            selectedCategory === 'all'
              ? 'bg-orange-500 text-white shadow-lg scale-105'
              : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
          }`}
        >
         All Items
        </button>
        {categories.map((category) => (
          <button
            key={category.slug}
            onClick={() => setSelectedCategory(category.slug)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              selectedCategory === category.slug
                ? 'bg-orange-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
            }`}
          >
            {categoryEmojis[category.slug]} {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <EnhancedProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <div className="text-8xl mb-6">🔍</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            No items found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or category filter
          </p>
        </div>
      )}
    </div>
  );
};

export default MenuPage;