import $ from 'jquery';
import YouTube from 'react-youtube';

export const SET_SONGS = 'SET_SONGS';
export const NAV_CHANGE = 'NAV_CHANGE';
export const NUM_SONGS_CHANGE = 'NUM_SONGS_CHANGE';
export const COUNTRY_CODE_CHANGE = 'COUNTRY_CODE_CHANGE';
export const ADD_PLAYER = 'ADD_PLAYER';
export const CHANGE_IS_PLAYING = 'CHANGE_IS_PLAYING';
export const SET_ACTIVE_SONG = 'SET_ACTIVE_SONG';
export const RESET_ACTIVE_SONG_IS_MUTED = 'RESET_ACTIVE_SONG_IS_MUTED';

export const MAIN_NAV_ORDER = [0, 14, 21, 6, 12];
export const SUB_NAV_ORDER = [20, 5, 11, 19];

export const GENRE_NUM_LOOKUP = {
  0: 'All',
  14: 'Pop',
  21: 'Rock',
  6: 'Country',
  12: 'Latino',
  20: 'Alternative',
  5: 'Classical',
  11: 'Jazz',
  19: 'World',
};

export const COUNTRY_CODE_LOOKUP = {
  'us': 'US',
  'au': 'Australia',
  'fr': 'France',
  'de': 'Germany',
  'gb': 'Great Britain',
  'id': 'Indonesia',
  'it': 'Italy',
  'mx': 'Mexico',
  'vn': 'Vietnam'
}

const setItunesAPIUrl = (countryCode, totalNumSongs, genreNum) => {
  let itunesAPIUrl = `https://itunes.apple.com/${countryCode}`
    + `/rss/topsongs/limit=${totalNumSongs}/`;
  if (genreNum !== 0) {
    itunesAPIUrl += `genre=${genreNum}/`;
  }
  itunesAPIUrl += "json";
  return itunesAPIUrl;
}

const setYouTubeAPIUrl = song => {
  const key = 'AIzaSyDiv_c2pu67HdptBE4Xu0AFpcTCXl72wbI';
  let artistName = song.artist;
  let songName;
  /*if song features an artist, remove featured artist
  from songName*/
  let featureIndex = song.songName.indexOf(" (feat. ");
  if (featureIndex === -1) {
    songName = song.songName;
  }
  else {
    songName = song.songName.slice(0,featureIndex);
  }
  let youtubeAPIUrl = `https://www.googleapis.com/youtube/v3/`
    + `search?part=snippet&maxResults=1&q=${songName}+`
    + `${artistName}&type=video&key=${key}`;
  return youtubeAPIUrl;
}

/*Create a song object with songName, position, artist,
bioUrl, nameBio info based on itunes API results*/
const createSongObject = (song, index) => {
  let songObj = {};
  songObj.songName = song['im:name'].label;
  songObj.position = index + 1;
  songObj.artist = song['im:artist'].label;
  let artistIdUrl = song['im:artist'].attributes.href;
  let indexQues = artistIdUrl.indexOf('?uo');
  artistIdUrl = artistIdUrl.slice(0,indexQues);
  songObj.bioUrl = artistIdUrl + "#fullText";
  let regex = /artist\/(.+?)\/id/;
  let nameBio = regex.exec(artistIdUrl)[1];
  songObj.nameBio = nameBio.split('-').map(name => {
    return name[0].toUpperCase() + name.slice(1);
  }).join(' ');
  return songObj;
}

export function newApisCall ({
  genreNum = null,
  countryCode = null,
  totalNumSongs = null,
  numCountDiff = 0
} = {}) {
  return function (dispatch, getState) {
    genreNum = genreNum !== null ? genreNum : getState().genreNum;
    countryCode = countryCode || getState().countryCode;
    if (totalNumSongs !== null) {
      numCountDiff = totalNumSongs - getState().totalNumSongs;
    }
    totalNumSongs = totalNumSongs || getState().totalNumSongs;
    let itunesAPIUrl = setItunesAPIUrl(
      countryCode,
      totalNumSongs,
      genreNum
    );
    /*itunes api call, then w/ results,
    create an object for each song,
    and store these objects in newSongsArr*/
    $.ajax({
      method: "GET",
      url: itunesAPIUrl,
      dataType: "json"
    }).then(data => {
      let songs = data.feed.entry;
      let songsCurrHaveLength = 0;
      //limit api calls to new songs
      if (numCountDiff > 0) {
        songsCurrHaveLength = totalNumSongs - numCountDiff;
        songs = data.feed.entry.slice(songsCurrHaveLength);
      }
      let newSongsArr = songs.map((song, index) => {
        return createSongObject(song, index + songsCurrHaveLength);
      });
      let count = numCountDiff > 0 ? songsCurrHaveLength : 0;
      /*for each song, call the youtube api
      and add the results: videoId and videoUrl,
      to each song object*/
      newSongsArr.forEach(song => {
        let youtubeAPIUrl = setYouTubeAPIUrl(song);
        let songsState = getState().songs.slice();
        $.ajax({
          method: "GET",
          url: youtubeAPIUrl,
          dataType: "json"
        }).then(data => {
          count++;
          let vidId = data.items[0].id.videoId;
          song.videoId = vidId;
          song.videoUrl = `https://www.youtube.com/embed/${vidId}`
            + `?enablejsapi=1`;
          /*ensure that youtube info for all videos
          is retrieved, then display html of all results*/
          if (count === totalNumSongs) {
            let finalSongs;
            if (numCountDiff > 0) {
              finalSongs = songsState.concat(newSongsArr);
            } else {
              finalSongs = newSongsArr;
            }
            dispatch(setSongs(finalSongs));
            if (genreNum !== null) {
              dispatch(navChange(genreNum));
              dispatch(resetActiveSongIsMuted());
            }
            if (totalNumSongs !== null) {
              dispatch(numSongsChange(totalNumSongs));
            }
            if (countryCode !== null) {
              dispatch(countryCodeChange(countryCode));
            }
          }
        });
      });
    });
  }
}

function setSongs (songs) {
  return { type: SET_SONGS, payload: {songs}};
}

function navChange (genreNum) {
  return { type: NAV_CHANGE, payload: {genreNum}};
}

function numSongsChange (totalNumSongs) {
  return { type: NUM_SONGS_CHANGE, payload: {totalNumSongs}};
}

function countryCodeChange (countryCode) {
  return { type: COUNTRY_CODE_CHANGE, payload: {countryCode}};
}

export function addPlayer (e) {
  return { type: ADD_PLAYER, payload: {player: e.target}};
}

export function handleVideoStateChange (e) {
  return function (dispatch, getState) {
    let players = getState().players;
    let targetId = e.target.a.id;
    let activeSong = getState().activeSong;
    let playing = getState().playing;
    let songs = getState().songs;
    let isMuted = getState().isMuted;
    //if paused & active song, update active song info with 'paused'
    if (e.data === 2){
      if (activeSong.videoId === targetId){
        dispatch(changeIsPlaying(false));
      }
    }
    //if playing, pause all other videos
    if (e.data === 1) {
      players.forEach(player => {
        if (player.a.id !== targetId) {
          player.pauseVideo();
        }
      })
      activeSong = songs.find(song => {
        return song.videoId === targetId
      });
      dispatch(setActiveSong(activeSong));
      dispatch(changeIsPlaying(true));
    }
    //if ended, refresh video to unstarted state
    //and play next video on the list
    if (e.data === 0) {
      players.forEach(player => {
        if (player.a.id === targetId) {
          player.stopVideo(-1);
        }
      })
      activeSong = playNextVideo(players, songs, targetId, isMuted); //DO NEED .THIS???
      dispatch(setActiveSong(activeSong));
      dispatch(changeIsPlaying(true));
    }
  }
}

const playNextVideo = (players, songs, targetId, isMuted, nextBoolean=true) => {
  let positionNext = songs.find(song => {
      return song.videoId === targetId
    }).position;
  nextBoolean ? positionNext += 1 : positionNext -= 1;
  //if at end of list, play first video
  if (positionNext > songs.length){
    positionNext = 1;
  } else if (positionNext === 0) {
    positionNext = songs.length;
  }
  let videoIdNext = songs.find(song => {
    return song.position === positionNext;
  }).videoId;
  players.forEach(player => {
    if (player.a.id === videoIdNext) {
      player.playVideo();
      if (isMuted){
        player.mute();
      }
    }
  });
  return songs[positionNext-1];
}

function changeIsPlaying (isPlaying) {
  return { type: CHANGE_IS_PLAYING, payload: {isPlaying}};
}

function setActiveSong (activeSong) {
  return { type: SET_ACTIVE_SONG, payload: {activeSong}};
}

function resetActiveSongIsMuted () {
  return {
    type: RESET_ACTIVE_SONG_IS_MUTED,
    payload: {activeSong: null, isMuted: false}
  };
}
