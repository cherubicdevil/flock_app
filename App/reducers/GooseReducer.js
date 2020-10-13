import {ADD_GOOSE} from '../actions/types';

const INITIAL_STATE = {email: '', password: '', count: 0};

export default function counter(state = {count: 0}, action) {
	const count = state.count;
	switch (action.type) {
		case 'increase':
			console.log(count);
			return {count: count + 1};
		case 'setEgg':
			return {count: action.payload};
		default:
			return state;
	}
}
