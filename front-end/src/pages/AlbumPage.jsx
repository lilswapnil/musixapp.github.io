import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CLIENT_ID = "777c571d7da6439aaf522a3c54cbef52";
const CLIENT_SECRET = "854ab52143794b74a136f7b1396662fc";

export default function AlbumPage() {
  const { albumId } = useParams();
  const [accessToken, setAccessToken] = useState("");
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState("");

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

  // Fetch album details when albumId or accessToken changes
  useEffect(() => {
    if (albumId && accessToken) {
      fetchAlbumDetails(albumId);
    }
  }, [albumId, accessToken]);

  // Fetch album details and tracks
  async function fetchAlbumDetails(albumId) {
    try {
      const searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      // Fetch album details
      const albumData = await fetch(
        `https://api.spotify.com/v1/albums/${albumId}`,
        searchParameters
      )
        .then((response) => response.json())
        .then((data) => {
          setAlbum(data);
          setTracks(data.tracks.items);
        });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (!album) {
    return <h1 style={{ textAlign: "center", justifyContent: "center" }}>Loading...</h1>;
  }

  return (
    <div className="album-container">
      <div className="album-header">
        <img src={album.images[0]?.url} alt="Album Cover" />
        <div className="album-info">
          <h1>{album.name}</h1>
          <p>{album.artists.map(artist => artist.name).join(", ")}</p>
        </div>
      </div>
      <div className='tracklist'>
        <h2>Tracklist</h2>
        <ol>
          {tracks.map(track => (
            <li key={track.id}>{track.name}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}