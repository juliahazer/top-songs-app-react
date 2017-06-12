import React, { Component } from 'react';
import YouTubePlayer from './YouTubePlayer';
import './Song.css';

class Song extends Component {
  constructor(props){
    super(props);
    // this.state = {
    //   youtubePlayer: new YT.Player(`player${this.props.position}`, {
    //     height: '300',
    //     width: '500',
    //     videoId: this.props.videoId,
    //     playerVars: {
    //       'origin': 'localhost:3000' //NEED TO CHANGE
    //     }//,
        //events: {
        //  'onStateChange': onPlayerStateChange
        //}
      //});
      // })
    // }
  }

  render() {
    var createYRPlayer
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
          {/*<YouTubePlayer 
            key={"player" + this.props.position} 
            id={"player" + this.props.position}
            videoId = {this.props.videoId}/> */}
        </td>
      </tr>
    )
  }
}

export default Song;
