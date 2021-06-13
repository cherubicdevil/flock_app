import {EMAIL_CHANGED, PASSWORD_CHANGED} from '../actions/types';

const INITIAL_STATE = {email: '', password: '', user: {displayName: '', uid: -1, email: '', guest: false}};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case EMAIL_CHANGED:
			return {...state, email: action.payload};
		case PASSWORD_CHANGED:
			return {...state, password: action.payload};
		case 'user_login':
			return {...state, password: user};
		case 'guest':
			return {...state, guest: true};
		case 'guest_off':
			return {...state, guest:false};
		default:
			return state;
	}
};
