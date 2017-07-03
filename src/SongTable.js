import React, { Component } from 'react';
import { connect } from 'react-redux';
import './SongTable.css';
import Song from './Song';
import SongPlayingInfo from './SongPlayingInfo';

class SongTable extends Component {
  constructor(props) {
    super(props);
    this.handlePlayNextControl = this.handlePlayNextControl.bind(this);
    this.handlePlayPauseControl = this.handlePlayPauseControl.bind(this);
    this.handleMuteControl = this.handleMuteControl.bind(this);
    this.ifFirstPlay = this.ifFirstPlay.bind(this);
  }

  componentWillReceiveProps = nextProps => {
    // if (this.props.categoryName !== nextProps.categoryName) {
    //   this.setState({
    //     activeSong: null,
    //     muted: false
    //   });
    //DO I NEED TO DO SOMETHING HERE??????
    // } else if (this.props.songs.length > nextProps.songs.length){
    //   let players = this.state.players.slice();
    //   players = players.filter(player => {
    //     return nextProps.songs.find(song => {
    //       return song.videoId === player.a.id;
    //     }) !== undefined;
    //   });
    //   this.setState({ players, activeSong: null, muted: false });
    // }
  }

  handlePlayNextControl = (e, nextBoolean) => {
    e.preventDefault();
    if (!this.ifFirstPlay(true)){
      let players = this.state.players.slice();
      let activeSong = Object.assign({}, this.state.activeSong);
      this.playNextVideo(players, activeSong, activeSong.videoId, nextBoolean);
      this.setState({players, activeSong});
    }
  }

  ifFirstPlay = nextBoolean => {
    if (this.props.activeSong === null) {
      let idx = nextBoolean ? 0 : this.props.songs.length-1;
      let activeSong = Object.assign({}, this.props.songs[idx]);
      let players = this.state.players.slice();
      let playing;
      players.forEach(player => {
        if (player.a.id === activeSong.videoId){
          player.playVideo();
          playing = true;
        }
      });
      this.setState({players, activeSong, playing});
      return true;
    }
  }

  handlePlayPauseControl = e => {
    e.preventDefault();
    let players = this.state.players.slice();
    let activeSong = Object.assign({}, this.state.activeSong);
    let playing = this.state.playing;
    players.forEach(player => {
      if (player.a.id === activeSong.videoId){
        if (playing){
          player.pauseVideo();
        } else {
          player.playVideo();
        }
        playing = !playing;
      }
    });
    this.setState({players, activeSong, playing});
  }

  handleMuteControl = e => {
    e.preventDefault();
    let players = this.state.players.slice();
    let activeSong = Object.assign({}, this.state.activeSong);
    let muted = this.state.muted;
    players.forEach(player => {
      if (player.a.id === activeSong.videoId){
        if (player.isMuted()){
          player.unMute();
           muted = false;
        } else {
          player.mute();
          muted = true;
        }
      }
    });
    this.setState({players, muted});
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
    let playPauseControlGlyph = this.props.isPlaying ? "glyphicon-play" : "glyphicon-pause";
    let muteControlGlyph = this.props.isMuted ?
      "glyphicon-volume-off " : "glyphicon-volume-up";

    let playListControlsDiv;
    //only show playListControls when all players are loaded
    if (this.props.players.length === this.props.songs.length) {
      playListControlsDiv = (
       <div id="playlistControls">
          <a id="prevSong" className="resume btn btn-default btn-sm" role="button" href="" onClick={e => this.handlePlayNextControl(e, false)}>
            <span className="glyphicon glyphicon-backward" aria-hidden="true"></span>
          </a>
          <a id="playPauseSong" className="firstStart btn btn-default btn-sm" role="button" href="" onClick={this.handlePlayPauseControl}>
            <span className={`glyphicon ${playPauseControlGlyph}`} aria-hidden="true"></span>
          </a>
          <a id="muteSong" className="btn btn-default btn-sm" role="button" href="" onClick={this.handleMuteControl}>
            <span className={`glyphicon ${muteControlGlyph}`} aria-hidden="true"></span>
          </a>
          <a id="nextSong" className="resume btn btn-default btn-sm" role="button" href="" onClick={e => this.handlePlayNextControl(e, true)}>
            <span className="glyphicon glyphicon-forward" aria-hidden="true"></span>
          </a>
        </div>
      );
    }

    return (
      <div>
       {playListControlsDiv}

        <SongPlayingInfo />

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
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    songs: state.songs,
    activeSong: state.activeSong,
    isPlaying: state.isPlaying,
    isMuted: state.isMuted,
    players: state.players
  }
};

export default connect(mapStateToProps)(SongTable);
