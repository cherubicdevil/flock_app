import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

const Button = ({ onPress, children }) => {
	return (
		<TouchableOpacity style={styles.buttonStyle} onPress={onPress}>
			<Text style={styles.textStyle}>{children}</Text>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	textStyle: {
		alignSelf: 'center',
		color: '#007aff',
		fontSize: 16,
		fontWeight: '600',
		paddingTop: 10,
		paddingBottom: 10,
	},
	buttonStyle: {
		flex: 1,
		alignSelf: 'stretch',
		alignItems: 'center',
		borderWidth: 1,
		borderRadius: 2,
		borderColor: '#007aff',
		shadowColor: '#000',
		shadowOffset: { width: 1, height: 1 },
		shadowRadius: 2,
		marginLeft: 5,
		marginRight: 5,
	},
})

export { Button }
