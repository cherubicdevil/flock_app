export default function setVidVisible(
	state = {
		...state,
		vidVisible: true,
		vidData: [],
		vidIndex: true,
		carIndex: 0,
	},
	action,
) {
	switch (action.type) {
		case 'showVid':
			return {...state, vidVisible: true};
		case 'hideVid':
			return {...state, vidVisible: false};
		case 'sendData':
			console.log('SENDING DATA');
			console.log(action.payload);
			return {...state, vidData: action.payload};
		case 'sendIndex':
			console.log('THIS IS ME ', action.payload);
			return {...state, vidIndex: false};
		case 'sendCarouselIndex':
			return {...state, carIndex: action.payload};
		default:
			return state;
	}
}
