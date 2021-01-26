import React from 'react'
import { TextInput, View, Text } from 'react-native'

const Input = ({ label, value, onChangeText, placeholder, secureTextEntry, style }) => {
	const { inputStyle, labelStyle, containerStyle } = styles
	return (
		<View style={containerStyle}>
			<TextInput
				secureTextEntry={secureTextEntry}
				placeholder={placeholder}
				autoCorrect={false}
				value={value}
				onChangeText={onChangeText}
				style={[inputStyle, style]}
				placeholderTextColor="rgba(255,255,255,0.3)"
			/>
		</View>
	)
}

const styles = {
	inputStyle: {
		color: '#fff',
		paddingRight: 5,
		paddingLeft: 5,
		fontSize: 18,
		lineHeight: 23,
		flex: 2,
		paddingTop: 12,
		paddingBottom: 10,
		backgroundColor: 'rgba(255,255,255,0.12)',
	},
	labelStyle: {
		color: '#fff',
		fontSize: 18,
		paddingLeft: 20,
		flex: 1,
		opacity: 0.8,
	},
	containerStyle: {
		height: 60,
		flexDirection: 'row',
		alignItems: 'center',
		//borderBottomWidth: 1,
	},
}

export { Input }
