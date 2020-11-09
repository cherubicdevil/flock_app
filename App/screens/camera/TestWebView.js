import React from 'react';
import {WebView} from 'react-native-webview';
import {View, Text, StyleSheet} from 'react-native';

const screenname = () => {
	return (
		<View>
			<View>
				<Text>Embedded browser!</Text>
			</View>

			<View style={{width: '100%', height: '100%'}}>
				<WebView source={{uri: 'https://medium.com'}} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({});

export default screenname;
