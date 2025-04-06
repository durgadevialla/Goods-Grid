import React, { useState } from 'react';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
  const [name, setName] = useState('');
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const [error, setError] = useState('');

  const handleAdd = async () => {
    if (!name) return;
    
    // Check for duplicate product name
    const exists = products.some(p => p.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      setError(`Product "${name}" already exists!`);
      return;
    }
    setError('');

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      setName('');
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    fetchProducts();
  };

  // fetch on load
  React.useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className={styles.adminPanel}>
      <h2 className={styles.adminTitle}>🛠️ Admin Panel</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <div className={styles.formGroup}>
        <input
          className={styles.inputField}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter product name"
        />
        <button
          onClick={handleAdd}
          className={`${styles.actionButton} ${styles.addButton}`}
        >
          Add Product
        </button>
      </div>
      <ul className={styles.productList}>
        {products.map((p) => (
          <li key={p.id} className={styles.productItem}>
            {p.name}
            <button
              onClick={() => handleDelete(p.id)}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;