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
 * FeedList.js
 *
 * This file contains code for the FeedList of flock the app.
 * It resides on the HomePage, in a masonry format to show both
 * clucks and products.
 *
 *
 */


import React, {useState, useContext} from 'react';
import {Dimensions, ScrollView, View, Button, TouchableOpacity, Text} from 'react-native';
import FeedItem from './FeedItem';
import HalfProduct from './HalfProduct';
import {constants} from 'App/constants';
import {shuffle} from 'App/utils';
import {fetchAlbums, fetchProducts, mergeArrays, fetchFlockables, fetchRentables} from 'App/utils';
import LinearGradient from 'react-native-linear-gradient';
import ProductBlurb from 'App/components/screens/home/feed/ProductBlurb';

import ResizeableImage from 'App/components/ResizeableImage'
const width = Dimensions.get('window').width / 2 - 30;

const ConsoleTest = React.memo(({id, item}) => {
  console.log(id, "test")
  return <>
  <ResizeableImage source = {{uri: item.product.image}} wLimit = {Dimensions.get('window').width/2 - 30} />
  <Text>{id}</Text>
  </>;
},(prev, next)=>prev.id == next.id);

const FeedItemLocal = React.memo(({al, navigation})=>{
  console.log('feeditem id:',al.id);
// console.log('al image', al.image, al.title, al.product.image);
  return <TouchableOpacity key={al.id} onPress={()=>{
  if (al.completed === false) { // flock
    navigation.navigate("Product", {album: al.product, data: al, id: al.id});
  } else if (al.completed === true) {
  navigation.navigate('FlockReserve', {data:al});
  } else {
    navigation.navigate("Product", {album: al.product, data: al, id: al.id})
  }
}}

>
  <View style={{backgroundColor: 'black', width: '100%', resizeMode: 'contain'}} >
    <ResizeableImage source = {{uri: al?.product?.image}} wLimit = {Dimensions.get('window').width/2 - 30} />
  {/* <Image defaultSource={require('App/Assets/Images/flock_logo_white.png')} style={{width: 50, height: 50,}} source = {{uri: al?.product?.image}} /> */}
  </View>
  </TouchableOpacity>}, (prev, next)=>prev.al.id==next.al.id);

const FeedList= ({testArray, setTestArray, navigation, route, videoData, productBlurb=null, KeyContext= null, flockOrNot, feedItemCustom}) => {
  
  console.log('navigatoin?', navigation);

  const [myAr, setMyAr] = useState([]);
  // const [localAr, setLocalAr] = useState(videoData);

  const renderProductBlurb = (product) => {
    if (productBlurb) {
      return productBlurb(product);
    }
    return <ProductBlurb data={product} />
  }
  const renderFeedItem = (al) => {
    if (feedItemCustom) {
      return feedItemCustom(al);
    }
    if (FeedItemLocal) {
      var type = al.type;

//       return <TouchableOpacity onPress={()=>{
//         if (al.type !== "rent") {
//           navigation.navigate("Product", {album: al, id: al.id});
//         } else {
//           navigation.navigate("FlockReserve");
//         }
//       }}>
// {feedItem(al)}
//       </TouchableOpacity>;
return <FeedItemLocal al={al} key={al.id} navigation={navigation} />;
    }
    return <FeedItem
    mute={true}
    repeat={true}
    ar={myAr}
    videoAr={videoData}
    index={myAr.indexOf(al)}
    navigation={navigation}
    data={al}
    source={{uri: al.image || al.video}}
    title={al.title}
    type={"photo"}
    key={al.title}
  />
  }
  const renderClucks = (album) => {
    //console.log("CLUCKS", this.props.route.params.videoData);
    return album.map((al) => {
      var type = "";
      var color = 'black';
      if (al.type == 'rec') { // pin
        color= constants.BLUEBORDER;
        type = "rec";
      } else if (al.completed) { // borrow
        color = constants.PURPLEBORDER;
        type="rent";
      } else if (al.completed==false) { // flock
        color = constants.GREYORANGE;
        type="flock";
      }
      if (false) {
        return <HalfProduct navigation={navigation} album={al} />;
      } else {
        return (
          <View key={al.id}>
                    <View
                    key={al.id}
        style={{
          borderTopWidth: 3,
          borderColor: color,
          overflow: 'hidden',
          borderBottomLeftRadius: 44,
          borderBottomRightRadius: 44,
          borderWidth:3,
          marginTop: 10,
          width: width,
        }}>
          <View style={{overflow: 'hidden', borderBottomRightRadius: 40, borderBottomLeftRadius: 40,}}>
          
          {renderFeedItem(al)}
          </View>
          </View>
          {renderProductBlurb(al)}
          </View>
        );
      }
    });
  }

    // console.log('flock data length', this.props.route.params.videoData.length);
    // console.log("FL DATA", this.props.route.params);
var testing = videoData.map((item)=>{
  return <ConsoleTest id={item.id} item={item} key={item.id}/>
})

var testing2 = testing;

    const ar = mergeArrays(videoData, []);
    const album1 = [];
    const album2 = [];
    for (let i = 0; i < videoData.length;i++) {
      if (i%2 == 0) {
        album1.push(videoData[i]);
      } else {
        album2.push(videoData[i]);
      }
    }
    // const album1 = ar.slice(0, ar.length / 2);
    // const album2 = ar.slice(ar.length / 2, ar.length);

    var testing3 = ar.map((item)=>{
      return <>
      {renderFeedItem(item)}
      {renderProductBlurb(item)}
      </>
    })

    var limit = 0;
    var setLimit = ()=>{};
    if (KeyContext) {

      var {limitKey, setLimitKey, limitKeyRent, setLimitKeyRent} = useContext(KeyContext);
    }
    if (KeyContext) {
    var {keyArrRent, keyArrFlock, setKeyArrRent, setKeyArrFlock, keyVideoData, setKeyVideoData} = useContext(KeyContext);
    }
    return (
      <>
      {/* <Button style={{position: 'absolute', bottom: 0, zIndex: 500}} title="GET MORE" onPress={()=> {
        if (flockOrNot == "flockData") {
        setLimitKey(limitKey + 2);
        } else {
          setLimitKeyRent(limitKeyRent + 2);
        }
      console.log('get more');
      }
    }/> */}
      <View>
        
        {/* <LinearGradient
          colors={[constants.LIGHTGREY, 'rgba(0,0,0,0)']}
          style={{
            height: 70,
            width: '100%',
            position: 'absolute',
            top: 0,
            zIndex: 40,
          }}></LinearGradient> */}
                      
        <ScrollView
          style={{
            paddingLeft: 15,
            paddingRight: 15,

            // marginLeft: 10,
            // marginRight: 10,
          }}
          contentContainerStyle={{
            justifyContent: 'space-around',
            flexDirection: 'row',
          }}
          onScrollEndDrag={(event) => {
            if (
              event.nativeEvent.contentOffset.y + 400 >
              0.8 * event.nativeEvent.contentSize.height
            ) {
              console.log('should be fetching albums');
              fetchRentables().then((ar)=>{
                // setKeyArrRent([...keyArrRent,...ar]);
                fetchFlockables().then((ar2) => {
                  setKeyVideoData([...keyVideoData,...shuffle([...ar, ...ar2])])
                })
              })
              // fetchFlockables().then((ar)=>{
              //   setKeyArrFlock([...keyArrFlock,...ar]);
              // })
              
              //this.props.fetchAlbums();
            }

          }}>

          <View
            key="0"
            style={{
              flexDirection: 'row',
              flex: 1,
            }}>

            <View style={styles.columnStyle}>
              {/* {testing3} */}
              {renderClucks(album1)}
            </View>
            <View key="1" style={styles.columnStyle}>
            {/* <Button title="click me to add tests" onPress={()=>{
                setTestArray([...testArray, Math.round(Math.random()*100)].reverse());
              }} /> */}
              {renderClucks(album2)}
            </View>
          </View>
          
        </ScrollView>

      </View></>
    );
  }

const styles = {
  columnStyle: {flex: 1, alignItems: 'center'},
};

export default FeedList;
