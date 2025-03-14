import React, { useState, useEffect } from 'react';
import logo from '../assets/man.png';
import { getToken, removeToken } from '../utils/tokenCache';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

export default function Account() {
  const [user, setUser] = useState(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Retrieve the access token from the cache
    const accessToken = getToken();
    if (accessToken) {
      fetchSpotifyUserData(accessToken);
      fetchRecentlyPlayed(accessToken);
    } else {
      // Redirect to Spotify login
      redirectToSpotifyLogin();
    }
  }, []);

  function redirectToSpotifyLogin() {
    window.location.href = `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user-read-private user-read-email user-read-recently-played`;
  }

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
        .then(response => {
          if (!response.ok) {
            if (response.status === 401) {
              // Access token expired, remove it from the cache and redirect to Spotify login
              removeToken();
              redirectToSpotifyLogin();
            }
            throw new Error('Failed to fetch user data');
          }
          return response.json();
        });
      setUser(userData);
      console.log(userData);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  }

  async function fetchRecentlyPlayed(accessToken) {
    try {
      const searchParameters = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      };

      const recentlyPlayedData = await fetch('https://api.spotify.com/v1/me/player/recently-played', searchParameters)
        .then(response => {
          if (!response.ok) {
            if (response.status === 401) {
              // Access token expired, remove it from the cache and redirect to Spotify login
              removeToken();
              redirectToSpotifyLogin();
            }
            throw new Error('Failed to fetch recently played data');
          }
          return response.json();
        })
        .then(data => data.items);

      setRecentlyPlayed(recentlyPlayedData);
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
        <h2>Your Spotify Recent Plays</h2>
        <div className="scroll-container">
          {recentlyPlayed.map((item, index) => (
            <div key={index} className="card">
              <img src={item.track.album.images[0]?.url} alt={item.track.name} />
              <p>{item.track.name}</p>
              <p>{item.track.artists.map(artist => artist.name).join(', ')}</p>
            </div>
          ))}
        </div>
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
