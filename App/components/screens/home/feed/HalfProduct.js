import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	Dimensions,
	TouchableOpacity,
} from 'react-native';
import {constants} from 'App/constants';
import { BaseRouter } from '@react-navigation/native';

const HalfProduct = ({navigation, album}) => {
	const dwidth = Dimensions.get('window').width / 2;
	console.log("IM HERE");

	return (
		<View
			style={{
				marginBottom: 10,
				borderRadius: 15,
				width: '95%',
				marginLeft: 5,
				marginRight: 30,
				borderWidth: 1,
				borderColor: '#fc9',
				padding: 5,
				backgroundColor: 'white',

				height: 200,
			}}>
				<Text>{album.flock}</Text>
			{/* <TouchableOpacity
				onPress={() => {
					navigation.navigate('Product', {album});
				}}>
				<Image
					source={{uri: album.image}}
					style={{
						height: 200,
						width: dwidth - 20,
						borderColor: 'white',
						borderWidth: 10,
						overflow: 'hidden',
						shadowColor: 'black',
						shadowRadius: 10,
						shadowOpacity: 1,
					}}
				/>
				<View style={{flex: 1, height: 70}}>
					<Text
						style={{
							flex: 3,
							paddingLeft: 10,
							paddingRight: 10,
							fontFamily: 'Nunito-Light',
						}}>
						{album.title}
					</Text>
					<View
						style={{
							flex: 1,
							flexDirection: 'row',
							justifyContent: 'space-between',
						}}>
						<Text
							style={{
								flex: 1,
								fontFamily: 'Nunito-Light',
								color: constants.PURPLEORANGE,
								paddingLeft: 10,
								fontSize: 14,
							}}>
							${album.price}
						</Text>
						<Text
							style={{
								flex: 2,
								fontFamily: 'Nunito-Light',
								fontSize: 11,
								paddingTop: 2.5,
								alignItems: 'flex-start',
								justifyContent: 'flex-end',
								color: constants.LIGHTGREY,
							}}>
							{Math.round(Math.random() * 100) + ' bought'}
						</Text>
					</View>
				</View>
			</TouchableOpacity> */}
		</View>
	);
};

const styles = StyleSheet.create({});

export default HalfProduct;
