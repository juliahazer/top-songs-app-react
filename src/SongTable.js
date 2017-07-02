import React from 'react';
import Song from './Song';

const SongTable = ({songs}) => {
  let songsComp = songs.map(song => {
    return (
      <Song
        key={"pos" + song.position}
        position={song.position}
        name={song.songName}
        artist={song.artist}
        bioUrl={song.bioUrl}
        nameBio={song.nameBio}
        videoId = {song.videoId}
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

export default SongTable;
