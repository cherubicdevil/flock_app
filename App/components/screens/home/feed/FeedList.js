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


import React, {useState, useContext, useEffect} from 'react';
import {Dimensions, ScrollView, View, Button} from 'react-native';
import FeedItem from './FeedItem';
import HalfProduct from './HalfProduct';
import {constants} from 'App/constants';
import {fetchAlbums, fetchProducts, mergeArrays} from 'App/utils';
import LinearGradient from 'react-native-linear-gradient';
import ProductBlurb from 'App/components/screens/home/feed/ProductBlurb';
const width = Dimensions.get('window').width / 2 - 30;
const FeedList= ({navigation, route, feedItem=null, productBlurb=null, KeyContext, flockOrNot}) => {
  const [myAr, setMyAr] = useState([route.params.videoData]);

  useEffect(()=> {
    setMyAr(route.params.videoData);
  }, [route.params.videoData]);

  const renderProductBlurb = (product) => {
    if (productBlurb) {
      return productBlurb(product);
    }
    return <ProductBlurb data={product} />
  }
  const renderFeedItem = (al) => {
    if (feedItem) {
      return feedItem(al);
    }
    return <FeedItem
    mute={true}
    repeat={true}
    ar={myAr}
    videoAr={myAr}
    index={myAr.indexOf(al)}
    navigation={navigation}
    data={al}
    source={{uri: al.image || al.video}}
    title={al.title}
    type={al.type}
    key={al.title}
  />
  }
  const renderClucks = (album) => {
    //console.log("CLUCKS", this.props.route.params.videoData);
    return album.map((al) => {
      if (false) {
        return <HalfProduct navigation={navigation} album={al} />;
      } else {
        return (
          <>
                    <View
        style={{
          borderTopWidth: 3,
          borderColor: 'black',
          overflow: 'hidden',
          borderBottomLeftRadius: 45,
          borderBottomRightRadius: 45,
          borderWidth:3,
          width: width,
        }}>
          <View style={{overflow: 'hidden', borderBottomRightRadius: 40, borderBottomLeftRadius: 40,}}>
          
          {renderFeedItem(al)}
          </View>
          </View>
          {renderProductBlurb(al)}
          </>
        );
      }
    });
  }

    // console.log('flock data length', this.props.route.params.videoData.length);
    // console.log("FL DATA", this.props.route.params);


    const ar = mergeArrays(myAr, []);
    const album1 = ar.slice(0, ar.length / 2);
    const album2 = ar.slice(ar.length / 2, ar.length);

    var limit = 0;
    var setLimit = ()=>{};
    if (KeyContext) {

      var {limitKey, setLimitKey, limitKeyRent, setLimitKeyRent} = useContext(KeyContext);
    }
    return (
      <><Button style={{position: 'absolute', bottom: 0, zIndex: 500}} title="GET MORE" onPress={()=> {
        if (flockOrNot == "flockData") {
        setLimitKey(limitKey + 2);
        } else {
          setLimitKeyRent(limitKeyRent + 2);
        }
      console.log('get more');
      }
    }/>
      <View>
        
        <LinearGradient
          colors={[constants.LIGHTGREY, 'rgba(0,0,0,0)']}
          style={{
            height: 70,
            width: '100%',
            position: 'absolute',
            top: 0,
            zIndex: 40,
          }}></LinearGradient>
                      
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
              //this.props.fetchAlbums();
            }

          }}>

          <View
            key="0"
            style={{
              flexDirection: 'row',
              flex: 1,
            }}>
              
            <View style={styles.columnStyle}>{renderClucks(album1)}</View>
            <View key="1" style={styles.columnStyle}>
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
