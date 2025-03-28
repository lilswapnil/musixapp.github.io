import React, { useState, useEffect } from "react";
import Songs from './Songs';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const PLAYLIST_ID = "6UeSakyzhiEt4NB3UAd6NQ"; // Replace with your Spotify playlist ID

export default function TopSongs() {
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
    if (accessToken) {
      fetchSongs();
    }
  }, [accessToken]);

  async function fetchSongs() {
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
        .then((data) => data.items.map(item => item.track));

      setSongs(playlistData);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  return (
    <div className='section-container'>
      <div className="section-heading">
        <div className="section-title">Top Songs</div>
      </div>
      <div className="grid-scroll-container">
        <Songs songs={songs} />
      </div>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}