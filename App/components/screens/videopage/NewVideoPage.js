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
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  ScrollView,
  Dimensions,
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {constants} from 'App/constants';
import CommentsModal from './CommentsModal';
import {db} from 'App/firebase/config';
import {useDispatch, useSelector} from 'react-redux';
import ResizeableImage from 'App/components/ResizeableImage';
import {rentPrice} from 'App/utils';
import {useFocusEffect} from '@react-navigation/native';
import HeartButton from './HeartButton';

import Countdown from 'App/components/Countdown';


const ICON_SIZE = 37;


const getDataType = (data) => {
    if (data.video) {
        var dataType = "video";
    } else if (data.completed) {
        dataType = "rent";
    } else if (data.completed == false) {
        dataType = "flock";
    } else {
        dataType = "product";
    }
    return dataType;
}

const NewVideoPage = React.memo(({navigation, route, array, index, data, currIndex, viewHeight}) => {
    const dispatch = useDispatch();
    const dataType = getDataType(data);
    const [modalVisible, setModalVisible] = useState(false);
    const [flockCountdowns, setFlockCountdowns] = useState([]);

    useEffect(()=>{
    if (dataType==="flock") {
    db.collection("chatGroups")
    .where("productTitle", "==", data?.product?.title || "")
    .get().then(function(querySnapshot) {
      const arr = [];
      querySnapshot.forEach(function(doc) {
        if (data.completed === false && data.time >= Date.now()/1000 - 60*60*24*7) {
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
          alignItems: 'flex-end',
          alignSelf: 'flex-end',
          right: 10,
          width: 100,
          zIndex: 25,
          shadowOpacity:0.2,
          shadowRadius: 4,
          shadowOffset: {height: 2, width: 0}
        }}>
          <View style={{alignItems: 'center'}}>
        <View style={{marginTop: 10, marginBottom: 20,}}>
          <HeartButton  data={data} />
        </View>
        <View style={{marginTop: 5}}>
          <TouchableOpacity
          hitSlop={{top: 10, bottom: 10, left: 30, right: 30}}
            onPress={function () {
              dispatch({type: 'toggle'});
              setModalVisible(true);
              console.log('make visible');
              dispatch({type: 'TOGGLE_COMMENTS'});
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
        hitSlop={{top: 10, bottom: 30, left: 30, right: 30}}
          onPress={() => {
            navigation.navigate("ShareSocial", {data: data, product: data.product, flockId: data.id || data.flockId})
          }}>
          <Image
            style={{height: ICON_SIZE, width: ICON_SIZE}}
            source={require('App/Assets/Images/Share_Icon_White.png')}
          />
        </TouchableWithoutFeedback>
        <View style={{padding: 0, backgroundColor: dataType==="rent"?constants.LAVENDER:"#fb9b37", borderRadius: 20,alignItems: 'center', marginTop: -5, alignSelf: 'center'}}>
        <Text style={{marginLeft: 5, marginRight: 5,color: 'white', paddingTop: 5, paddingBottom: 5,  fontSize: 10, fontWeight: 'bold'}}>Earn $</Text>
        </View>
        </View>
        </View>
      </View>
    );
  };

  const renderVid = () => {
    return (
      <View
      onStartShouldSetResponder={()=>true}
      onResponderTerminationRequest={()=>true}
      onMoveShouldSetResponder={()=>false}
      onResponderGrant={()=>{
        console.log('touching');
      }}
      onResponderRelease={()=>{
        const video = data.video;
        console.log(dataType);
        if (dataType==="flock" || dataType==="video") {
        navigation.navigate("Product", {album: data.product, video: {video}, data: data, id: data.id})
        } else if (dataType==="rent") {
            
            navigation.navigate("FlockReserve", {data: data});
        }
    }}
        style={{
          height: '100%',
          backgroundColor: constants.PINK_BACKGROUND_OPAQUE,
          borderWidth: 0,
          justifyContent: 'flex-start',

        }}>
        <View
          style={{
            width: '100%',
            zIndex: -10,
            borderRadius: 60,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            backgroundColor: 'white',
          }}>
              <View style={{alignSelf: 'center', height: '100%'}}>
                <View style={{height: '100%', justifyContent: 'center'}}>
              <ResizeableImage aspectRatio={0.5} optimize={true} source={{uri: data?.product?.image || ''}} limitHorizontal={false} wLimit = {Dimensions.get('window').width} hLimit={viewHeight * 1.1} />
              </View>
              <View style={{position: 'absolute', bottom: 0, zIndex: -30}}>
              <ResizeableImage blurred={true} source={{uri: data?.product?.image || ''}} limitHorizontal={false} hLimit={viewHeight+100} />
              </View>
              </View>
              <View style={{width: '100%', position: 'absolute', bottom: 0}}>
                <View>
              {renderIcons()}
          {(dataType !=="rent")?
          <TouchableOpacity onPress={()=>{
            navigation.navigate('Product', {album: data.product, data: data, id: data.id});
          }}>
          <ScrollCount data={flockCountdowns} />
          </TouchableOpacity>
           :<></>}
</View>
          <View 
          onStartShouldSetResponder={()=>true}
          onResponderTerminationRequest={()=>true}
          onMoveShouldSetResponder={()=>false}
          onResponderRelease={()=>{
            const video = data.video;
            if (dataType==="flock" || dataType==="video") {
            navigation.navigate("Product", {album: data.product, video: {video}, data: data, id: data.id})
            } else if (dataType==="rent") {
                
                navigation.navigate("FlockReserve", {data: data});
            }
        }}
          
          style={{flexDirection: 'row',alignItems: 'center', marginBottom: 10, backgroundColor: 'rgba(255,255,255,1)', marginTop: 20, marginLeft: 10, marginRight: 10, marginBottom: 10, padding: 10, paddingLeft: 30, borderRadius: 100, borderWidth: 3, borderColor: dataType==="rent"?constants.LAVENDER:constants.GREYORANGE}} >
              <View style={{flex: 1}}>
              <Text numberOfLines={2}><Text style={{fontWeight: 'bold'}}>{data?.product?.brand?data?.product?.brand+" ":""}</Text>{data?.product?.title}</Text>
              <Text></Text>
              <Text style={{color: dataType==="rent"?constants.LAVENDER:constants.GREYORANGE}}>${dataType==="rent"?rentPrice(data?.product?.price)+" to borrow":(1.4 * data?.product?.price / 25).toFixed(2) + " to flock"}</Text>
              <Text style={{color: "grey"}}>${data?.product?.price} original</Text>
              </View>
              <Icon color={dataType==="rent"?constants.LAVENDER:constants.GREYORANGE} name="chevron-right" size={30} />
          </View>

          </View>

        </View>
        <View pointerEvents="none">
        </View>
        
        <CommentsModal
          data={data}
          toggleFunc={() => {
            setModalVisible(false);
            dispatch({type: 'TOGGLE_COMMENTS'});
          }}
          modalVisible={modalVisible}
        />

        
      </View>
    );
  };
  return <View>{renderVid()}</View>;
});

const ScrollCount = ({data}) => {
    const scrollRef = useRef();
    var offset = 0;

    const callback = ()=>{
        offset+=50;
        if (offset/50 +1 > data.length) {
            scrollRef.current.scrollTo({y:0});
            offset = 0;
          
        } else {
        scrollRef.current.scrollTo({y:offset});
        }
    };
    useFocusEffect(()=>{
      var interval;
        if (data !== null && data.length >= 2) {
        interval = setInterval(callback, 2000);
        }
        return ()=>{
          if (interval) {
            clearInterval(interval);
          }
        }
    },[])
    return <ScrollView ref = {scrollRef} pagingEnabled={true} horizontal={false} style={{left: 10, position: 'absolute', bottom: 0, zIndex: 300, height: 100,width: 250}}>
    {data.map((item)=> {
        return <View key={item.id} style={{flexDirection: 'row', height: 40, borderRadius: 40, backgroundColor: 'rgba(255,220,200,0.7)',alignItems:'center',justifyContent:'space-around', margin:5}}>
            <Text>{item.memberIds?.length} flocking</Text>
            <Countdown dateObj={item.time} />
            
            </View>
    })}
    <View style={{height: 50}} />
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
