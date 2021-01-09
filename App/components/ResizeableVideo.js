import React, {useRef, useState} from 'react';
import {Dimensions, View, Text, StyleSheet} from 'react-native';
import RVideo from 'react-native-video';


const ResizeableVideo = (data, muted=false, paused=false, repeat=true, horizontalLimit=true) => {
    const player = useRef();
    const maxWidth = Dimensions.get('window').width;
    const maxHeight = Dimensions.get('window').height;

    const [state, setState] = useState({vHeight: null, vWidth: null});
    const [videoUri, setVideoUri] = useState(data.data.video);

  const renderContent = () => {
    //const video_uri = data.video;
    //console.log(data.data.video);
      return (
        <RVideo
          muted={false}
          paused={paused}
          repeat={repeat}
          source={{
            uri: videoUri || 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4'
          }}
          ref={player}
          style={{
            height: state.vHeight,
            width: state.vWidth
          }}
          onLoad={(response) => {
            // //console.log('THIS IS RESPONSE HEIGHT: ', response.naturalSize);
            const {height: vidHeight, width: vidWidth} = response.naturalSize;
            if (horizontalLimit) {
              const heightScaled =
                vidHeight *
                (maxWidth / vidWidth);
              setState({vHeight: heightScaled, vWidth: '100%'});
            } else {
              const widthScaled = vidWidth * (maxHeight / vidHeight);
              setState({
                vWidth: widthScaled,
                vHeight: maxHeight,
              });
            }
          }}
        />
      );

  }
    return <View>{renderContent()}</View>;
}

export default ResizeableVideo;
