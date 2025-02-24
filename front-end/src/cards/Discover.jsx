import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const CLIENT_ID = "777c571d7da6439aaf522a3c54cbef52";
const CLIENT_SECRET = "854ab52143794b74a136f7b1396662fc";

const API_ENDPOINTS = {
  'Top Charts': { type: 'playlist', id: "6UeSakyzhiEt4NB3UAd6NQ" }, // Replace with your Spotify playlist ID for Top Charts
  'New Releases': { type: 'new-releases', endpoint: "https://api.spotify.com/v1/browse/new-releases?limit=15" }, // Spotify API for New Releases
  'Featured Playlists': { type: 'featured-playlists', endpoint: "https://api.spotify.com/v1/browse/featured-playlists" }, // Spotify API for Featured Playlists
  'Genres & Moods': { type: 'genres-moods', endpoint: "https://api.spotify.com/v1/recommendations/available-genre-seeds" }, // Spotify API for Genres & Moods
  'Artist Spotlight': { type: 'playlist', id: "37i9dQZF1DX5uokaTN4FTR" }, // Replace with your Spotify playlist ID for Artist Spotlight
  'Recommended': { type: 'recommendations', endpoint: "https://api.spotify.com/v1/recommendations" } // Spotify API for Recommendations
};

export default function Discover() {
  const [activeCard, setActiveCard] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get API access token
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
      }
    }
  }, [accessToken, activeCard]);

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
      setSongs(genresMoodsData.genres.map(genre => ({
        id: genre,
        name: genre,
        artists: [],
        album: { images: [{ url: "https://via.placeholder.com/150" }] }
      })));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

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

      if (!response.ok) {
        throw new Error("Failed to fetch new releases");
      }

      const newReleasesData = await response.json();
      setSongs(newReleasesData.albums.items.map(album => ({
        id: album.id,
        name: album.name,
        artists: album.artists,
        album: { images: album.images }
      })));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

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

      const featuredPlaylistsData = await response.json();
      setSongs(featuredPlaylistsData.playlists.items.map(playlist => ({
        id: playlist.id,
        name: playlist.name,
        artists: [],
        album: { images: playlist.images }
      })));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  const handleCardClick = (cardTitle) => {
    setActiveCard(activeCard === cardTitle ? null : cardTitle);
  };

  // Split songs into groups of 5
  const groupedSongs = [];
  for (let i = 0; i < songs.length; i += 5) {
    groupedSongs.push(songs.slice(i, i + 5));
  }

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
            {groupedSongs.map((group, groupIndex) => (
              <div key={groupIndex} className="section-group">
                {group.map((song) => (
                  <div key={song.id} className="section-content-container">
                    <div className="content-image">
                      <img src={song.album.images[0]?.url} alt={song.name} />
                    </div>
                    <div className="content-information">
                      <div className="content-song">{song.name}</div>
                      <div className="content-artist">{song.artists.map((artist) => artist.name).join(", ")}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}