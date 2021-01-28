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

import React, {useState, useEffect, useRef, useContext} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
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
  // return (
  //   <VideoDescription
  //     video={data.video}
  //     album={data.product}
  //     user={data.username}
  //     description={data.title}
  //     navigation={navigation}
  //     style={{
  //       position: 'absolute',
  //       top: 0,
  //       alignSelf: 'center',
  //       zIndex: 20,
  //     }}
  //   />
  // );
};

const NewVideoPage = ({navigation, route, array, index, data, currIndex, viewHeight}) => {
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
    if (data.type ==="rec") {
      // FLOCK_BUG
    }
  var likes = data.likes || 0;
  const dispatch = useDispatch();
  const [myData, setMyData] = useState(data);
  const [leavePage, setLeavePage] = useState(false);
  const [paused, setPaused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [flockCountdowns, setFlockCountdowns] = useState([]);

  const percentage= 75;

  var lastVisible = null;
  const select = useSelector(state=>state);


//   return <Text>hi</Text>

const comments = [{user: {name: 'Hellowrld'}, content: "this is a message", time: 1234, replies: []}, ];
const [firstComment, setFirstComment] = useState({});

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

    console.log("DATAID", data.id);
    db.collection('comments')
    .where('cluck', '==', `${data.id}`)
    .orderBy('date', 'desc')
    .limit(1)
    .get()
    .then((querySnapshot) => {
      //console.log(querySnapshot.getKey());
      querySnapshot.forEach((doc) => {
        const entity = doc.data();
        setFirstComment(entity);
      });
    });
  }, []);

  const renderIcons = () => {
    return (
      <View
        style={{
          alignItems: 'flex-end',
          alignSelf: 'flex-end',
          // position: 'absolute',
          right: 10,
          width: 100,
          // bottom: 105,
          zIndex: 25,

          shadowOpacity:0.2,
          shadowRadius: 4,
          shadowOffset: {height: 2, width: 0}
        }}>
          <View style={{alignItems: 'center'}}>
        <View style={{marginTop: 10}}>
          <HeartButton  data={data} />
        </View>
        <View style={{marginTop: 5}}>
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
        <View style={{alignItems: 'center'}}>
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
        <View style={{padding: 0, backgroundColor: "#fb9b37", borderRadius: 20,alignItems: 'center', marginTop: -5, alignSelf: 'center'}}>
        <Text style={{marginLeft: 5, marginRight: 5,color: 'white', paddingTop: 5, paddingBottom: 5,  fontSize: 10, fontWeight: 'bold'}}>Earn $</Text>
        </View>
        </View>
        </View>
      </View>
    );
  };

  // console.log("FIRST COMMENT", firstComment, firstComment === undefined || Object.keys(firstComment).length==0);
  const renderVid = () => {
    return (
      <View
        style={{
          height: '100%',
          backgroundColor: constants.PINK_BACKGROUND_OPAQUE,
          justifyContent: 'flex-start',

        }}>
        <View
          style={{
            //position: 'absolute',
            width: '100%',
            //justifyContent: 'center',
            zIndex: -10,
            borderRadius: 60,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            overflow: 'hidden',
            backgroundColor: 'white',
          }}>
              {/* <Image source = {{uri: data?.poster || data?.product?.image || ''}} style={{position: 'absolute', zIndex: -10, top: 0, width: '100%', height: '100%' }} blurRadius={100} /> */}
              <View style={{alignSelf: 'center'}}>
              <ResizeableImage source={{uri: data?.product?.image || ''}} limitHorizontal={false} hLimit={viewHeight * percentage/100} />
              </View>
              <View style={{width: '100%', position: 'absolute', bottom: 0}}>
              {renderIcons()}
              
          {/* <ResizeableImage source={{uri: data?.poster || data?.product?.image || ''}} limitHorizontal={false} hLimit={viewHeight * percentage/100} /> */}
          
          {/* <ConditionalVideo index={index} data={data} viewHeight={viewHeight * percentage/100} /> */}
          {(select.videopage.carIndex==index && select.videopage.leave==false)?<ScrollCount data={flockCountdowns} />:<></>}
          <TouchableOpacity onPress={()=>{
              const video = data.video;
              console.log(dataType);
              if (dataType==="flock" || dataType==="video") {
                  console.log('pressing')
              navigation.navigate("Product", {album: data.product, video: {video}})
              } else if (dataType==="rent") {
                  
                  navigation.navigate("FlockReserve", {data: data});
              }
          }}><View style={{flexDirection: 'row',alignItems: 'center', backgroundColor: 'rgba(255,255,255,1)', marginTop: 20, marginLeft: 10, marginRight: 10, marginBottom: 10, padding: 10, paddingLeft: 30, borderRadius: 100, borderWidth: 3, borderColor: constants.GREYORANGE}} >
              <View style={{flex: 1}}>
              <Text numberOfLines={2}>{data?.product?.title}</Text>
              <Text></Text>
              <Text style={{color: constants.GREYORANGE}}>${data?.product && data?.members?data?.product?.price / (data?.members.length+1) + " or less when you split with flockers":""}</Text>
              <Text style={{color: "grey"}}>${data?.product?.price} original</Text>
              </View>
              <Icon color={constants.GREYORANGE} name="chevron-right" size={30} />
          </View>
          </TouchableOpacity>
          </View>

        </View>
        <View pointerEvents="none">

          {renderProduct(navigation, data)}
          {/* <View style={{height: (100-percentage)+"%", position: 'absolute', bottom: -50, zIndex: 2000, backgroundColor: 'black'}} ><TouchableWithoutFeedback style={{width:'100%', height: '100%', backgroundColor: 'yellow'}} onPress={()=>setModalVisible(true)}>{firstComment === undefined || Object.keys(firstComment).length==0?<></>:<View style={{marginLeft: 30}}><View style={{flexDirection: 'row', marginTop: 10}}><Text style={{fontWeight: 'bold'}}>@{firstComment.user.name}</Text><Text style={{marginLeft: 5}}>{firstComment.text}</Text></View><TouchableOpacity onPress={()=>setModalVisible(true)}><Text style={{color: 'grey', fontSize: 12, marginTop: 5}}>View all comments</Text></TouchableOpacity></View>}</TouchableWithoutFeedback></View> */}
        </View>
        <View style={{height: (100-percentage)+"%",  zIndex: 2000}} ><TouchableWithoutFeedback style={{width:'100%', height: '100%', backgroundColor: 'yellow'}} onPress={()=>setModalVisible(true)}>{firstComment === undefined || Object.keys(firstComment).length==0?<></>:<View style={{marginLeft: 30}}><View style={{flexDirection: 'row', marginTop: 10}}><Text style={{fontWeight: 'bold'}}>@{firstComment.user.name}</Text><Text style={{marginLeft: 5}}>{firstComment.text}</Text></View><TouchableOpacity onPress={()=>setModalVisible(true)}><Text style={{color: 'grey', fontSize: 12, marginTop: 5}}>View all comments</Text></TouchableOpacity></View>}</TouchableWithoutFeedback></View>
        {/* {renderClose(navigation)} */}
        
        
        {/* <CircleProfile
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
      /> */}
        
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

const ConditionalVideo = ({index, data, viewHeight, route}) => {
    const select = useSelector(state=>state);
    if (data?.video && (index == select.videopage.carIndex) && select.videopage.leave===false) {
        return <View style={{position: 'absolute', top:0, right: 0}}>
        <ResizeableVideo data={data} horizontalLimit = {false} hLimit={150}/>
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
  if (source?.uri) {
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
}
  if (source == null) {
    source = {uri:''};
  }
  return (
    <Image
      source={source?.uri === ''?require('App/Assets/Images/flock_logo_white.png'):source}
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
