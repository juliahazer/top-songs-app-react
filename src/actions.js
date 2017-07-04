import $ from 'jquery';

export const SET_SONGS = 'SET_SONGS';
export const SET_PLAYERS = 'SET_PLAYERS';
export const NAV_CHANGE = 'NAV_CHANGE';
export const NUM_SONGS_CHANGE = 'NUM_SONGS_CHANGE';
export const COUNTRY_CODE_CHANGE = 'COUNTRY_CODE_CHANGE';
export const ADD_PLAYER = 'ADD_PLAYER';
export const SET_PLAYERS_LOADED = 'SET_PLAYERS_LOADED';
export const CHANGE_IS_PLAYING = 'CHANGE_IS_PLAYING';
export const CHANGE_IS_MUTED = 'CHANGE_IS_MUTED';
export const SET_ACTIVE_SONG_IDX = 'SET_ACTIVE_SONG_IDX';

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
    let activeSongIdx = getState().activeSongIdx;
    let newGenreNum = null !== genreNum;
    let newCountryCode = null !== countryCode;
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
        let songsState = getState().songs;
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
            let players = getState().players;
            //if adding new songs
            if (numCountDiff > 0) {
              finalSongs = songsState.concat(newSongsArr);
              //
              // if (activeSongIdx >= songsState.length) {
              //   dispatch(setActiveSongIdx(-1));
              //   dispatch(changeIsPlaying(false));
              // }
            } else {
              finalSongs = newSongsArr;
            }
            if (numCountDiff < 0) {
              players = players.filter(player => {
                return finalSongs.find(song => {
                  return song.videoId === player.a.id;
                }) !== undefined && player.a !== null;
              });
              dispatch(setPlayers(players));
            }
            dispatch(setSongs(finalSongs));
            if (genreNum !== null) {
              dispatch(navChange(genreNum));
            }
            if (totalNumSongs !== null) {
              dispatch(numSongsChange(totalNumSongs));
            }
            if (countryCode !== null) {
              dispatch(countryCodeChange(countryCode));
            }
            //reset for new selections
            if (newGenreNum || newCountryCode) {
              //stops old video if one is the same
              if (activeSongIdx > -1) {
                players.forEach(player => {
                  if (player.a.id === songsState[activeSongIdx].videoId) {
                    player.stopVideo(-1);
                  }
                })
              }
              dispatch(setActiveSongIdx(-1));
              dispatch(changeIsPlaying(false));
              dispatch(changeIsMuted(false));
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

function setPlayers (players) {
  return { type: SET_PLAYERS, payload: {players}};
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

export function addPlayerAndCheckAllLoaded (e) {
  return function (dispatch, getState) {
    if (getState().players.length + 1 === getState().songs.length) {
      dispatch(setPlayersLoaded(true));
    }
    let player = e.target;
    dispatch(addPlayer(player));
  }
}

function addPlayer (player) {
  return { type: ADD_PLAYER, payload: {player}};
}

function setPlayersLoaded (areLoaded) {
  return { type: SET_PLAYERS_LOADED, payload: {areLoaded}};
}

export function handleVideoStateChange (e) {
  return function (dispatch, getState) {
    let players = getState().players;
    let targetId = e.target.a.id;
    let activeSongIdx = getState().activeSongIdx;
    let songs = getState().songs;
    let isMuted = getState().isMuted;
    //if paused & active song, update active song info with 'paused'
    if (e.data === 2){
      if (songs[activeSongIdx].videoId === targetId){
        dispatch(changeIsPlaying(false));
      }
    }
    //if playing...
    else if (e.data === 1) {
      //if already another video playing, pause it
      if (activeSongIdx !== -1) {
        if (targetId !== songs[activeSongIdx].videoId) {
          players.forEach(player => {
            if (player.a.id === songs[activeSongIdx].videoId) {
              player.pauseVideo();
            }
          });
        }
      }
      //mute player if state is set to mute
      players.forEach(player => {
        if (player.a.id === targetId) {
          if (isMuted) {
            player.mute();
          }
        }
      })
      //store index of new video playing
      activeSongIdx = songs.findIndex(song => {
        return song.videoId === targetId
      });
      dispatch(setActiveSongIdx(activeSongIdx));
      dispatch(changeIsPlaying(true));
    }
    //if ended, refresh video to unstarted state
    //and play next video on the list
    else if (e.data === 0) {
      players.forEach(player => {
        if (player.a.id === targetId) {
          player.stopVideo(-1);
        }
      })
      activeSongIdx = playNextVideo(players, songs, activeSongIdx, isMuted);
      dispatch(setActiveSongIdx(activeSongIdx));
      dispatch(changeIsPlaying(true));
    }
  }
}

const playNextVideo = (players, songs, activeSongIdx, isMuted, nextBoolean=true) => {
  let positionNext = songs[activeSongIdx].position;
  nextBoolean ? positionNext += 1 : positionNext -= 1;
  //if at end of list, play first video
  if (positionNext > songs.length){
    positionNext = 1;
  } else if (positionNext === 0) { //if start of list, play last video
    positionNext = songs.length;
  }
  let newActiveSongIdx = songs.findIndex(song => {
    return song.position === positionNext;
  });
  let countPlay = 0;
  players.forEach(player => {
    if (player.a.id === songs[activeSongIdx].videoId) {
      // if (countPause === 0){
        player.pauseVideo();
      // }
    } else if (player.a.id === songs[newActiveSongIdx].videoId) {
      if (countPlay === 0) {
        player.playVideo();
        countPlay++;
        if (isMuted){
          player.mute();
        }
      }
    }
  });
  return newActiveSongIdx;
}

export function handlePlayNextControl(e, nextBoolean) {
  return function (dispatch, getState) {
    e.preventDefault();
    let activeSongIdx = getState().activeSongIdx;
    let songs = getState().songs;
    let players = getState().players;
    let isMuted = getState().isMuted;
    //if first time playing a video,
    //set play either first or last video
    if (activeSongIdx === -1) {
      activeSongIdx = nextBoolean ? songs.length - 1 : 0;
      dispatch(changeIsPlaying(true));
    }
    let newActiveSongIdx = playNextVideo(players, songs,
      activeSongIdx, isMuted, nextBoolean);
    dispatch(setActiveSongIdx(newActiveSongIdx));
  }
}

export function handleMuteControl (e) {
  return function (dispatch, getState) {
    e.preventDefault();
    let players = getState().players.slice();
    let songs = getState().songs;
    let activeSongIdx = getState().activeSongIdx;
    let isMuted = getState().isMuted;
    if (activeSongIdx !== -1) {
      players.forEach(player => {
        if (player.a.id === songs[activeSongIdx].videoId){
          if (player.isMuted()){
            player.unMute();
            isMuted = false;
          } else {
            player.mute();
            isMuted = true;
          }
        }
      });
    } else {
      isMuted = !isMuted;
    }
    dispatch(changeIsMuted(isMuted));
  }
}

export function handlePlayPauseControl (e) {
  return function (dispatch, getState) {
    e.preventDefault();
    let players = getState().players;
    let songs = getState().songs;
    let activeSongIdx = getState().activeSongIdx;
    let isPlaying = getState().isPlaying;
    if (activeSongIdx !== -1) {
      players.forEach(player => {
        if (player.a.id === songs[activeSongIdx].videoId){
          if (isPlaying){
            player.pauseVideo();
          } else {
            player.playVideo();
          }
          isPlaying = !isPlaying;
        }
      });
      dispatch(changeIsPlaying(isPlaying));
    } else { //if no video played yet, play first video
      let isMuted = getState().isMuted;
      let newActiveSongIdx = playNextVideo(players, songs, songs.length-1, isMuted);
      dispatch(setActiveSongIdx(newActiveSongIdx));
      dispatch(changeIsPlaying(true));
    }
  }
}

export function getActiveSong () {
  return function (dispatch, getState) {
    let songs = getState().songs;
    let activeSongIdx = getState().activeSongIdx;
    return activeSongIdx === -1 ? null : songs[activeSongIdx];
  }
}

function changeIsPlaying (isPlaying) {
  return { type: CHANGE_IS_PLAYING, payload: {isPlaying}};
}

function changeIsMuted (isMuted) {
  return { type: CHANGE_IS_MUTED, payload: {isMuted}};
}

function setActiveSongIdx (activeSongIdx) {
  return { type: SET_ACTIVE_SONG_IDX, payload: {activeSongIdx}};
}
