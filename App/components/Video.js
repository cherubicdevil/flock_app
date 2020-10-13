import React from 'react';
import {Dimensions, View, Text, StyleSheet} from 'react-native';
import RVideo from 'react-native-video';
import {connect, useSelector} from 'react-redux';
import {constants} from 'App/constants';

class Video extends React.Component {
	state = {
		vHeight: 0,
		vWeight: 0,
		maxWidth: Dimensions.get('window').width,
		maxHeight: Dimensions.get('window').height - constants.NAVBARHEIGHT,
		muted: true,
		paused: false,
	};

	onBuffer() {
		//onsole.log('buffering');
		//console.log('THIS IS SOURCE', this.props.data);
		//this.setState({muted: true});
	}

	componentDidMount() {
		// this.blurSubscription = this.props.navigation.addListener(
		// 	'willBlur',
		// 	() => {
		// 		this.setState({paused: true});
		// 	},
		// );
	}

	// componentWillUnmount() {
	// 	this.blurSubscription.remove();
	// }

	renderContent() {
		if (this.props.masonry || this.props.index === this.props.carIndex) {
			return (
				<RVideo
					muted={this.props.muted}
					paused={this.props.paused}
					repeat={true}
					source={{
						//this.props.source,
						//this.props.data.video,
						//this.props.data.video,
						//this.props.data.video,
						//this.props.data.video
						uri: this.props.data
							? this.props.data.video
							: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
						//'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
					}} // Can be a URL or a local file.
					ref={(ref) => {
						this.player = ref;
					}} // Store reference
					style={{height: this.state.vHeight, width: this.state.vWidth}}
					onLoad={(response) => {
						this.setState({muted: true});
						//console.log('THIS IS RESPONSE HEIGHT: ', response.naturalSize);
						const {height: vidHeight, width: vidWidth} = response.naturalSize;
						if (vidWidth > vidHeight || this.props.maxWidth) {
							const heightScaled =
								vidHeight *
								((this.props.maxWidth || this.state.maxWidth) / vidWidth);
							//console.log(heightScaled);
							this.setState({vHeight: heightScaled, vWidth: '100%'});
						} else {
							const widthScaled = vidWidth * (this.state.maxHeight / vidHeight);
							//console.log(heightScaled);
							this.setState({
								vWidth: widthScaled,
								vHeight: this.state.maxHeight,
							});
						}
					}}
					onBuffer={this.onBuffer.bind(this)} // Callback when remote video is buffering
					onError={this.videoError} // Callback when video cannot be loaded
				/>
			);
		} else {
			return <View style={{height: '100%', width: '100%'}} />;
		}
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

const mapStateToProps = (state) => {
	return {
		carIndex: state.videopage.carIndex,
	};
};

const styles = StyleSheet.create({});

export default connect(mapStateToProps, null)(Video);
