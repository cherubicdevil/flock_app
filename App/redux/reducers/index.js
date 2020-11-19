import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import GooseReducer from './GooseReducer';
import VidReducer from './VidReducer';
import ModalReducer from './ModalReducer';
import UserInfoReducer from './UserInfoReducer';

export default combineReducers({
  auth: AuthReducer,
  goose: GooseReducer,
  videopage: VidReducer,
  modal: ModalReducer,
  userInfo: UserInfoReducer,
});
