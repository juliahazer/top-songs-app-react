import {
  SET_SONGS,
  NAV_CHANGE,
  NUM_SONGS_CHANGE,
  COUNTRY_CODE_CHANGE
} from './actions';

const DEFAULT_STATE = {
  countryCode: 'us',
  genreNum: 0,
  totalNumSongs: 5,
  songs: []
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
    default:
      return state;
  }
}

export default rootReducer
