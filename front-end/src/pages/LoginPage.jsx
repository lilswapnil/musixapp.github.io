import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-light.png';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Authenticate user
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Redirect to account page
          window.location.href = '/account';
        } else {
          alert('Invalid credentials');
        }
      });
  };

  return (
    <div className='section-container'>
      <div className="section-header">
          <img className='site-logo' src={logo} alt="logo" />
      </div>
      <div className='login-content'>
      <h1>Login</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Email or Username:</label>
          <input
            type="text"
            name="emailOrUsername"
            value={formData.emailOrUsername}
            onChange={handleChange}
          />
        </div>
        <div className='form-group'>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button className="button" type="submit">Login</button>
        <div className='signup-warning'>
          <p>Don't have an account?  </p> 
          
          <Link to="/signup">Sign Up</Link>
        </div>
      </form>
    </div>
    </div>
    
  );
}