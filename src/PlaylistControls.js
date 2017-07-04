import React, { Component } from 'react';
import { connect } from 'react-redux';
import './PlaylistControls.css';
import {
  handlePlayNextControl,
  handlePlayPauseControl,
  handleMuteControl,
} from './actions';

class PlaylistControls extends Component {
  render() {
    let playPauseControlGlyph = this.props.isPlaying ? "glyphicon-play" : "glyphicon-pause";
    let muteControlGlyph = this.props.isMuted ?
      "glyphicon-volume-off " : "glyphicon-volume-up";
    let playListControlsDiv;
    //only show playListControls when all players are loaded
    if (this.props.arePlayersLoaded) {
      playListControlsDiv = (
       <div id="playlistControls">
          <a id="prevSong" className="resume btn btn-default btn-sm" role="button" href="" onClick={e => this.props.handlePlayNextControl(e, false)}>
            <span className="glyphicon glyphicon-backward" aria-hidden="true"></span>
          </a>
          <a id="playPauseSong" className="firstStart btn btn-default btn-sm" role="button" href="" onClick={this.props.handlePlayPauseControl}>
            <span className={`glyphicon ${playPauseControlGlyph}`} aria-hidden="true"></span>
          </a>
          <a id="muteSong" className="btn btn-default btn-sm" role="button" href="" onClick={this.props.handleMuteControl}>
            <span className={`glyphicon ${muteControlGlyph}`} aria-hidden="true"></span>
          </a>
          <a id="nextSong" className="resume btn btn-default btn-sm" role="button" href="" onClick={e => this.props.handlePlayNextControl(e, true)}>
            <span className="glyphicon glyphicon-forward" aria-hidden="true"></span>
          </a>
        </div>
      );
    }
    return (
      <div>
        {playListControlsDiv}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    arePlayersLoaded: state.arePlayersLoaded,
    isPlaying: state.isPlaying,
    isMuted: state.isMuted
  }
};

const mapDispatchToProps = {
  handlePlayNextControl,
  handlePlayPauseControl,
  handleMuteControl
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistControls);
