export default function setVidVisible(
	state = {
		...state,
		vidVisible: true,
		vidData: [],
		vidIndex: true,
		carIndex: 0,
		leave: false,
	},
	action,
) {
	switch (action.type) {
		case 'showVid':
			return {...state, vidVisible: true};
		case 'hideVid':
			return {...state, vidVisible: false};
		case 'sendData':
			return {...state, vidData: action.payload};
		case 'sendIndex':
			console.log('THIS IS ME ', action.payload);
			return {...state, vidIndex: false};
		case 'sendCarouselIndex':
			return {...state, carIndex: action.payload};
		case 'leave':
			return {...state, leave: action.payload};
		default:
			return state;
	}
}
