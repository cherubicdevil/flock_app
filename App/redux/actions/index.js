import {EMAIL_CHANGED, PASSWORD_CHANGED, ADD_GOOSE_EGGS} from './types';

const goose_increment = 5;
export const emailChanged = (text) => {
	return {
		type: EMAIL_CHANGED,
		payload: text,
	};
};

export const passwordChanged = (text) => {
	return {
		type: PASSWORD_CHANGED,
		payload: text,
	};
};

export const addGoose = () => {
	return {
		type: ADD_GOOSE_EGGS,
	};
};

export const setEgg = (number) => {
	return {
		type: 'setEgg',
		payload: number,
	};
};

export const showVid = () => {
	return {
		type: 'showVid',
		payload: true,
	};
};

export const hideVid = () => {
	return {
		type: 'hideVid',
		payload: false,
	};
};

export const sendData = (data) => {
	return {
		type: 'sendData',
		payload: data,
	};
};

export const sendIndex = (index) => {
	return {
		type: 'sendIndex',
		payload: false,
	};
};

export const sendCarouselIndex = (index) => {
	return {
		type: 'carIndex',
		payload: index,
	};
};

export const toggleModal = () => {
	return {
		type: 'toggle',
	};
};
