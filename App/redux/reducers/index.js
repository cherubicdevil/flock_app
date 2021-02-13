import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import GooseReducer from './GooseReducer';
import VidReducer from './VidReducer';
import ModalReducer from './ModalReducer';
import UserInfoReducer from './UserInfoReducer';
import ChatReducer from './ChatReducer';
import MiscellaneousReducer from './MiscellaneousReducer';

export default combineReducers({
  auth: AuthReducer,
  goose: GooseReducer,
  egg: GooseReducer,
  videopage: VidReducer,
  modal: ModalReducer,
  userInfo: UserInfoReducer,
  chat: ChatReducer,
  miscel: MiscellaneousReducer,
});
