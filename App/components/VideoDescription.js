import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	ImageBackground,
} from 'react-native';
import {Card, CardSection, Button} from 'App/components/common';

const VideoDescription = ({album, navigation, user, description, style}) => {
	var url, price, title, image;
	if (album) {
		url = album.url;
		price = album.price;
		title = album.title;
		image = album.image;
	}
	const {
		thumbnailStyle,
		headerContentStyle,
		thumbnailContainerStyle,
		headerTextStyle,
		imageStyle,
	} = styles;

	const renderPrice = () => {
		if (image) {
			return (
				<ImageBackground
					source={require('App/Assets/Images/Orange_Gradient_Small.png')}
					imageStyle={{borderRadius: 55}}
					style={{
						flex: 1,
						//backgroundColor: '#e3e',
						borderRadius: 55,
						justifyContent: 'center',
						alignItems: 'center',
						paddingLeft: 10,
						paddingRight: 10,
						marginBottom: 5,
						marginRight: 10,
						width: 80,
					}}>
					<Text style={{color: '#fff', flex: 1, marginTop: 2}}>${price}</Text>
				</ImageBackground>
			);
		} else {
			return <View />;
		}
	};

	const renderRightBlurb = () => {
		if (image) {
			return (
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						color: '#000',
						opacity: 1.0,
						borderLeftWidth: 1,
						borderColor: '#aeaeb2',
						paddingLeft: 15,
					}}>
					<Image source={{uri: image}} style={imageStyle} />
					<View style={{flex: 2, paddingLeft: 5}}>
						<View style={headerContentStyle}>
							<Text style={headerTextStyle}>{title}</Text>
							{renderPrice()}
						</View>
					</View>
				</View>
			);
		} else {
			return <View />;
		}
	};
	return (
		<TouchableOpacity
			style={[
				style,
				{
					width: image ? '95%' : '55%',
					alignSelf: image ? 'center' : 'flex-start',
					marginLeft: image ? 0 : 10,
					paddingLeft: 0,
				},
			]}
			onPress={() => {
				if (navigation) {
					navigation.navigate('Product', {album});
				}
			}}>
			<View>
				<Image
					source={require('App/Assets/Images/blurbArrow.png')}
					style={{
						position: 'absolute',
						left: 50,
						top: -30,
						width: 50,
						height: 30,
					}}
				/>
				<CardSection style={styles.blurbStyle}>
					<View style={{flex: 1, flexDirection: 'row', opacity: 1.0}}>
						<View style={{marginTop: 10, marginLeft: 20, flex: 1}}>
							<Text
								style={{
									fontSize: 12,
									color: '#000',
									fontFamily: 'Nunito-Bold',
								}}>
								{'@' + user}
							</Text>
							<Text
								style={{
									marginTop: 5,
									fontSize: 12,
									color: '#000',
									fontFamily: 'Nunito-Light',
								}}>
								{description}
							</Text>
						</View>
						{renderRightBlurb()}
					</View>
				</CardSection>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	noStyle: {
		backgroundColor: 'rgba(255,255,255, 0)',
	},
	blurbStyle: {
		borderRadius: 145,
		backgroundColor: 'rgba(255,255,255, 1)',
		color: '#000',
		borderColor: '#000',
		alignSelf: 'center',
		height: 100,
	},
	panelStyle: {
		borderRadius: 5,
		backgroundColor: 'rgba(0,0,0,0.7)',
		color: '#fff',
		borderColor: '#000',
	},
	headerContentStyle: {
		flex: 1,
		marginTop: 5,
		marginRight: 5,
		flexDirection: 'column',
		justifyContent: 'space-around',
		color: '#000',
	},
	headerTextStyle: {
		fontFamily: 'Nunito-Bold',
		flex: 3,
		fontSize: 14,
		color: '#000',
	},
	thumbnailStyle: {
		height: 50,
		width: 50,
	},
	thumbnailContainerStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 10,
		marginRight: 10,
	},
	imageStyle: {
		borderRadius: 10,
		marginTop: 5,
		opacity: 1.0,
		width: '100%',
		height: undefined,

		aspectRatio: 1,
		resizeMode: 'cover',
		flex: 1,
	},
});

export default VideoDescription;
