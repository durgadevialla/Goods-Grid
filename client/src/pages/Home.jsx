import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import AdminPanel from '../components/AdminPanel';
import ChatAssistant from '../components/ChatAssistant';
import styles from './Home.module.css';

const Home = ({ user, onLogout }) => {
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <img 
            src="/images/layout.png" 
            alt="Tech Logo" 
            className={styles.logo}
          />
          <h1 className={styles.title}>Goods-Grid {user.username}</h1>
        </div>
        <button onClick={onLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      {/* Chat Assistant centered at top */}
      <div className={styles.chatAssistantContainer}>
        <ChatAssistant setSuggestedProducts={setSuggestedProducts} />
      </div>

      {/* Product list shows either all or suggested */}
      <div className={styles.section}>
        <ProductList suggestedProducts={suggestedProducts} />
      </div>

      {/* Admin panel toggle button and panel */}
      {user.role === 'admin' && (
        <>
          <button 
            className={styles.adminToggleButton}
            onClick={() => setShowAdminPanel(!showAdminPanel)}
          >
            {showAdminPanel ? '✕' : '⚙️'}
          </button>
          {showAdminPanel && (
            <div className={styles.section}>
              <AdminPanel />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
