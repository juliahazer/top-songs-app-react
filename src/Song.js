import React, { Component } from 'react';
import './Song.css';

class Song extends Component {
  render() {
    return (
      <tr id={"pos" + this.props.position} className="songRow">
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
          <div className='youTube' id={"player" + this.props.position}>
          </div>
        </td>
      </tr>
    )
  }
}

export default Song;
