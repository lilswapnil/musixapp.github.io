import React, { useState, useEffect, Suspense } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Songs from './Songs';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

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
    // Fetch the access token from the backend
    fetch('/callback')
      .then(response => response.json())
      .then(data => setAccessToken(data.accessToken))
      .catch(() => setError("Failed to authenticate with Spotify."));
  }, []);

  // Fetch songs based on the active card and access token
  useEffect(() => {
    if (accessToken && activeCard !== null) {
      const apiInfo = API_ENDPOINTS[activeCard];
      if (apiInfo.type === 'recently-played') {
        fetchRecentlyPlayed(apiInfo.endpoint);
      }
      if (apiInfo.type === 'last-week') {
        fetchRecentlyPlayed(apiInfo.endpoint);
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
          Authorization: "Bearer " + accessToken,
        },
      };

      const response = await fetch(endpoint, searchParameters);
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to fetch recently played songs");
      }

      const recentPlayData = await response.json();
      setSongs(recentPlayData.items.map(item => item.track));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  //Last Week
  async function fetchLastWeek(endpoint) {
    try {
     const response = await fetch(endpoint, searchParameters);
     if (!response.ok) {
      throw new Error("Failed to fetch recently played songs");
     } 
     const lastWeekData = await response.json();
     setSongs(lastWeekData.items.map(item => item.track));
    }
    catch (err) {
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

