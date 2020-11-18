/* 
* Made by Kevin Gao, for Flock Shopping.
* All rights reserved.
* Flock © 2020
*
*
			 _______  ___        ______    ______   __   ___  
			/"     "||"  |      /    " \  /" _  "\ |/"| /  ") 
			(: ______)||  |     // ____  \(: ( \___)(: |/   /  
			\/    |  |:  |    /  /    ) :)\/ \     |    __/   
			// ___)   \  |___(: (____/ // //  \ _  (// _  \   
			(:  (     ( \_|:  \\        / (:   _) \ |: | \  \  
			\__/      \_______)\"_____/   \_______)(__|  \__)
*
*/
/*
 * VideoPage.js
 *
 * This file contains code for each discrete page of Carousel's scrollview
 * of videos.
 *
 *
 */

import React, {useState, useEffect, useRef} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
  Dimensions,
  Image,
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Share,
  ImageBackground,
  TouchableHighlight,
} from 'react-native';
import {constants} from 'App/constants';
import CommentsModal from './CommentsModal';
import Video from 'App/components/Video';
import VideoDescription from './VideoDescription';
import {firebase} from 'App/firebase/config';
import {useDispatch, useSelector} from 'react-redux';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
//import {useFocusEffect} from 'react-navigation-hooks';
import {useFocusEffect} from '@react-navigation/native';

const ICON_SIZE = 37;
const config = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};

const CircleBorderProfile = ({photoUrl}) => {
  return (
    <View
      style={{
        //justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ImageBackground
        source={require('App/Assets/Images/Orange_Gradient_Small.png')}
        imageStyle={{borderRadius: 45}}
        style={{
          position: 'absolute',
          height: 62,
          width: 60,
          bottom: 160,
          borderRadius: 45,
          left: 15,
          //borderWidth: 3,
          borderColor: '#f73',
          backgroundColor: 'rgba(255,255,255,0)',
        }}
      />
      <View
        style={{
          position: 'absolute',
          marginBottom: 4,
          height: 54,
          width: 54,
          left: 18,
          bottom: 160,
          borderRadius: 45,
          //borderWidth: 5,
          borderColor: '#f23',
          backgroundColor: 'rgba(255,255,255,0)',
        }}
      />
      <Image
        style={{
          marginBottom: 6,
          height: 50,
          left: 20,
          width: 50,
          position: 'absolute',
          bottom: 160,
          borderRadius: 25,
        }}
        source={photoUrl}
      />
    </View>
  );
};
var renderProduct = (navigation, data) => {
  return (
    <VideoDescription
      album={data.product}
      user={data.username}
      description={data.title}
      navigation={navigation}
      style={{
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        zIndex: 20,
      }}
    />
  );
};

// renderProduct = (navigation, data) => {
// 	if (data && data.product) {
// 		return (
// 			<ImageBackground
// 				source={require('App/Assets/Images/blurb.png')}
// style={{
// 	resizeMode: 'contain',
// 	position: 'absolute',
// 	bottom: constants.NAVBARHEIGHT + 20,
// 	//height: 400,
// 	width: '100%',
// 	left: 5,
// 	//bottom: 10,
// 	//left: 20,
// 	zIndex: 20,
// 	paddingLeft: 5,
// 	paddingRight: 5,
// }}>
// 				<VideoDescription
// 					album={data.product}
// 					user={data.username}
// 					description={data.title}
// 					navigation={navigation}
// 					style={{marginTop: 30}}
// 				/>
// 			</ImageBackground>
// 		);
// 	} else {
// 		return <View />;
// 	}
// };

const VideoPage = ({navigation, array, index, data, currIndex}) => {
  var likes = data.likes || 0;
  var liked = null;
  const selector = useSelector((state) => state);
  const dispatch = useDispatch();
  // console.log('NAVIGATION CONTEXT:', navigation);
  const [myData, setMyData] = useState(data);
  const [leavePage, setLeavePage] = useState(false);
  const [paused, setPaused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  var lastVisible = null;
  //setMyData(data);
  var db = firebase.firestore();
  //const {ar, data, index} = navigation.state.params;

  var first = db.collection('comments').orderBy('rating').limit(25);

  //fetchAlbums();
  //console.log('THIS IS WHAT A QUERY LOOKS LIKE,', first);

  useFocusEffect(
    React.useCallback(() => {
      setPaused(false);

      db.collection('posts').doc(data.id).update({likes: likes});

      return () => {
        setPaused(true);
        //console.log('leaving');

        // if (liked !== null) {
        // 	firebase
        // 		.database()
        // 		.ref('users')
        // 		.child(firebase.auth().currentUser.uid)
        // 		.child('likedPosts')
        // 		.child(data.id)
        // 		.setValue(liked);
        //console.log('value set');
        //};
      };
    }),
  );

  const renderProfile = () => {
    // return (
    // 	<Image
    // 		style={{
    // 			height: 50,
    // 			width: 50,
    // 			position: 'absolute',
    // 			bottom: 150,
    // 			left: 10,
    // 			borderRadius: 25,
    // 		}}
    // 		source={require('App/Assets/Images/Profile_Egg_Icon.png')}
    // 	/>
    // );
    return (
      <CircleBorderProfile
        photoUrl={require('App/Assets/Images/Profile_Egg_Icon.png')}
        style={{
          resizeMode: 'contain',
          position: 'absolute',
          bottom: constants.NAVBARHEIGHT + 50,
          //height: 400,
          left: 20,
          zIndex: 20,
          paddingLeft: 5,
          paddingRight: 5,
        }}
      />
    );
  };
  const HeartIcon = () => {
    const [heartColor, setHeartColor] = useState(false);
    useEffect(() => {
      dataRef = firebase
        .database()
        .ref('users')
        .child(firebase.auth().currentUser.uid)
        .child('likedPosts')
        .child(data.id)
        .once('value')
        .then(function (snapshot) {
          //console.log('snapshot val', snapshot.val());
          if (snapshot.val()) {
            setHeartColor(true);
          }
        });
    }, []);

    return (
      <View>
        <TouchableHighlight
          onPress={() => {
            //var likes = data.likes || 0;
            var change = 1;
            if (heartColor) {
              change = -1;
            }
            likes = likes + change;

            data.likes += change;
            liked = !liked;
            setHeartColor(!heartColor);
            console.log(data.likes);
          }}>
          <Image
            style={{
              height: ICON_SIZE,
              width: ICON_SIZE,
              tintColor: heartColor ? constants.RED : '#fff',
            }}
            source={require('App/Assets/Images/Heart_Icon_White.png')}
          />
        </TouchableHighlight>
        <Text style={styles.buttonText}>{data.likes}</Text>
      </View>
    );
  };
  const renderIcons = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          position: 'absolute',
          right: 10,
          width: 50,
          bottom: 155,
          zIndex: 25,
        }}>
        <View style={{marginTop: 10}}>
          <HeartIcon />
        </View>
        <View style={{marginTop: 10}}>
          <TouchableOpacity
            onPress={function () {
              dispatch({type: 'toggle'});
              setModalVisible(true);
            }}>
            <Image
              style={{height: ICON_SIZE, width: ICON_SIZE}}
              source={require('App/Assets/Images/Comment_Icon_White.png')}
            />
          </TouchableOpacity>
          <Text style={styles.buttonText}>5</Text>
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            Share.share({
              message: data.title,
              title: 'Flock Content',
              url: 'https://www.shopwithflock.com/videos/?id=' + data.id,
            });
          }}>
          <Image
            style={{height: ICON_SIZE, width: ICON_SIZE}}
            source={require('App/Assets/Images/Share_Icon_White.png')}
          />
        </TouchableWithoutFeedback>
        <Text style={styles.buttonText}>share</Text>
      </View>
    );
  };
  const renderVid = () => {
    console.log('COMARE', index, currIndex);
    if (leavePage) {
      console.log('LEAVING');
      return <View />;
    }
    return (
      <View
        style={{
          height: '100%',
          backgroundColor: '#000',
          justifyContent: 'center',
        }}>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            zIndex: -10,
          }}>
          <Image
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              zIndex: -10,
            }}
            blurRadius={10}
            source={{uri: data.poster}}
          />
        </View>
        <Video
          style={{zIndex: 10}}
          masonry={false}
          paused={paused}
          muted={false || leavePage}
          navigation={navigation}
          data={data}
          index={index}
          currIndex={currIndex}
          leave={leavePage}
        />
        {/* {renderClose(navigation)} */}
        {renderProduct(navigation, data)}
        {renderProfile()}
        {renderIcons()}
        <CommentsModal
          data={data}
          toggleFunc={() => {
            setModalVisible(false);
          }}
          modalVisible={modalVisible}
        />
      </View>
    );
  };
  return <View>{renderVid()}</View>;
};

const styles = StyleSheet.create({
  buttonText: {
    fontFamily: 'Nunito-Light',
    textAlign: 'center',
    color: '#fff',
  },

  centeredView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    marginTop: 'auto',
    marginBottom: 0,
    height: '70%',
    width: '100%',
    backgroundColor: 'rgb(250,250,250)',
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingTop: 30,
    paddingLeft: 0,
    //paddingLeft: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#999',
    marginRight: 4,
    borderRadius: 20,
    padding: 5,
    paddingTop: 3,
    paddingBottom: 3,

    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginTop: -20,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  textBold: {
    fontWeight: 'bold',
    fontSize: 10,
    color: '#777',
  },
});

export default VideoPage;