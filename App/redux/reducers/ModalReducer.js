const INITIAL_STATE = {email: '', password: '', visible: false};

export default function (state = {visible: false}, action) {
	switch (action.type) {
		case 'toggle':
			return {visible: !state.visible};
		case 'toggleOff':
			return {visible: false};
		default:
			return state;
	}
}
