import React, { useState, useEffect } from "react";

const CLIENT_ID = "777c571d7da6439aaf522a3c54cbef52";
const CLIENT_SECRET = "854ab52143794b74a136f7b1396662fc";
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

  // Split songs into groups of 5
  const groupedSongs = [];
  for (let i = 0; i < songs.length; i += 5) {
    groupedSongs.push(songs.slice(i, i + 5));
  }

  return (
    <div className='section-container'>
      <div className="section-heading">
        <div className="section-title">Top Songs</div>
      </div>
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
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}