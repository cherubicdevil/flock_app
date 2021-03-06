import {uploadUserInfo, getIndexOfData} from '../../utils';
import {firebase, au, db} from 'App/firebase/config';

export default function (state = {likedVideos: [], eggCoins: 0}, action) {
  switch (action.type) {
    case 'LIKED_VIDEO':
      // Possible FLOCK_BUG should there be {...state} here?
      // check if berry state is retained after liking a video
      // state.likedVideos.indexOf(action.payload) === -1
      if (
        !state.likedVideos.some((item) => item.title === action.payload.title)
      ) {
        state.likedVideos.splice(state.likedVideos.length, 0, action.payload);
        uploadUserInfo(state);
      }

      return state;
    case 'DISLIKED_VIDEO':
      // Possible FLOCK_BUG should there be {...state} here?
      // check if berry state is retained after liking a video
      //const index = state.likedVideos.indexOf(action.payload);
      var index = -1;
      var isIn = false;
      var counter = 0;
      index = getIndexOfData(state.likedVideos, action.payload);
      isIn = index !== -1;
      if (isIn) {
        state.likedVideos.splice(index, 1);
        uploadUserInfo(state);
      }

      return state;
    case 'IMPORT_USER_INFO':
      return action.payload;
    case 'IMPORT_CHAT_ID':
      return {...state, chatGroups: action.payload};
    case 'SET_USER_INFO':
      return {...action.payload}
    case 'UPDATE_DATA':
      var [membertype, actiontype, arraytype, data] = action.payload;
      var res = {...state};
      if (arraytype === "array") {
        if (actiontype === "add") {
          if (res[membertype] ===  null || res[membertype] === undefined || res[membertype].length == 0) {
            res[membertype] = [data];
          } else {
            res[membertype] = [...res[membertype], data];
          }
        } else {
            const index = res[membertype].indexOf(data);
            if (index !== -1) res[membertype].splice(index,1);
        }
      } else {
        res[membertype] = data;
        // assumed to always be add if not array
      }
      return res;
    case 'UPDATE_DATA_UPLOAD':
      var [membertype, actiontype, arraytype, data] = action.payload;
      const past = state[membertype]
      var res = {...state};
        res[membertype] = data;
        // assumed to always be add if not array
      if (past != data) {
        uploadUserInfo(res);
      }
      
      return res;
    case 'spendEggs':
      const num = action.payload;
      if (num <= state.eggCoins ) {
        if (au.currentUser) {
        db.collection('users').doc(au.currentUser.uid).update({
          eggCoins: firebase.firestore.FieldValue.increment(-num)
      });
        return { ...state, eggCoins: state.eggCoins - num};
    }
      }
      
      return state;
    case 'getEggs':
      if (au.currentUser) {
      db.collection('users').doc(au.currentUser.uid).update({
        eggCoins: firebase.firestore.FieldValue.increment(action.payload)
    });
    return { ...state, eggCoins: state.eggCoins + action.payload};
  }
  return state;


    default:
      return state;
  }
}
