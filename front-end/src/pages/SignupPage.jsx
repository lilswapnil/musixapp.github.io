import React, { useState } from 'react';
import logo from '../assets/logo-light.png';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
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
    // Check if username exists and create user
    fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Redirect to login page
          window.location.href = '/login';
        } else {
          alert(data.message);
        }
      });
  };

  return (
    <div className='section-container'>
      <div className="section-header">
        <img className='site-logo' src={logo} alt="logo" />
      </div>
      <div className='login-content'>
      <form className="form" onSubmit={handleSubmit}>
      <div className='form-group'>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
      </div>
      <div className='form-group'>
          <label>Create Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className='form-group'>
          <label>Create Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
    </div>
  );
}