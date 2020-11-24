import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import GooseReducer from './GooseReducer';
import VidReducer from './VidReducer';
import ModalReducer from './ModalReducer';
import UserInfoReducer from './UserInfoReducer';
import ChatReducer from './ChatReducer';

export default combineReducers({
  auth: AuthReducer,
  goose: GooseReducer,
  videopage: VidReducer,
  modal: ModalReducer,
  userInfo: UserInfoReducer,
  chat: ChatReducer,
});
