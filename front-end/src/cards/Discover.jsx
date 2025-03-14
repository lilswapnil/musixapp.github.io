import React, { useState, useEffect, lazy, Suspense } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Songs from './Songs';

// Spotify API credentials
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

// API endpoints for different categories
const API_ENDPOINTS = {
  'Top Charts': { type: 'playlist', id: "6UeSakyzhiEt4NB3UAd6NQ" }, // Replace with your Spotify playlist ID for Top Charts
  'New Releases': { type: 'new-releases', endpoint: "https://api.spotify.com/v1/browse/new-releases?limit=15" }, // Spotify API for New Releases
  'Featured Playlists': { type: 'featured-playlists', endpoint: "https://api.spotify.com/v1/users/me/playlists?limit=15" }, // Spotify API for Featured Playlists
  'Genres & Moods': { type: 'genres-moods', endpoint: "https://api.spotify.com/v1/browse/categories?locale=US" }, // Spotify API for Genres & Moods
  'Artist Spotlight': { type: 'top-artists', endpoint: "https://api.spotify.com/v1/me/top/artists?limit=15" }, // Spotify API for Top Artists
  'Recommended': { type: 'recommendations', endpoint: "https://api.spotify.com/v1/recommendations" } // Spotify API for Recommendations
};

// Lazy load the SongCard component with a 2-second delay
const SongCard = lazy(() => new Promise(resolve => {
  setTimeout(() => resolve(import('./SongCard')), 2000); // 2 seconds delay
}));

export default function Discover() {
  const [activeCard, setActiveCard] = useState(null); // State to track the active card
  const [accessToken, setAccessToken] = useState(""); // State to store the access token
  const [songs, setSongs] = useState([]); // State to store the fetched songs
  const [error, setError] = useState(""); // State to store any errors

  // Fetch the access token when the component mounts
  useEffect(() => {
    const authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };

    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token))
      .catch(() => setError("Failed to authenticate with Spotify."));
  }, []);

  // Fetch songs based on the active card and access token
  useEffect(() => {
    if (accessToken && activeCard !== null) {
      const apiInfo = API_ENDPOINTS[activeCard];
      if (apiInfo.type === 'playlist') {
        fetchPlaylistSongs(apiInfo.id);
      } else if (apiInfo.type === 'new-releases') {
        fetchNewReleases(apiInfo.endpoint);
      } else if (apiInfo.type === 'recommendations') {
        fetchRecommendations(apiInfo.endpoint);
      } else if (apiInfo.type === 'genres-moods') {
        fetchGenresMoods(apiInfo.endpoint);
      } else if (apiInfo.type === 'featured-playlists') {
        fetchFeaturedPlaylists(apiInfo.endpoint);
      } else if (apiInfo.type === 'top-artists') {
        fetchTopArtists(apiInfo.endpoint);
      }
    }
  }, [accessToken, activeCard]);

  // Fetch songs from a playlist
  async function fetchPlaylistSongs(playlistId) {
    try {
      const searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        searchParameters
      );

      if (!response.ok) {
        throw new Error("Failed to fetch playlist songs");
      }

      const playlistData = await response.json();
      setSongs(playlistData.items.map(item => item.track));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  // Fetch recommendations
  async function fetchRecommendations(endpoint) {
    try {
      const searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      const response = await fetch(endpoint, searchParameters);

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const recommendationsData = await response.json();
      setSongs(recommendationsData.tracks);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  // Fetch genres and moods
  async function fetchGenresMoods(endpoint) {
    try {
      const searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      const response = await fetch(endpoint, searchParameters);

      if (!response.ok) {
        throw new Error("Failed to fetch genres and moods");
      }

      const genresMoodsData = await response.json();

      setSongs(genresMoodsData.categories.items.map(category => ({
        id: category.id,
        name: category.name,
        artists: [],
        album: { images: [{ url: category.icons[0].url }] }
      })));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  // Fetch new releases
  async function fetchNewReleases(endpoint) {
    try {
      const searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      const response = await fetch(endpoint, searchParameters);
      console.log("Hi");
      if (!response.ok) {
        throw new Error("Failed to fetch new releases");
      }

      const newReleasesData = await response.json();
      setSongs(newReleasesData.albums.items.map(album => ({
        id: album.id,
        name: album.name,
        artists: album.artists,
        album: { images: album.images },
        preview_url: album.preview_url
      })));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  // Fetch featured playlists
  async function fetchFeaturedPlaylists(endpoint) {
    try {
      const searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      const response = await fetch(endpoint, searchParameters);
      if (!response.ok) {
        throw new Error("Failed to fetch featured playlists");
      }

      // Print the data to the console
      const featuredPlaylistsData = await response.json();

      setSongs(featuredPlaylistsData.items.map(playlist => ({
        id: playlist.id,
        name: playlist.name,
        artists: [],
        album: { images: playlist.images },
        preview_url: playlist.preview_url
      })));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  // Fetch top artists
  async function fetchTopArtists(endpoint) {
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
        throw new Error("Failed to fetch top artists");
      }

      const topArtistsData = await response.json();
      console.log(topArtistsData);
      setSongs(topArtistsData.items.map(artist => ({
        id: artist.id,
        name: artist.name,
        artists: [artist],
        album: { images: artist.images },
        preview_url: artist.preview_url
      })));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  // Handle card click to set the active card
  const handleCardClick = (cardTitle) => {
    setActiveCard(activeCard === cardTitle ? null : cardTitle);
  };

  return (
    <div className='section-container'>
      <div className="section-heading">
        <div className="section-title">Discover</div>
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