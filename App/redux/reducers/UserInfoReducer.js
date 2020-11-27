import {uploadUserInfo, getIndexOfData} from '../../utils';

export default function (state = {likedVideos: []}, action) {
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

      console.log('THIS IS STATE GETTING UPLOADED');
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
    default:
      return state;
  }
}
