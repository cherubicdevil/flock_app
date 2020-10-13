import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { Card, CardSection, Button } from 'App/components/common'

const AlbumDetail = ({ album }) => {
	const { title, artist, thumbnail_image, image } = album
	const {
		thumbnailStyle,
		headerContentStyle,
		thumbnailContainerStyle,
		headerTextStyle,
		imageStyle,
	} = styles

	return (
		<Card>
			<CardSection>
				<View style={thumbnailContainerStyle}>
					<Image source={{ uri: thumbnail_image }} style={thumbnailStyle} />
				</View>
				<View style={headerContentStyle}>
					<Text style={headerTextStyle}>{title}</Text>
					<Text>{artist}</Text>
				</View>
			</CardSection>
			<CardSection>
				<Image source={{ uri: image }} style={imageStyle} />
			</CardSection>
			<Button onPress={() => console.log('bought')}>Buy Me</Button>
		</Card>
	)
}

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
})

export default AlbumDetail
