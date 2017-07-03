import {
  SET_SONGS,
  NAV_CHANGE
} from './actions';

const DEFAULT_STATE = {
  countryCode: 'us',
  country: 'US',
  genreNum: 0,
  totalCount: 2,
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
    // case LOAD_API_STATE:
    //   return {
    //     ...state,
    //     data: {
    //       user: action.payload.data.requestUser,
    //       gameView: action.payload.data.requestGameView,
    //       createSession: action.payload.data.requestCreateSession
    //   }};
    // case GUITAR_GAME_START:
    //   return {...state, guitarGameStart: true};
    // case UPDATE_FRET_DIV_SIZE:
    //   return {
    //     ...state,
    //     guitarImg: action.payload.guitarImg
    //   }
    // case REMOVE_ALL_FRET_CIRCLES:
    //   return {...state, fretboardCircleStatus: {...DEFAULT_STATE.fretboardCircleStatus}};
    // case UPDATE_FRET_CIRCLE:
    //   return {
    //     ...state,
    //     fretboardCircleStatus: {
    //       ...state.fretboardCircleStatus,
    //       [action.payload.stringNum]: {
    //         ...state.fretboardCircleStatus[action.payload.stringNum],
    //         [action.payload.fretNum]: action.payload.hasCircle
    //       }
    //     }
    //   };
    // case UPDATE_POINTS:
    //   return {
    //     ...state,
    //     data: {
    //       ...state.data,
    //       gameView: {
    //         ...state.data.gameView,
    //         total_points: action.payload.totalPoints
    //       }
    //     }
    //   };
    default:
      return state;
  }
}

export default rootReducer
