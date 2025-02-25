import React, { useState, useEffect } from 'react';

export default function SongCard({ song }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    // Cleanup audio object when component unmounts or song changes
    return () => {
      if (audio) {
        audio.pause();
        setAudio(null);
      }
    };
  }, [audio, song]);

  const handlePlayPause = () => {
    if (!song.preview_url) {
      alert('No preview available for this song.');
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const newAudio = new Audio(song.preview_url);
      newAudio.play();
      setAudio(newAudio);
      setIsPlaying(true);
    }
  };

  return (
    <div
      className={`section-content-container ${isPlaying ? 'active' : ''}`}
      onClick={handlePlayPause}
    >
      <div className="content-image">
        <img src={song.album.images[0]?.url} alt={song.name} />
      </div>
      <div className="content-information">
        <div className="content-song">{song.name}</div>
        <div className="content-artist">{song.artists.map((artist) => artist.name).join(", ")}</div>
      </div>
    </div>
  );
}