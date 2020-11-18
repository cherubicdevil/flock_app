import React from 'react';
import {Image, View, StyleSheet, Text, Button} from 'react-native';
import Video from 'react-native-video';

const SelectedPicture = (props) => {
  const {showFunc, uri} = props;
  return (
    <View style={styles.container}>
      <Button title="cancel" onPress={showFunc} />
      <Video
        paused
        source={{
          uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        }}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 300,
    width: 200,
  },
});

export default SelectedPicture;
