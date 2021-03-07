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


const FeedList= ({testArray, setTestArray, navigation, route, videoData, FeedItemLocal=null, productBlurb=null, KeyContext= null, flockOrNot}) => {
  


  const [myAr, setMyAr] = useState([]);
  // const [localAr, setLocalAr] = useState(videoData);

  const renderProductBlurb = (product) => {
    if (productBlurb) {
      return productBlurb(product);
    }
    return <ProductBlurb data={product} />
  }
  const renderFeedItem = (al) => {
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
return <FeedItemLocal al={al} key={al.id} />;
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

var testing2 = [...testing].reverse();

    const ar = mergeArrays(videoData, []);
    const album1 = videoData;
    // const album1 = ar.slice(0, ar.length / 2);
    // const album2 = ar.slice(ar.length / 2, ar.length);

    var limit = 0;
    var setLimit = ()=>{};
    if (KeyContext) {

      var {limitKey, setLimitKey, limitKeyRent, setLimitKeyRent} = useContext(KeyContext);
    }
    if (KeyContext) {
    var {keyArrRent, keyArrFlock, setKeyArrRent, setKeyArrFlock} = useContext(KeyContext);
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
                setKeyArrRent([...keyArrRent,...ar]);
              })
              fetchFlockables().then((ar)=>{
                setKeyArrFlock([...keyArrFlock,...ar]);
              })
              
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
              {testing2}
              {/* {renderClucks(album1)} */}
            </View>
            <View key="1" style={styles.columnStyle}>
            <Button title="click me to add tests" onPress={()=>{
                setTestArray([...testArray, Math.round(Math.random()*100)].reverse());
              }} />
              {/* {renderClucks(album2)} */}
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
