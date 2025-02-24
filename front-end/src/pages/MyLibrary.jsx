import React, { useState } from "react";
import ArticleList from "../ArticleList";
import articles from "../article-content";
import TopAlbums from "../cards/TopAlbums";
import TopSongs from "../cards/TopSongs";
import LikedSongs from "../cards/LikedSongs";

export default function MyLibrary() {
  const [likedSongs, setLikedSongs] = useState([]);

  const addLikedSong = (song) => {
    setLikedSongs((prevLikedSongs) => [...prevLikedSongs, song]);
  };

  return (
    <>
      <h1>Articles</h1>
      <ArticleList articles={articles} />
      <TopAlbums />
      <TopSongs addLikedSong={addLikedSong} />
      <LikedSongs likedSongs={likedSongs} />
    </>
  );
}