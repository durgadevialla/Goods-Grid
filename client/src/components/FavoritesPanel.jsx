import React from 'react';
import styles from './FavoritesPanel.module.css';

const FavoritesPanel = ({ favorites, removeFavorite, onClose }) => {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3>Your Favorites</h3>
        <button onClick={onClose} className={styles.closeBtn}>×</button>
      </div>
      {favorites.length === 0 ? (
        <p>No favorites yet</p>
      ) : (
        <ul className={styles.favoritesList}>
          {favorites.map((product) => (
            <li key={product.id} className={styles.favoriteItem}>
              <img src={product.image} alt={product.name} />
              <div>
                <h4>{product.name}</h4>
                <p>${product.price}</p>
              </div>
              <button 
                onClick={() => removeFavorite(product.id)}
                className={styles.removeBtn}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritesPanel;
