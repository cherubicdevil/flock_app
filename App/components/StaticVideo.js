import React from 'react';
import {Dimensions, View, Text, StyleSheet} from 'react-native';
import RVideo from 'react-native-video';
import {connect, useSelector} from 'react-redux';

class StaticVideo extends React.Component {
	state = {
		vHeight: 0,
		maxWidth: Dimensions.get('window').width,
	};

	onBuffer() {
		//onsole.log('buffering');
		//console.log('THIS IS SOURCE', this.props.data);
		//this.setState({muted: true});
	}

	renderContent() {
		return (
			<RVideo
				muted={true}
				paused={true}
				source={{
					uri: this.props.data
						? this.props.data.video
						: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
					//'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
				}} // Can be a URL or a local file.
				ref={(ref) => {
					this.player = ref;
				}} // Store reference
				style={{height: this.state.vHeight, width: '100%'}}
				onLoad={(response) => {
					this.setState({muted: true});
					//console.log('THIS IS RESPONSE HEIGHT: ', response.naturalSize);
					const {height: vidHeight, width: vidWidth} = response.naturalSize;

					const heightScaled =
						vidHeight *
						((this.props.maxWidth || this.state.maxWidth) / vidWidth);
					//console.log(heightScaled);
					this.setState({vHeight: heightScaled});
				}}
			/>
		);
	}
	render() {
		// console.log(
		// 	'THIS IS SOURCE',
		// 	this.props.data.video || 'MISSING',
		// 	this.props.data.title,
		// );
		return <View>{this.renderContent()}</View>;
	}
}

const styles = StyleSheet.create({});

export default StaticVideo;
