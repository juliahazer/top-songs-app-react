import {
  SET_SONGS,
  NAV_CHANGE,
  NUM_SONGS_CHANGE,
  COUNTRY_CODE_CHANGE,
  ADD_PLAYER,
  CHANGE_IS_PLAYING,
  SET_ACTIVE_SONG,
  RESET_ACTIVE_SONG_IS_MUTED
} from './actions';

const DEFAULT_STATE = {
  countryCode: 'us',
  genreNum: 0,
  totalNumSongs: 3,
  songs: [],
  players: [],
  activeSong: null,
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
    case CHANGE_IS_PLAYING:
      return {
        ...state,
        isPlaying: action.payload.isPlaying
      }
    case SET_ACTIVE_SONG:
      return {
        ...state,
        activeSong: action.payload.activeSong
      }
    case RESET_ACTIVE_SONG_IS_MUTED:
      return {
        ...state,
        activeSong: action.payload.activeSong,
        isMuted: action.payload.isMuted
      }
    default:
      return state;
  }
}

export default rootReducer
