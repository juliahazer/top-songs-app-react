import React, { Component } from 'react';
import { connect } from 'react-redux';
import Song from './Song';

class SongTable extends Component {

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
          videoId={song.videoId}
        />
      )
    });

    return (
      <div>
        <table className="table table-striped table-hover table-responsive table-sm">
          <thead>
            <tr>
              <th>Position</th>
              <th>Song / Artist</th>
              <th>Video</th>
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
    songs: state.songs
  }
};

export default connect(mapStateToProps)(SongTable);
