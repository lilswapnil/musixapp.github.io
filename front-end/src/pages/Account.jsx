import React, { useState, useEffect } from 'react';
import logo from '../assets/man.png';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

export default function Account() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Retrieve the access token from localStorage
    const accessToken = localStorage.getItem('spotify_access_token');
    if (accessToken) {
      fetchSpotifyUserData(accessToken);
    } else {
      // Redirect to Spotify login
      window.location.href = `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user-read-private user-read-email playlist-read-private`;
    }
  }, []);

  async function fetchSpotifyUserData(accessToken) {
    try {
      const searchParameters = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      };

      const userData = await fetch('https://api.spotify.com/v1/me', searchParameters)
        .then(response => response.json());

      console.log(userData);
      setUser(userData);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="section-content">
      <div className="section-header">
        <h1>Good Morning, {user.display_name}!</h1>
        <div className="user-section">
          <img className="user-image" src={user.images[0]?.url || logo} alt="Profile" />
          <div className="user-content">
            <h2>{user.display_name}</h2>
            <p>{user.email}</p>
          </div>
        </div>
      </div>
      <div className="dashboard-content">
        <h1>Dashboard</h1>
      </div>
      <div className="about-content">
        <div className="spacebetween-column">
          <h1>About</h1>
          <div className="card">Edit</div>
        </div>
        <p>Email: {user.email}</p>
        <div className="spacebetween-column">
          <p>Password: ********</p>
          <div className="card">Change Password</div>
        </div>
        <p>Date of Birth: {user.birthdate}</p>
      </div>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}
