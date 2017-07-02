import React from 'react';
import YouTubePlayer from './YouTubePlayer';
import './Song.css';

const Song = ({position, name, artist, bioUrl, nameBio, videoId}) => (
  <tr id={`pos ${position}`} className="songRow text-left">
    <td>
      <span className="position">{position}</span>
    </td>
    <td>
      <div className="songName">
        {name}
      </div>
      <div className="artist">
        by {artist}
      </div>
      <div className="bio">
        <a className="btn btn-default btn-xs btnArtistBio"
          role="button"
          target="_blank"
          rel="noopener noreferrer"
          href={bioUrl}>
        Bio for {nameBio}</a>
      </div>
    </td>
    <td>
      <YouTubePlayer
        key={`player ${position}`}
        id={`player ${position}`}
        videoId = {videoId}/>
    </td>
  </tr>
)

export default Song;
