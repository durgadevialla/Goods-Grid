import React, { useState } from 'react';
import styles from './Login.module.css';

const Login = ({ onLogin, onRegisterClick, onBack }) => {
  const [formData, setFormData] = useState({ gmail: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.gmail.trim()) {
      newErrors.gmail = 'Email is required';
    } else if (!emailRegex.test(formData.gmail)) {
      newErrors.gmail = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setServerError('');

    try {
      const response = await fetch('https://goods-grid-1.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify({
        gmail: formData.gmail,
        username: data.username,
        role: data.role
      }));
      
      onLogin({
        gmail: formData.gmail,
        username: data.username,
        role: data.role,
        token: data.token
      });
    } catch (error) {
      setServerError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <h2>Login</h2>
        {serverError && <p className={styles.errorMessage}>{serverError}</p>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="email"
              name="gmail"
              placeholder="Enter your Gmail"
              value={formData.gmail}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.gmail && <p className={styles.errorMessage}>{errors.gmail}</p>}
          </div>

          <div className={styles.formGroup}>
            <input
              type="password"
              name="password"
              placeholder="Enter your Password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <button onClick={onBack} className={styles.backButton}>Back</button>
        <div onClick={onRegisterClick} className={styles.registerLink}>Don't have an account? Register</div>
      </div>
    </div>
  );
};

export default Login;
