import React, { Component } from 'react';
import YouTubePlayer from './YouTubePlayer';
import './Song.css';

class Song extends Component {
  constructor(props){
    super(props);
  }

  render() {
    var createYRPlayer
    return (
      <tr id={"pos" + this.props.position} className="songRow text-left">
        <td>
          <span className="position">{this.props.position}</span>
        </td>
        <td>
          <div className="songName">
            {this.props.name}
          </div>
          <div className="artist">
            by {this.props.artist}
          </div>
          <div className="bio">
            <a className="btn btn-default btn-xs btnArtistBio" role="button" 
              target="_blank" href={this.props.bioUrl}>
            Bio for {this.props.nameBio}</a>
          </div>
        </td>
        <td>
          <YouTubePlayer 
            key={"player" + this.props.position} 
            id={"player" + this.props.position}
            videoId = {this.props.videoId}/> 
        </td>
      </tr>
    )
  }
}

export default Song;
