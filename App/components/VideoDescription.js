import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Card, CardSection, Button} from 'App/components/common';

const VideoDescription = ({album, navigation, user, description, style}) => {
	const {url, price, title, image} = album;
	const {
		thumbnailStyle,
		headerContentStyle,
		thumbnailContainerStyle,
		headerTextStyle,
		imageStyle,
	} = styles;

	return (
		<TouchableOpacity
			style={[style, {width: '97%', paddingLeft: 5}]}
			onPress={() => {
				if (navigation) {
					navigation.navigate('Product', {album});
				}
			}}>
			<View>
				<CardSection
					style={{
						borderRadius: 5,
						backgroundColor: 'rgba(0,0,0,0.7)',
						color: '#fff',
						borderColor: '#000',
					}}>
					<View style={{flex: 1, flexDirection: 'row', opacity: 1.0}}>
						<View style={{flex: 1}}>
							<Text style={{fontSize: 12, color: '#fff'}}>{user}</Text>
							<Text style={{marginTop: 5, fontSize: 12, color: '#fff'}}>
								{description}
							</Text>
						</View>
						<View
							style={{
								flex: 1,
								flexDirection: 'row',
								color: '#fff',
								opacity: 1.0,
							}}>
							<Image source={{uri: image}} style={imageStyle} />
							<View style={{flex: 2, paddingLeft: 5}}>
								<View style={headerContentStyle}>
									<Text style={headerTextStyle}>{title}</Text>
									<Text style={{color: '#fff'}}>${price}</Text>
								</View>
							</View>
						</View>
					</View>
				</CardSection>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	headerContentStyle: {
		flexDirection: 'column',
		justifyContent: 'space-around',
		color: '#fff',
	},
	headerTextStyle: {
		fontSize: 18,
		color: '#fff',
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
		opacity: 1.0,
		width: '100%',
		height: undefined,

		aspectRatio: 1,
		resizeMode: 'cover',
		flex: 1,
	},
});

export default VideoDescription;
