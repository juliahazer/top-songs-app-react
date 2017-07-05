import {
  SET_SONGS,
  SET_PLAYERS,
  NAV_CHANGE,
  NUM_SONGS_CHANGE,
  COUNTRY_CODE_CHANGE,
  ADD_PLAYER,
  SET_PLAYERS_LOADED,
  CHANGE_IS_PLAYING,
  CHANGE_IS_MUTED,
  SET_ACTIVE_SONG_IDX
} from './actions';

const DEFAULT_STATE = {
  countryCode: 'us',
  genreNum: 0,
  totalNumSongs: 2,
  songs: [],
  players: [],
  arePlayersLoaded: false,
  activeSongIdx: -1,
  isMuted: false,
  isPlaying: false
}

const rootReducer = (state = DEFAULT_STATE, action) => {
  switch(action.type) {
    case SET_SONGS:
      let songsArr = action.payload.songs.slice();
      songsArr = songsArr.map(song => Object.assign({}, song));
      return {
        ...state,
        songs: songsArr
      }
    case SET_PLAYERS:
      let playersArr = action.payload.players.slice();
      playersArr = playersArr.map(player => Object.assign({}, player));
      return {
        ...state,
        players: playersArr
      }
    case NAV_CHANGE:
      return {
        ...state,
        genreNum: action.payload.genreNum
      }
    case NUM_SONGS_CHANGE:
      return {
        ...state,
        totalNumSongs: action.payload.totalNumSongs
      }
    case COUNTRY_CODE_CHANGE:
      return {
        ...state,
        countryCode: action.payload.countryCode
      }
    case ADD_PLAYER:
      return {
        ...state,
        players: [...state.players, action.payload.player]
      }
    case SET_PLAYERS_LOADED:
      return {
        ...state,
        arePlayersLoaded: action.payload.areLoaded
      }
    case CHANGE_IS_PLAYING:
      return {
        ...state,
        isPlaying: action.payload.isPlaying
      }
    case CHANGE_IS_MUTED:
      return {
        ...state,
        isMuted: action.payload.isMuted
      }
    case SET_ACTIVE_SONG_IDX:
      return {
        ...state,
        activeSongIdx: action.payload.activeSongIdx
      }
    default:
      return state;
  }
}

export default rootReducer
