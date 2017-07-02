import React, { Component } from 'react';
import './SongTable.css';
import Song from './Song';

class SongTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      activeSong: null,
      muted: false,
      playing: false
    };
    this.handleVideoOnReady = this.handleVideoOnReady.bind(this);
    this.handleVideoStateChange = this.handleVideoStateChange.bind(this);
    this.handlePlayNextControl = this.handlePlayNextControl.bind(this);
    this.handlePlayPauseControl = this.handlePlayPauseControl.bind(this);
    this.handleMuteControl = this.handleMuteControl.bind(this);
    this.ifFirstPlay = this.ifFirstPlay.bind(this);
    this.playNextVideo = this.playNextVideo.bind(this);
  }

  componentWillReceiveProps = nextProps => {
    if (this.props.categoryName !== nextProps.categoryName) {
      this.setState({
        activeSong: null,
        muted: false
      });
    } else if (this.props.songs.length > nextProps.songs.length){
      let players = this.state.players.slice();
      players = players.filter(player => {
        return nextProps.songs.find(song => {
          return song.videoId === player.a.id;
        }) !== undefined;
      });
      this.setState({ players, activeSong: null, muted: false });
    }
  }

  handleVideoOnReady = e => {
    let players = this.state.players.slice();
    players.push(e.target);
    this.setState({ players });
  }

  handleVideoStateChange = e => {
    let players = this.state.players.slice();
    let targetId = e.target.a.id;
    let activeSong = Object.assign({}, this.state.activeSong);
    let playing = this.state.playing;
    //if paused & active song, update active song info with 'paused'
    if (e.data === 2){
      if (activeSong.videoId === targetId){
        playing = false;
      }
    }

    //if playing, pause all other videos
    if (e.data === 1) {
      players.forEach(player => {
        if (player.a.id !== targetId) {
          player.pauseVideo();
        }
      })
      activeSong = this.props.songs.find(song => {
        return song.videoId === targetId
      });
      playing = true;
    }
    //if ended, refresh video to unstarted state
    //and play next video on the list
    if (e.data === 0) {
      players.forEach(player => {
        if (player.a.id === targetId) {
          player.stopVideo(-1);
        }
      })
      this.playNextVideo(players, activeSong, targetId);
      playing = true;
    }
    this.setState({players, activeSong, playing});
  }

  playNextVideo = (players, activeSong, targetId, nextBoolean=true) => {
    let positionNext = this.props.songs.find(song => {
        return song.videoId === targetId
      }).position;
    nextBoolean ? positionNext += 1 : positionNext -= 1;
    //if at end of list, play first video
    if (positionNext > this.props.songs.length){
      positionNext = 1;
    } else if (positionNext === 0) {
      positionNext = this.props.songs.length;
    }
    let videoIdNext = this.props.songs.find(song => {
      return song.position === positionNext;
    }).videoId;
    players.forEach(player => {
      if (player.a.id === videoIdNext) {
        player.playVideo();
        if (this.state.muted){
          player.mute();
        }
      }
    });
    activeSong = this.props.songs[positionNext-1];
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
    if (this.state.activeSong === null) {
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
    let playPauseControlGlyph = "glyphicon-pause";
    let muteControlGlyph = this.state.muted ?
      "glyphicon-volume-off " : "glyphicon-volume-up";
    let muteTxt = this.state.muted ? "MUTED " : "";
    let activeSongTxtState,
      activeSongGlyphSpan,
      activeSongTxtName,
      glyphClass;
    if (this.state.activeSong) {
      if (this.state.activeSong.position !== undefined){
        if (this.state.playing) {
          activeSongTxtState = "Playing";
          glyphClass = "glyphicon-play-circle";
          playPauseControlGlyph = "glyphicon-play";
        } else {
          activeSongTxtState = "Paused";
          glyphClass = "glyphicon-remove-circle";
          playPauseControlGlyph = "glyphicon-pause";
        }
        activeSongGlyphSpan = <span className={`playPauseGlyph glyphicon ${glyphClass}`} aria-hidden="true"></span>;
        activeSongTxtName = `#${this.state.activeSong.position}: `
          + `${this.state.activeSong.songName} by `
          + `${this.state.activeSong.artist}`;
      }
    }

    let playListControlsDiv;
    //only show playListControls when all players are loaded
    if (this.state.players.length === this.props.songs.length) {
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

        <div id="songPlaying">
          {muteTxt}
          {activeSongTxtState}
          {activeSongGlyphSpan}
          {activeSongTxtName}
        </div>
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

export default SongTable;
