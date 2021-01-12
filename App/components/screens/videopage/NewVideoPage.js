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
import {firebase, db} from 'App/firebase/config';
import {useDispatch, useSelector} from 'react-redux';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
//import {useFocusEffect} from 'react-navigation-hooks';
import {useFocusEffect} from '@react-navigation/native';
import {database} from 'firebase';

import CircleProfile from './CircleProfile';
import HeartButton from './HeartButton';

const ICON_SIZE = 37;
const config = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};


var renderProduct = (navigation, data) => {
  return (
    <VideoDescription
      video={data.video}
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

const NewVideoPage = ({navigation, array, index, data, currIndex}) => {
  var likes = data.likes || 0;
  const dispatch = useDispatch();
  const [myData, setMyData] = useState(data);
  const [leavePage, setLeavePage] = useState(false);
  const [paused, setPaused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  var lastVisible = null;

  console.log('rendering video page')

//   return <Text>hi</Text>

  const renderIcons = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          position: 'absolute',
          right: 10,
          width: 50,
          bottom: 45,
          zIndex: 25,
          shadowOpacity:0.5,
          shadowRadius: 10,
          shadowOffset: {height: 0, width: 0}
        }}>
        <View style={{marginTop: 10}}>
          <HeartButton  data={data} />
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
          <Text style={styles.buttonText}></Text>
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
    return (
      <View
        style={{
          height: '100%',
          backgroundColor: constants.PINK_BACKGROUND,
          justifyContent: 'flex-start',

        }}>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            //justifyContent: 'center',
            zIndex: -10,
            borderRadius: 40,
            //overflow: 'hidden',
            backgroundColor: 'white',
            paddingBottom: 15,
          }}>
              <View>
              {renderIcons()}
          <ResizeableImage source={{uri: data?.poster || data?.product?.image}} />
          </View>
          <View style={{marginTop: 4, marginLeft: 10, marginRight: 10, padding: 10, paddingLeft: 30, borderRadius: 40, borderWidth: 3, borderColor: constants.ORANGE}} >
              <Text>{data.product.title}</Text>
          </View>
        </View>
        <View pointerEvents="none">
          {data?.video?<Video
            style={{zIndex: 10}}
            masonry={false}
            paused={paused}
            muted={false || leavePage}
            navigation={navigation}
            data={data}
            index={index}
            currIndex={currIndex}
            leave={leavePage}
          />:<></>}
          {renderProduct(navigation, data)}
        </View>
        {/* {renderClose(navigation)} */}
        
        
        <CircleProfile
        photoUrl={constants.PLACEHOLDER_IMAGE}
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

const ResizeableImage = ({source, limitHorizontal=true}) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  Image.getSize(source.uri, (w, h) => {
    if (limitHorizontal) {
    const ratio = Dimensions.get('window').width / w;
    setHeight(h * ratio);
    setWidth(Dimensions.get('window').width);
    } else {
      const ratio = Dimensions.get('window').height / h;
      setWidth(w * ratio);
      setHeight(Dimensions.get('window').height);
    }
  });
  if (source == null) {
    source = {uri:''};
  }
  return (
    <Image
      source={source?.uri == ''?require('App/Assets/Images/flock_logo_white.png'):source}
      style={{
        //position: 'absolute',
        zIndex: -10,
        opacity: 0.935,
        width: width,
        height: height,
      }}
    />
  );
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

export default NewVideoPage;