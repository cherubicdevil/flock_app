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
 * Media.js
 *
 * This file contains code for the Media component of flock the app.
 * It resides on the HomePage, in a masonry format to show both
 * clucks.
 *
 * It is one of the base items in FeedList. The other is HalfProduct.
 *
 *
 */

import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, Dimensions, Image, Animated} from 'react-native';
import {useDispatch} from 'react-redux';
import ResizeableVideo from 'App/components/ResizeableVideo';
import LinearGradient from 'react-native-linear-gradient';
import {constants} from 'App/constants';

const Media = ({isInView = true, width, navigation, videoAr, data, title}) => {
  // check if type == null?
  // potential FLOCK_BUG

  const dispatch = useDispatch();
  return (
    <TouchableOpacity
      onPress={() => {
        // FLOCK_BUG
        // i dont think the dispatches are necessary anymore
        dispatch({type: 'sendData', payload: data});
        dispatch({
          type: 'sendCarouselIndex',
          payload: videoAr.indexOf(data),
        });
        navigation.navigate('Carousel', {
          scrollIndex: videoAr.indexOf(data),
          vidData: data,
          array: videoAr,
        });
      }}>
      <View style={{backgroundColor: '#ddd', marginTop: -10}}>
        <VanishVideo
          visible={isInView}
          data={data}
          maxWidth={width}
        />
      </View>
      <VideoGradient title={title} />
    </TouchableOpacity>
  );
};

const VideoGradient = ({title}) => {
  return (
    <LinearGradient
      colors={['transparent', '#000']}
      style={{
        height: 70,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
        zIndex: 40,
      }}>
      <Text
        style={{
          marginLeft: 10,
          fontFamily: constants.FONTBOLD,
          color: 'white',
        }}>
        {title}
      </Text>
    </LinearGradient>
  );
};

const VanishVideo = ({visible, data, maxWidth}) => {
  const [fade, setFade] = useState(new Animated.Value(0));
  // these attributes come from streamableVideo fetching, from the node heroku server. don't mess this up. make sure that data is always provided.
  // potential FLOCK_BUG later
  const fadeIn = (val, duration) => {
    Animated.timing(
      // Animate over time
      val, // The animated value to drive
      {
        toValue: 1, // Animate to opacity: 1 (opaque)
        duration: duration, // 2000ms
        useNativeDriver: true,
      },
    ).start();
  };
  const height = (data.size.height / data.size.width) *
  (maxWidth);
  if (!visible) {
    return <View style={{height: height, width: '100%', justifyContent: 'center', alignItems: 'center'}} ><View style={{justifyContent: 'center', alignItems: 'center'}}></View></View>;
  }
  // useEffect(()=> {
  //   fadeIn(fade, 500);
  // }, []);
  fadeIn(fade, 500);
  //return <View style={{height: 300}} />;
  return <><View style={{position: 'absolute', height: height, width: '100%', justifyContent: 'center', alignItems: 'center'}}><Image source={require('App/Assets/Images/flock_logo_white.png')} style={{height: 100, width: 125}} /></View><Animated.View style={{height: height, width: '100%', opacity: fade}} ><ResizeableVideo data = {data} horizontalLimit={true} wLimit={maxWidth} muted={true} /></Animated.View></>;
}

export default Media;
