import React, { Component } from 'react';
import { connect } from 'react-redux';
import './SongPlayingInfo.css';

class SongPlayingInfo extends Component {
  render() {
    let activeSongTxtState,
      activeSongGlyphSpan,
      activeSongTxtName,
      glyphClass,
      muteTxt;
    if (this.props.activeSong !== null) {
      if (this.props.activeSong.position !== undefined){
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
        activeSongTxtName = `#${this.props.activeSong.position}: `
          + `${this.props.activeSong.songName} by `
          + `${this.props.activeSong.artist}`;
      }
    }
    muteTxt = this.props.isMuted ? "MUTED: " : "";
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
    activeSong: state.activeSong,
    isPlaying: state.isPlaying,
    isMuted: state.isMuted
  }
};

export default connect(mapStateToProps)(SongPlayingInfo);
