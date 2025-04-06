import React, { useState } from 'react';
import styles from './ProductAdmin.module.css';

const ProductAdmin = ({ products, onSave }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditedProduct({...product});
    setImagePreview(product.image || null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedProduct({});
    setImagePreview(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({...prev, [name]: value}));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditedProduct(prev => ({...prev, image: file}));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(editedProduct);
    setEditingId(null);
  };

  return (
    <div className={styles.productAdminContainer}>
      <h2>Manage Products</h2>
      <div className={styles.productGrid}>
        {products.map(product => (
          <div key={product.id} className={styles.productCard}>
            {editingId === product.id ? (
              <div className={styles.editForm}>
                <div className={styles.imageUpload}>
                  {imagePreview && (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className={styles.imagePreview}
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                <input
                  type="text"
                  name="name"
                  value={editedProduct.name || ''}
                  onChange={handleChange}
                  placeholder="Product name"
                />
                <input
                  type="number"
                  name="price"
                  value={editedProduct.price || ''}
                  onChange={handleChange}
                  placeholder="Price"
                />
                <textarea
                  name="description"
                  value={editedProduct.description || ''}
                  onChange={handleChange}
                  placeholder="Description"
                />
                <div className={styles.buttonGroup}>
                  <button onClick={handleSave}>Save</button>
                  <button onClick={handleCancel}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <img 
                  src={product.image || 'https://via.placeholder.com/300x200?text=Product'} 
                  alt={product.name}
                  className={styles.productImage}
                />
                <h3>{product.name}</h3>
                <p>${product.price}</p>
                <button 
                  onClick={() => handleEdit(product)}
                  className={styles.editButton}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductAdmin;
