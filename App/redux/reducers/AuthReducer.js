import {EMAIL_CHANGED, PASSWORD_CHANGED} from '../actions/types';

const INITIAL_STATE = {email: '', password: '', user: {displayName: '', uid: -1, email: ''}};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case EMAIL_CHANGED:
			return {...state, email: action.payload};
		case PASSWORD_CHANGED:
			return {...state, password: action.payload};
		case 'user_login':
			return {...state, password: user};
		default:
			return state;
	}
};
