import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getActiveSong } from './actions';
import './SongPlayingInfo.css';

class SongPlayingInfo extends Component {
  render() {
    let activeSongTxtState,
      activeSongGlyphSpan,
      activeSongTxtName,
      glyphClass,
      muteTxt;
    if (this.props.activeSongIdx !== -1) {
      let activeSong = this.props.getActiveSong();
      if (activeSong.position !== undefined){
        muteTxt = this.props.isMuted ? "MUTED: " : "";
        if (this.props.isPlaying) {
          activeSongTxtState = "Playing";
          glyphClass = "glyphicon-play-circle";
        } else {
          activeSongTxtState = "Paused";
          glyphClass = "glyphicon-remove-circle";
        }
        activeSongGlyphSpan = <span
            className={`playPauseGlyph glyphicon ${glyphClass}`}
            aria-hidden="true">
          </span>;
        activeSongTxtName = `#${activeSong.position}: `
          + `${activeSong.songName} by `
          + `${activeSong.artist}`;
      }
    }
    return (
      <div id="songPlaying">
        {muteTxt}
        {activeSongTxtState}
        {activeSongGlyphSpan}
        {activeSongTxtName}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    activeSongIdx: state.activeSongIdx,
    isPlaying: state.isPlaying,
    isMuted: state.isMuted
  }
};

const mapDispatchToProps = {
  getActiveSong
};

export default connect(mapStateToProps, mapDispatchToProps)(SongPlayingInfo);
