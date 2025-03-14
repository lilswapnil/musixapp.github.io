import React, { useState, useEffect } from 'react';
import logo from '../assets/man.png';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = 'http://localhost:5173/callback'; // Update to match the registered URI

export default function Account() {
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch user details from the server
    const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
    fetch('/api/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setUser(data);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });

    // Check if we have an access token in the URL fragment
    const hash = window.location.hash;
    const accessToken = new URLSearchParams(hash.substring(1)).get('access_token');
    if (accessToken) {
      fetchUserPlaylists(accessToken);
    } else {
      // Redirect to Spotify login
      window.location.href = `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user-read-private user-read-email playlist-read-private`;
    }
  }, []);

  async function fetchUserPlaylists(accessToken) {
    try {
      const searchParameters = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      };

      const playlistData = await fetch('https://api.spotify.com/v1/me/playlists', searchParameters)
        .then(response => response.json())
        .then(data => data.items);

      setPlaylists(playlistData);
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
        <h1>Good Morning, {user.username}!</h1>
        <div className="user-section">
          <img className="user-image" src={logo} alt="Profile" />
          <div className="user-content">
            <h2>{user.username}</h2>
            <p>{user.email}</p>
            <div className="scroll-container">
              {playlists.map((playlist) => (
                <div key={playlist.id} className="card">
                  <img src={playlist.images[0]?.url} alt={playlist.name} />
                  <p>{playlist.name}</p>
                </div>
              ))}
            </div>
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
        <p>Date of Birth: {user.dateOfBirth}</p>
      </div>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}