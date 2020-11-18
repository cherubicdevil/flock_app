import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Card, CardSection, Button} from 'App/components/common';

const AlbumDetail = ({album, navigation}) => {
	const {url, price, title, image} = album;
	const {
		thumbnailStyle,
		headerContentStyle,
		thumbnailContainerStyle,
		headerTextStyle,
		imageStyle,
	} = styles;

	return (
		<CardSection style={{flex: 1, flexDirection: 'row', padding: 0}}>
			<View style={thumbnailContainerStyle}>
				<Image source={{uri: image}} style={thumbnailStyle} />
			</View>
			<View style={headerContentStyle}>
				<Text style={headerTextStyle}>{title}</Text>
				<Text>${price}</Text>
			</View>
		</CardSection>
	);
};

const styles = StyleSheet.create({
	headerContentStyle: {
		flex: 2,
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
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 5,
		marginRight: 5,
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
