import React from 'react';
import {Dimensions, View, Text, StyleSheet} from 'react-native';
import RVideo from 'react-native-video';
import {connect} from 'react-redux';

class Video extends React.Component {
  state = {
    vHeight: null,
    vWeight: null,
    maxWidth: Dimensions.get('window').width,
    maxHeight: Dimensions.get('window').height,
    muted: true,
    paused: false,
  };
  constructor(props) {
    super(props);
    //console.log('viewheight:', this.props.viewHeight);
  }
  onBuffer() {
    //onsole.log('buffering');
    //console.log('THIS IS SOURCE', this.props.data);
    //this.setState({muted: true});
  }

  componentDidMount() {
    ///console.log('viewheight:', this.props.viewHeight);
    // this.blurSubscription = this.props.navigation.addListener(
    // 	'willBlur',
    // 	() => {
    // 		this.setState({paused: true});
    // 	},
    // );
  }
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.viewHeight !== this.props.viewHeight) {
  //     this.setState({vHeight: nextProps.viewHeight});
  //   }
  // }
  // ^ I don't know what this does so I'm commenting it out for now.

  componentWillUnmount() {}

  // componentWillUnmount() {
  // 	this.blurSubscription.remove();
  // }

  renderContent() {
    const example_url =
      'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4';
    //const video_uri = example_url;
    const video_uri = this.props.data.video;
    //console.log('ACTUAL RENDERED VIDEO: ', this.props.data.video);
    if (
      ((!this.props.leave || this.props.masonry) && this.props.visible) ||
      this.props.index === this.props.carIndex
    ) {
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
            uri: video_uri,
            // uri: this.props.data
            //   ? this.props.data.video
            //   : this.props.source.uri,
            //'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
          }} // Can be a URL or a local file.
          ref={(ref) => {
            this.player = ref;
          }} // Store reference
          style={{
            height: this.state.vHeight || 315.55555555555554,
            width: this.state.vWidth || 200,
          }}
          onLoad={(response) => {
            this.setState({muted: true});
            // //console.log('THIS IS RESPONSE HEIGHT: ', response.naturalSize);
            const {height: vidHeight, width: vidWidth} = response.naturalSize;
            if (vidWidth > vidHeight || this.props.maxWidth) {
              const heightScaled =
                vidHeight *
                ((this.props.maxWidth || this.state.maxWidth) / vidWidth);
              //console.log(heightScaled);
              this.setState({vHeight: heightScaled, vWidth: '100%'});
              // if (heightScaled !== 0) {
              //   this.props.persistHeightFunc(heightScaled);
              // }
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
      return (
        <View
          style={{
            height: 315.55555555555554,
            // height large enough so that feedlist doesn't jump
            //width: '100%',
          }}
        />
      );
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
