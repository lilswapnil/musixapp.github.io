import React from "react";

const likedSongs = [
  {
    id: 1,
    name: "Song 1",
    artist: "Artist 1",
    album: {
      images: [{ url: "https://via.placeholder.com/150" }]
    }
  },
  {
    id: 2,
    name: "Song 2",
    artist: "Artist 2",
    album: {
      images: [{ url: "https://via.placeholder.com/150" }]
    }
  },
  // Add more liked songs here
];

export default function LikedSongs() {
  return (
    <div className='section-container'>
      <div className="section-heading">
        <div className="section-title">Liked Songs</div>
      </div>
      <div className="scroll-container">
        {likedSongs.map((song) => (
          <div key={song.id} className="album-card">
            <img src={song.album.images[0]?.url} alt={song.name} />
            <div className="album-info">
              <h3>{song.name}</h3>
              <p>{song.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}