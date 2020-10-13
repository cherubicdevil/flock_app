import React, {useEffect} from 'react';
import {
	ImageBackground,
	View,
	Text,
	StyleSheet,
	Image,
	TouchableWithoutFeedback,
} from 'react-native';
import {useSelector} from 'react-redux';
import {firebase} from 'App/firebase/config';
import NavBar from 'App/components/static/NavBar';

const Egg = ({route, navigation}) => {
	const selector = useSelector((state) => state);

	const renderEgg = () => {
		const maxEgg = 80;

		const percent = (selector.goose.count / maxEgg) * 100;
		if (percent < 100) {
			return (
				<View style={{width: 300, height: 400}}>
					<View
						style={{
							width: '100%',
							height: `${percent}%`,
							//height: `${(height / maxEgg) * 100}%`,
							//backgroundColor: '#000',
							position: 'absolute',
							bottom: 0,
							zIndex: 1,
							overflow: 'hidden',
						}}>
						<Image
							style={{
								width: 300,
								height: 400,
								position: 'absolute',
								bottom: 0,
								//resizeMode: 'cover',
							}}
							source={require('App/Assets/Images/Egg_2.png')}
						/>
					</View>
					<Image
						style={{width: 300, height: 400, zIndex: 10}}
						source={require('App/Assets/Images/Egg_1.png')}
					/>
				</View>
			);
		} else {
			return (
				<Image
					style={{width: 300, height: 400}}
					source={require('App/Assets/Images/Egg_3.png')}
				/>
			);
		}
	};
	return (
		<ImageBackground
			style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
			source={require('App/Assets/Images/UpsideDownBackground.png')}>
			<View
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
					width: '100%',
					backgroundColor: 'rgba(0,0,0,0.1)',
				}}>
				<Text
					style={{
						position: 'absolute',
						textAlign: 'center',
						top: 40,
						fontSize: 20,
						borderRadius: 4,
					}}>
					{selector.goose.count} goose egg savings
				</Text>
				<TouchableWithoutFeedback
					onPress={() => {
						navigation.navigate('Profile');
					}}>
					<Image
						style={{
							height: 50,
							width: 50,
							position: 'absolute',
							right: 20,
							top: 30,
							borderRadius: 4,
						}}
						source={require('App/Assets/Images/default-profile-picture.jpg')}
					/>
				</TouchableWithoutFeedback>
				{renderEgg()}
			</View>
			<NavBar route={route} navigation={navigation} />
		</ImageBackground>
	);
};

const styles = StyleSheet.create({});

export default Egg;
