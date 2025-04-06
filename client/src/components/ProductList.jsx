import React, { useEffect, useState } from 'react';
import styles from './ProductList.module.css';
import FavoritesPanel from './FavoritesPanel';

const ProductList = ({ suggestedProducts }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (suggestedProducts?.length) {
      setProducts(suggestedProducts);
      setFilteredProducts(suggestedProducts);
    } else {
      fetch('/api/products')
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          setFilteredProducts(data);
        })
        .catch((err) => console.error('Error loading products:', err));
    }
  }, [suggestedProducts]);

  useEffect(() => {
    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const toggleFavorite = (product) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(fav => fav.id === product.id);
      if (isFavorite) {
        return prevFavorites.filter(fav => fav.id !== product.id);
      } else {
        return [...prevFavorites, product];
      }
    });
  };

  const removeFavorite = (productId) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(fav => fav.id !== productId)
    );
  };

  const [showFavorites, setShowFavorites] = useState(false);

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <button 
        onClick={() => setShowFavorites(!showFavorites)}
        className={styles.showFavoritesBtn}
      >
        {showFavorites ? 'Hide Favorites' : 'Show Favorites'}
      </button>
      {showFavorites && (
        <FavoritesPanel 
          favorites={favorites} 
          removeFavorite={removeFavorite}
          onClose={() => setShowFavorites(false)}
        />
      )}
      <h2 className="text-xl font-semibold mb-2">
        {suggestedProducts?.length ? 'Recommended Products' : 'Available Products'}
      </h2>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search products..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredProducts.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div className={styles.productList}>
          {filteredProducts.map((product) => {
            const isFavorite = favorites.some(fav => fav.id === product.id);
            return (
              <div
                key={product.id}
                className={styles.productItem}
              >
                <img
                  src={product.image || 'https://via.placeholder.com/300x200?text=Product'}
                  alt={product.name}
                  className={styles.productImage}
                />
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productPrice}>{product.price || 'Price unavailable'}</p>
                <button 
                  className={isFavorite ? styles.favoriteActive : styles.addToFavButton}
                  onClick={() => toggleFavorite(product)}
                >
                  {isFavorite ? '❤️' : 'Add to Fav'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;
