import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Header = (props) => {
	const {textStyle, viewStyle} = styles;
	return (
		<View style={viewStyle}>
			<Text style={textStyle}>{props.headerText}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	textStyle: {
		fontSize: 20,
	},
	viewStyle: {
		height: 90,
		paddingTop: 50,
		alignItems: 'center',
		backgroundColor: '#F8F8F8',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.2,

		elevation: 2,
		position: 'relative',
	},
});

export {Header};
