import React, { useState } from 'react';
import styles from './Register.module.css';

const Register = ({ onRegister, onBack }) => {
  const [formData, setFormData] = useState({
    username: '',
    gmail: '',
    password: '',
    role: 'user', // Default role is user
    adminKey: ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate the form data
  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.gmail) newErrors.gmail = 'Gmail is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.role === 'admin' && !formData.adminKey) {
      newErrors.adminKey = 'Admin key is required for admin role';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch('https://goods-grid-1.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)  // Send formData, including adminKey if present
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      // On successful registration, redirect to login page
      onBack();  // This will redirect to the login page
    } catch (error) {
      setServerError(error.message); // Display error message from server
    }
  };

  return (
      <div className={styles.registerWrapper}>
        <div className={styles.registerCard}>
        <h2 className={styles.heading}>Register</h2>
          {serverError && <p className={styles.error}>{serverError}</p>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              name="username"
              placeholder="Create your Username"
              value={formData.username}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.username && <p className={styles.error}>{errors.username}</p>}
  
            <input
              type="email"
              name="gmail"
              placeholder="Enter your Gmail"
              value={formData.gmail}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.gmail && <p className={styles.error}>{errors.gmail}</p>}
  
            <input
              type="password"
              name="password"
              placeholder="Enter your Password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.password && <p className={styles.error}>{errors.password}</p>}
  
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="" disabled>Select your Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
  
            {formData.role === 'admin' && (
              <>
                <input
                  type="text"
                  name="adminKey"
                  placeholder="Admin Key"
                  value={formData.adminKey}
                  onChange={handleChange}
                  className={styles.input}
                />
                {errors.adminKey && <p className={styles.error}>{errors.adminKey}</p>}
              </>
            )}
  
            <button type="submit" className={styles.submitButton}>
              Register
            </button>
          </form>
  
          <button className={styles.backButton} onClick={onBack}>Back to Login</button>
        </div>
      </div>
    );
  };

export default Register;
