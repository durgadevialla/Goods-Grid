import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import Home from './pages/Home';
import styles from './App.module.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('choose');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
  
    if (token && userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser({
        ...parsedUser,
        token, 
      });
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAuthView('choose');
  };

  const handleLogin = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
  };

  const handleRegister = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
  };

  if (user) {
    return <Home user={user} onLogout={handleLogout} />;
  }

  if (authView === 'choose') {
    return (
      <div className={styles.landingWrapper}>
      
        <div className={styles.landingOverlay}>
          <h1 className={styles.chooseTitle}>GOODs-GRID</h1>
          <div className={styles.chooseButtons}>
            <button onClick={() => setAuthView('login')}>Login</button>
            <button onClick={() => setAuthView('register')}>Signup</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {authView === 'login' && (
        <Login
          onLogin={handleLogin}
          onRegisterClick={() => setAuthView('register')}
          onBack={() => setAuthView('choose')}
        />
      )}
      {authView === 'register' && (
        <Register
          onRegister={handleRegister}
          onBack={() => setAuthView('login')}
        />
      )}
    </>
  );
};

export default App;
