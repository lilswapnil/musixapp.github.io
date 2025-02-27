import React, { useState, useEffect } from "react";
import ArticleList from "../ArticleList";
import articles from "../article-content";
import TopAlbums from "../cards/TopAlbums";
import TopSongs from "../cards/TopSongs";
import LikedSongs from "../cards/LikedSongs";
import Songs from '../cards/Songs';
import Albums from '../cards/Albums';

const CLIENT_ID = "777c571d7da6439aaf522a3c54cbef52";
const CLIENT_SECRET = "854ab52143794b74a136f7b1396662fc";
const PLAYLIST_ID = "6UeSakyzhiEt4NB3UAd6NQ";

export default function MyLibrary() {
  const [likedSongs, setLikedSongs] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState("");

  const addLikedSong = (song) => {
    setLikedSongs((prevLikedSongs) => [...prevLikedSongs, song]);
  };

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
      fetchRecentlyAdded();
      fetchLikedAlbums();
    }
  }, [accessToken]);

  async function fetchRecentlyAdded() {
    try {
      const searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      const recentlyAddedData = await fetch(
        `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`,
        searchParameters
      )
        .then((response) => response.json())
        .then((data) => data.items.map(item => item.track));

      setSongs(recentlyAddedData);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  async function fetchLikedAlbums() {
    try {
      const searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      const likedAlbumsData = await fetch(
        `https://api.spotify.com/v1/me/albums`,
        searchParameters
      )
        .then((response) => response.json())
        .then((data) => data.items.map(item => item.album));

      setAlbums(likedAlbumsData);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  return (
    <>
      <div className="section-container">
        <div className="section-heading">
          <div className="section-title">My Library</div>
        </div>
      </div>
      <div className="section-container">
        <div className="section-heading">
          <div className="section-title">Recently Added</div>
        </div>
        <div className="grid-scroll-container">
          <Songs songs={songs} />
        </div>
        {error && <p className="text-danger">{error}</p>}

        <div className="section-title">Songs</div>
        <div className="grid-scroll-container">
          <Songs songs={songs} />
        </div>
        {error && <p className="text-danger">{error}</p>}

    
        <div className="grid-scroll-container">
          <Albums albums={albums} />
        </div>
        {error && <p className="text-danger">{error}</p>}

        <LikedSongs likedSongs={likedSongs} />
      </div>

      <h1>Articles</h1>
      <ArticleList articles={articles} />
    </>
  );
}