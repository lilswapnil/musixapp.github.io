import React, { useState, useEffect, Suspense } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Songs from './Songs';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

const API_ENDPOINTS = {
  'Recently Played': { type: 'recently-played', endpoint: "https://api.spotify.com/v1/me/player/recently-played?limit=15" },
  'Last Week' :{ type: 'last-week', endpoint: ""},
  'Most Played' :{ type: 'most-played', endpoint: ""},
  'Favorites':{ type: 'favorites', endpoint: ""},
  'History':{ type: 'history', endpoint: ""},
  'Quick Access':{ type: 'quick-access', endpoint: ""},
}

export default function RecentSearch() {
  const [activeCard, setActiveCard] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Retrieve the access token from localStorage
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
      setAccessToken(token);
    } else {
      // Redirect to Spotify login
      window.location.href = `https://accounts.spotify.com/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user-read-private user-read-email user-read-recently-played`;
    }
  }, []);

  // Fetch songs based on the active card and access token
  useEffect(() => {
    if (accessToken && activeCard !== null) {
      const apiInfo = API_ENDPOINTS[activeCard];
      if (apiInfo.type === 'recently-played') {
        fetchRecentlyPlayed(apiInfo.endpoint);
      }
      if (apiInfo.type === 'last-week') {
        fetchLastWeek(apiInfo.endpoint);
      }
    }
  }, [accessToken, activeCard]);

//Most Played
   async function fetchMostPlayed(endpoint) {}
 //Favorites
   async function fetchFavorites(endpoint) {}
 //History
   async function fetchHistory(endpoint) {}
 //Quick Access
   async function fetchQuickAccess(endpoint) {}
   
  // Fetch songs from Recently Played API
  async function fetchRecentlyPlayed(endpoint) {
    try {
      const searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(endpoint, searchParameters);
      console.log(response)

      if (!response.ok) {
        throw new Error("Failed to fetch recently played songs");
      }

      const recentPlayData = await response.json();
      setSongs(recentPlayData.items.map(item => item.track));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  // Fetch songs from Last Week API
  async function fetchLastWeek(endpoint) {
    try {
      const searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(endpoint, searchParameters);
      if (!response.ok) {
        throw new Error("Failed to fetch last week's songs");
      }

      const lastWeekData = await response.json();
      setSongs(lastWeekData.items.map(item => item.track));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  const handleCardClick = (cardTitle) => {
    setActiveCard(activeCard === cardTitle ? null : cardTitle);
  };

  return (
    <div className='section-container'>
      <div className="section-heading">
        <div className="section-title">Recent Search</div>
      </div>
      
      <div className="scroll-container">
        {Object.keys(API_ENDPOINTS).map((title, index) => (
          <div 
            key={index} 
            className={`card ${activeCard === title ? 'active' : ''}`} 
            onClick={() => handleCardClick(title)}
          >
            <div className="card-content">{title}</div>
            {activeCard === title && (
              <FontAwesomeIcon icon={faTimes} className="close-icon" />
            )}
          </div>
        ))}
      </div>

      {activeCard !== null && (
        <div className="section-container">
          <div className="grid-scroll-container">
            <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
              <Songs songs={songs} />
            </Suspense>
          </div>
        </div>
      )}
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}

