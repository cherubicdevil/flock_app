import React from 'react';
import {TextInput, View, Text} from 'react-native';

const Input = (props) => {
	const {
		label,
		value,
		onChangeText,
		placeholder,
		secureTextEntry,
		style,
		conStyle,
		labStyle,
	} = props;
	const {inputStyle, labelStyle, containerStyle} = styles;
	return (
		<View style={[containerStyle, conStyle, style]}>
			<Text style={[labelStyle, labStyle]}>{label}</Text>
			<TextInput
				{...props}
				secureTextEntry={secureTextEntry}
				placeholder={placeholder}
				autoCorrect={false}
				value={value}
				onChangeText={onChangeText}
				style={[inputStyle, style]}
			/>
		</View>
	);
};

const styles = {
	inputStyle: {
		color: '#000',
		paddingRight: 5,
		paddingLeft: 5,
		fontSize: 18,
		lineHeight: 23,
		flex: 2,
		borderWidth: 2,
		borderRadius: 55,
	},
	labelStyle: {
		fontSize: 18,
		paddingLeft: 20,
		flex: 1,
	},
	containerStyle: {
		height: 40,
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
};

export {Input};
