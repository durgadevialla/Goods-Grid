import React, { useState } from 'react';
import styles from './ChatAssistant.module.css';

const ChatAssistant = ({ setSuggestedProducts }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query) return;
    setLoading(true);
    setResponse('');
    setProducts([]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      setResponse(data.reply || '');

      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
        setSuggestedProducts?.(data.products); // Push to Home
      }
    } catch (err) {
      setResponse('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className={styles.chatAssistant}>
      <h2 className={styles.assistantTitle}>🤖 AI Product Assistant</h2>

      <div className={styles.searchContainer}>
        <input
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask for product recommendations..."
          onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
        />
        <button
          onClick={handleAsk}
          className={styles.searchButton}
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </div>

      {response && (
        <div className={styles.responseContainer}>
          {response}
        </div>
      )}

      {products.length > 0 && (
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div
              key={product.id}
              className={styles.productCard}
            >
              <img
                src={product.image || 'https://via.placeholder.com/300x200?text=Product'}
                alt={product.name}
                className={styles.productImage}
              />
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productPrice}>{product.price || 'Price unavailable'}</p>
              <button className={styles.addToCartButton}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;