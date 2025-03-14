import React, { useState, useEffect } from "react";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const PLAYLIST_ID = "4LZtDy62wDvQ4o8JB4UrcR"; // Replace with your Spotify playlist ID

export default function TopAlbums() {
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
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
    if (accessToken) {
      fetchAlbums();
    }
  }, [accessToken]);

  async function fetchAlbums() {
    try {
      const searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      const playlistData = await fetch(
        `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`,
        searchParameters
      )
        .then((response) => response.json())
        .then((data) => data.items.map(item => item.track.album));

      setAlbums(playlistData);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  return (
    <div className='section-container'>
      <div className="section-heading">
        <div className="section-title">Top Albums</div>
      </div>
      <div className="scroll-container">
        {albums.map((album) => (
          <div key={album.id} className="card">
            <div className="album-info">
            <img src={album.images[0]?.url} alt={album.name} />
            
              <h3>{album.name}</h3>
              <p>{album.artists.map((artist) => artist.name).join(", ")}</p>
            </div>
          </div>
        ))}
      </div>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}