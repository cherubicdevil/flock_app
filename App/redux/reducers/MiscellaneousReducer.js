import {EMAIL_CHANGED, PASSWORD_CHANGED} from '../actions/types';

export default (state = {commentsModal: false}, action) => {
	switch (action.type) {
		case 'TOGGLE_COMMENTS':
			return {...state, commentsModal: !state.commentsModal};
		default:
			return state;
	}
};
