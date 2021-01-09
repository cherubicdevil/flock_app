import React from 'react';
import {Dimensions, View, Text, StyleSheet} from 'react-native';
import RVideo from 'react-native-video';
import {connect} from 'react-redux';
import ResizeableVideo from 'App/components/ResizeableVideo';

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
    var trueIndex = this.props.currIndex;
    if (this.props.currIndex !== this.props.carIndex) {
      trueIndex = this.props.carIndex;
    }
    const example_url =
      'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4';
    //const video_uri = example_url;
    const video_uri = this.props.data.video;
    //console.log('ACTUAL RENDERED VIDEO: ', this.props.data.video);
    if (this.props.index !== trueIndex && !this.props.masonry) {
      return <View style={{height: '100%'}} />;
    }
    if (this.props.visible === false && this.props.masonry) {
      return (
        <View
          style={{
            height:
              (this.props.data.size.height / this.props.data.size.width) *
              (Dimensions.get('window').width / 2 - 20),
          }}
        />
      );
    }
    if (
      ((!this.props.leave || this.props.masonry) && this.props.visible) ||
      this.props.index === this.props.currIndex ||
      this.props.index === this.props.carIndex
    ) {
      return (
        <ResizeableVideo data={this.props.data} />
      );
    } else {
      return (
        <View
          style={{
            height: 0,
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
