import React from "react";

export default function Songs({ songs }) {
  // Split songs into groups of 5
  const groupedSongs = [];
  for (let i = 0; i < songs.length; i += 4) {
    groupedSongs.push(songs.slice(i, i + 4));
  }

  return (
    <div className='section-container'>
      <div className="section-heading">
        <div className="section-title">Songs</div>
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
    </div>
  );
}