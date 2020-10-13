import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import NavBar from 'App/components/static/NavBar';

const Success = ({route, navigation}) => {
	return (
		<View style={{flex: 1, justifyContent: 'center'}}>
			<Image
				source={require('App/Assets/Images/checkmark.png')}
				style={{width: 50, height: 50, alignSelf: 'center'}}
			/>
			<Text style={{alignSelf: 'center'}}>
				Payment processed. Check your email for a receipt.
			</Text>
			<NavBar route={route} navigation={navigation} />
		</View>
	);
};

const styles = StyleSheet.create({});

export default Success;
