import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Card, CardSection, Button} from 'App/components/common';

const AlbumDetail = ({album, navigation, style}) => {
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
			style={[{opacity: 0.9}, style]}
			onPress={() => {
				if (navigation) {
					navigation.navigate('Product', {album});
				}
			}}>
			<Card>
				<CardSection>
					<Image source={{uri: image}} style={imageStyle} />
					<CardSection style={{flex: 4}}>
						<View style={headerContentStyle}>
							<Text style={headerTextStyle}>{title}</Text>
							<Text>${price}</Text>
						</View>
					</CardSection>
				</CardSection>
			</Card>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	headerContentStyle: {
		flexDirection: 'column',
		justifyContent: 'space-around',
	},
	headerTextStyle: {
		fontSize: 18,
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
		width: '100%',
		height: undefined,
		aspectRatio: 135 / 76,
		resizeMode: 'cover',
		flex: 1,
	},
});

export default AlbumDetail;
