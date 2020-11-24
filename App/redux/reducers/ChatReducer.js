export default function (state = {systemMessages: []}, action) {
  switch (action.type) {
    case 'emptySystemMessages':
      return {systemMessages: []};
    case 'updateSystemMessages':
      return {systemMessages: [...state.systemMessages, action.payload]};
    default:
      return state;
  }
}
