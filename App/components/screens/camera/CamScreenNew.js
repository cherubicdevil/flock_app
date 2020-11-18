import React, {useState, useEffect, useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  ImageBackground,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {constants} from 'App/constants';
//import Video from 'App/components/Video';
import Video from 'react-native-video';
import ProgressHeader from 'App/components/ProgressHeader';
//import Video from 'App/components/Video';
import {pickVideo} from 'App/utils';

const CamScreenNew = ({navigation}) => {
  fetch(constants.HEROKU + 'setup');
  const titleRef = useRef(null);
  const descRef = useRef(null);

  const [pic, setPic] = useState(null);
  const [vHeight, setVHeight] = useState(null);
  useFocusEffect(
    React.useCallback(() => {
      console.log('useing focus effect');
      // ImagePicker.launchImageLibrary(
      // 	{maxWidth: 512, maxHeight: 512},
      // 	(response) => {
      // 		console.log(response);
      // 	},
      // );
      setTimeout(() => {
        console.log('picking video');
        console.log(pic);
        if (pic === null || pic?.uri === undefined) pickVideo(setPic);
      }, 500);

      return () => {
        console.log('leaving CamScreenNew');
      };
    }, []),
  );

  return (
    <View>
      <ProgressHeader
        goBack={true}
        headerText="Create a Cluck"
        nextRoute="Search Product"
        index={1}
        navigation={navigation}
      />

      <View
        style={{
          // overflow: 'hidden',
          flex: 1,
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          backgroundColor: '#000',
        }}>
        <TouchableOpacity
          style={{flex: 1, height: 405}}
          onPress={() => {
            pickVideo(setPic);
          }}>
          <VideoFrame pic={pic} />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            height: 400,
            //paddingTop: 10,
            paddingLeft: 10,
          }}>
          <View style={{flex: 1, paddingRight: 10}}>
            <Text>Title</Text>
            <TextInput
              multiline
              placeholder="Give a title to your recommendation"
              placeholderTextColor={constants.DARKGREY}
              style={styles.textInputStyle}
              ref={titleRef}
            />
          </View>
          <View style={{flex: 2, marginTop: 10, paddingRight: 10}}>
            <Text>Description</Text>
            <TextInput
              multiline
              placeholder="Say more about your recommendation"
              placeholderTextColor={constants.DARKGREY}
              style={styles.textInputStyle}
              ref={descRef}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const VideoFrame = ({pic}) => {
  const [vHeight, setVHeight] = useState(null);
  return (
    <View
      style={{
        marginLeft: 10,
        paddingRight: 2,
        borderRadius: 30,
        borderWidth: 0,
        height: 405,
        justifyContent: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',

        flex: 1,
        //width: Dimensions.get('window').width / 2,
        backgroundColor: '#333',
        borderWidth: 2,
      }}>
      <View
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          zIndex: -10,
          paddingBottom: 30,
        }}>
        <View
          style={{
            borderRadius: 40,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            padding: 15,
          }}>
          <Image
            style={{width: 60, height: 60}}
            source={constants.PLACEHOLDER_IMAGE}
          />
          <Text style={{color: 'white', fontFamily: constants.FONT}}>
            Pick a video!
          </Text>
        </View>
      </View>
      <Video
        masonry={true}
        muted
        paused={false}
        repeat
        source={pic}
        onLoad={(response) => {
          const {height: vidHeight, width: vidWidth} = response.naturalSize;
          setVHeight(
            ((vidHeight / vidWidth) * Dimensions.get('window').width) / 2,
          );
        }}
        style={{
          width: Dimensions.get('window').width / 2,
          height: vHeight,
          //backgroundColor: constants.LIGHTGREY,
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  textInputStyle: {
    borderRadius: 20,
    paddingLeft: 10,
    shadowColor: '#ddd',
    paddingTop: 10,
    flex: 1,
    //borderTopWidth: 0.2,
    marginTop: 2,
    borderColor: '#777',
    marginBottom: 10,
    height: 'auto',
    width: '100%',
    backgroundColor: '#fff',
  },
});

export default CamScreenNew;
