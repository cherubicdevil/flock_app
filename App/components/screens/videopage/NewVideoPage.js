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
import ResizeableVideo from '../../ResizeableVideo';

import Countdown from 'App/components/Countdown';


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

const NewVideoPage = ({navigation, array, index, data, currIndex, viewHeight}) => {

    var dataType = "initial";
    if (data.video) {
        dataType = "video";
    } else if (data.completed) {
        dataType = "rent";
    } else if (data.completed == false) {
        dataType = "flock";
    } else {
        dataType = "product";
    }
  var likes = data.likes || 0;
  const dispatch = useDispatch();
  const [myData, setMyData] = useState(data);
  const [leavePage, setLeavePage] = useState(false);
  const [paused, setPaused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [flockCountdowns, setFlockCountdowns] = useState([]);

  const percentage = 60;

  var lastVisible = null;
  const select = useSelector(state=>state);

  console.log('rendering video page')

//   return <Text>hi</Text>


useEffect(()=>{
    if (dataType === "product" || dataType === "video") {
    db.collection("chatGroups")
    .where("productTitle", "==", data?.product?.title || "")
    .get().then(function(querySnapshot) {
      const arr = [];
      querySnapshot.forEach(function(doc) {
        if (doc.data().completed === false) {
        arr.push(doc.data());
        }
      });
      setFlockCountdowns(arr);
    });
    }
  }, []);

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
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            overflow: 'hidden',
            backgroundColor: 'white',
          }}>
              <Image source = {{uri: data?.poster || data?.product?.image}} style={{position: 'absolute', zIndex: -10, top: 0, width: '100%', height: '100%' }} blurRadius={100} />
              <View style={{alignItems: 'center'}}>
              {renderIcons()}
              
          <ResizeableImage source={{uri: data?.poster || data?.product?.image}} limitHorizontal={false} hLimit={viewHeight * percentage/100} />
          <ConditionalVideo index={index} data={data} viewHeight={viewHeight * percentage/100} />
          {select.videopage.carIndex==index?<ScrollCount data={flockCountdowns} />:<></>}
          </View>
          <TouchableOpacity onPress={()=>{
              const video = data.video;
              console.log(dataType);
              if (dataType==="flock" || dataType==="video") {
                  console.log('pressing')
              navigation.navigate("Product", {album: data.product, video: {video}})
              } else if (dataType==="rent") {
                  navigation.navigate("FlockReserve", {data: data});
              }
          }}><View style={{backgroundColor: 'rgba(255,255,255,0.6)', marginTop: 4, marginLeft: 10, marginRight: 10, marginBottom: 10, padding: 20, paddingLeft: 30, borderRadius: 40, borderWidth: 3, borderColor: constants.ORANGE}} >
              <Text>{data?.product?.title}</Text>
          </View>
          </TouchableOpacity>
        </View>
        <View pointerEvents="none">

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

const ConditionalVideo = ({index, data, viewHeight}) => {
    const select = useSelector(state=>state);
    console.log(select.videopage.carIndex, index, "carindex newivdeopage");
    if (data?.video && (index == select.videopage.carIndex)) {
        return <View style={{position: 'absolute', top:0}}>
        <ResizeableVideo data={data} horizontalLimit = {false} hLimit = {viewHeight}/>
        </View>
    } else {
        return <></>;
    }
}

const ResizeableImage = ({source, limitHorizontal=true, hLimit, wLimit}) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const maxWidth = wLimit || Dimensions.get('window').width;
  const maxHeight = hLimit || Dimensions.get('window').height;
  Image.getSize(source.uri, (w, h) => {
    if (limitHorizontal) {
    const ratio = maxWidth / w;
    setHeight(h * ratio);
    setWidth(maxWidth);
    } else {
      const ratio = maxHeight / h;
      setWidth(w * ratio);
      setHeight(maxHeight);
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

const ScrollCount = ({data}) => {
    const scrollRef = useRef();
    var offset = 0;

    const callback = ()=>{
        offset+=50;
        console.log(offset);
        if (offset/50 > data.length) {
            scrollRef.current.scrollTo({y:0});
            offset = 50;
        } else {
        scrollRef.current.scrollTo({y:offset});
        //console.log('scrolling', offset);
        }
    };
    useEffect(()=>{
      var interval;
        if (data !== null && data.length > 2) {
        interval = setInterval(callback, 2000);
        }
        return ()=>{
          if (interval) {
            clearInterval(interval);
          }
        }
    },[])
    return <ScrollView ref = {scrollRef} pagingEnabled={true} horizontal={false} style={{position: 'absolute', bottom: 0, backgroundColor: 'yellow', zIndex: 300, height: 100}}>
    {data.map((item)=> {
        return <View style={{flexDirection: 'row', height: 50}}>
            <Countdown dateObj={item.time} />
            <Text>price {item?.product?.price / (item?.members?.length+1)}</Text>
            </View>
    })}
  </ScrollView>
}

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
