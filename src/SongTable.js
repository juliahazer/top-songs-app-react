import React, { Component } from 'react';
import Song from './Song';

class SongTable extends Component {
  constructor(props){
    super(props);
    this.state = {
      players: []
    };
    this.handleVideoOnReady = this.handleVideoOnReady.bind(this);
    this.handleVideoStateChange = this.handleVideoStateChange.bind(this);
  }

  handleVideoOnReady = e => {
    let players = this.state.players.slice();
    players.push(e.target);
    this.setState({ players });
  }

  handleVideoStateChange = e => {
    let players = this.state.players.slice();
    let playingUrl = e.target.getVideoUrl();
    //if playing, pause all other videos
    if (e.data === 1) {
      players.forEach(player => {
        if (player.getVideoUrl() !== playingUrl) {
          player.pauseVideo();
        }
      })
    }
    //if ended, refresh video to unstarted state
    //and play next video on the list
    if (e.data === 0) {
      players.forEach(player => {
        if (player.getVideoUrl() === playingUrl) {
          player.stopVideo(-1);
        }
      })
      let playingId = playingUrl.substr(playingUrl.lastIndexOf('=') + 1);
      let positionNext = this.props.songs.find(song => {
        return song.videoId === playingId
      }).position + 1;
      //if at end of list, play first video
      if (positionNext > this.props.songs.length){
        positionNext = 1;
      }
      let videoIdNext = this.props.songs.find(song => {
        return song.position === positionNext;
      }).videoId;
      players.forEach(player => {
        if(player.getVideoUrl() === `https://www.youtube.com/watch?v=${videoIdNext}`) {
          player.playVideo();
        }
      })
    }
    this.setState({players});
  }

  render() {
    let songsComp = this.props.songs.map(song => {
      return (
        <Song
          key={"pos" + song.position}
          position={song.position}
          name={song.songName}
          artist={song.artist}
          bioUrl={song.bioUrl}
          nameBio={song.nameBio}
          videoId = {song.videoId}
          handleVideoOnReady = {this.handleVideoOnReady}
          handleVideoStateChange = {this.handleVideoStateChange}
        />
      )
    });
    return (
      <table className="table table-striped table-hover table-responsive table-sm">
        <thead>
          <tr>
            <th className="col-xs-1">Position</th>
            <th className="col-xs-2">Song / Artist</th>
            <th className="col-xs-9">Video</th>
          </tr>
        </thead>
        <tbody>
          {songsComp}
        </tbody>
      </table>
    )
  }
}

export default SongTable;
