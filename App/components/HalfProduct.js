import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	Dimensions,
	TouchableOpacity,
} from 'react-native';

const HalfProduct = ({navigation, album}) => {
	const dwidth = Dimensions.get('window').width / 2;

	return (
		<View
			style={{
				marginBottom: 10,
				width: '95%',
				marginLeft: 5,
				marginRight: 30,
				borderWidth: 1,
				borderColor: '#fc9',
				padding: 5,
				borderRadius: 4,
			}}>
			<TouchableOpacity
				onPress={() => {
					navigation.navigate('Product', {album});
				}}>
				<Image
					source={{uri: album.image}}
					style={{height: 200, width: dwidth - 20}}
				/>
				<Text>{album.title}</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({});

export default HalfProduct;
