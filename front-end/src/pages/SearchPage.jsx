import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Albums from "../cards/Albums";
import Artists from "../cards/Artists";
import Songs from "../cards/Songs";

const CLIENT_ID = "777c571d7da6439aaf522a3c54cbef52";
const CLIENT_SECRET = "854ab52143794b74a136f7b1396662fc";

export default function SearchPage() {
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

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
    if (query && accessToken) {
      search(query);
    }
  }, [query, accessToken]);

  async function search(searchInput) {
    setLoading(true);
    setError("");
    try {
      const searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      // Search for the songs
      const songData = await fetch(
        `https://api.spotify.com/v1/search?q=${searchInput}&type=track&limit=50`,
        searchParameters
      )
        .then((response) => response.json())
        .then((data) => data.tracks.items);

      setSongs(songData);

      // Search for the artist ID
      const artistData = await fetch(
        `https://api.spotify.com/v1/search?q=${searchInput}&type=artist`,
        searchParameters
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.artists.items.length === 0) {
            throw new Error("Artist not found");
          }
          return data.artists.items;
        });

      setArtists(artistData);

      // Fetch albums for the artist
      const artistID = artistData[0].id;
      await fetch(
        `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=50`,
        searchParameters
      )
        .then((response) => response.json())
        .then((data) => setAlbums(data.items));

    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {error && <p className="text-danger">{error}</p>}
      {loading ? (
        <h1 style={{ textAlign: "center", justifyContent: "center" }}>Loading...</h1>
      ) : (
        <>
          <h3>Search Results for "{query}"</h3>
          <Songs songs={songs} />
          <Albums albums={albums} />
          <Artists artists={artists} />
        </>
      )}
    </>
  );
}