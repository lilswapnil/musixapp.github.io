import React, { useState, useEffect } from 'react';

export default function Account() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profilePicture: ''
  });

  useEffect(() => {
    // Fetch user details from the server
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    console.log('Token:', token); // Log the token to verify
    fetch('/api/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setUser(data);
        setFormData({
          username: data.username,
          email: data.email,
          profilePicture: data.profilePicture
        });
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = () => {
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    // Save user details to the server
    fetch('/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        setUser(data);
        setIsEditing(false);
      })
      .catch(error => {
        console.error('Error updating user details:', error);
      });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Account Details</h2>
      <img src={user.profilePicture} alt="Profile" />
      <div>
        <label>Username:</label>
        {isEditing ? (
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        ) : (
          <span>{user.username}</span>
        )}
      </div>
      <div>
        <label>Email:</label>
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        ) : (
          <span>{user.email}</span>
        )}
      </div>
      {isEditing ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={() => setIsEditing(true)}>Edit</button>
      )}
    </div>
  );
}