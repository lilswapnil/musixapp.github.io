import React from 'react';
import albumCover from '../assets/album-art.jpg'; // Ensure the image is placed in the correct path

export default function AlbumPage() {
    return(
        <>
        <div className="album-container">
            <div className="album-header">
                <img src={albumCover} alt="Album Cover" />
                <div className="album-info">
                    <h1>Title</h1>
                    <p>Artist</p>
                </div>
            </div>
            <div className='tracklist'>
            <h2>Tracklist</h2>
            <ol>
                <li>Song 1</li>
                <li>Song 2</li>
                <li>Song 3</li>
                <li>Song 3</li>
                <li>Song 3</li>
                <li>Song 3</li>
                <li>Song 3</li>
                <li>Song 3</li>
                <li>Song 3</li>
                
            </ol>
        </div>
        </div>
        </>
    )
}