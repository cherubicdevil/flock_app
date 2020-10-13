import React from 'react'
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native'

const HomeHeader = () => {
	return (
		<View style={styles.container}>
			<Image style={styles.iconStyle} source={require('App/Assets/Images/flockicon4.png')} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 4.5,
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 5,
		backgroundColor: '#4a26ed',
	},
	iconStyle: {
		paddingLeft: 25,
		paddingRight: 15,
		marginTop: 35,
		resizeMode: 'cover',
		height: 24,
		width: 24,
		borderRadius: 15,
	},
	iconContainerStyle: {
		borderRadius: 12,
		width: 24,
		height: 24,
	},
	spacerStyle: {
		flex: 10,
	},
})

export default HomeHeader
