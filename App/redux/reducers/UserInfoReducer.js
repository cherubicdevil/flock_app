export default function (state = {likedVideos: []}, action) {
  switch (action.type) {
    case 'LIKED_VIDEO':
      // Possible FLOCK_BUG should there be {...state} here?
      // check if berry state is retained after liking a video
      return {likedVideos: [...state.likedVideos, action.payload]};
    case 'DISLIKED_VIDEO':
      // Possible FLOCK_BUG should there be {...state} here?
      // check if berry state is retained after liking a video
      const index = state.likedVideos.indexOf(action.payload);
      if (index !== -1) {
        state.likedVideos.splice(index, 1);
      }
      return state;
    default:
      return state;
  }
}
