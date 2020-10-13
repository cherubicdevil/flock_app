import React from 'react';
import {Image, TouchableOpacity, View, Text, StyleSheet} from 'react-native';

const NavButton = ({navFunc, icon}) => {
	return (
		<TouchableOpacity onPress={navFunc} style={styles.buttonStyle}>
			<Image source={icon} style={styles.imageStyle} />
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	buttonStyle: {
		flex: 1,
	},
	imageStyle: {
		height: '100%',
		width: null,
		resizeMode: 'contain',
	},
});

export default NavButton;
