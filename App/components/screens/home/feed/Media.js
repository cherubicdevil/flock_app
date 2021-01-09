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

import React, {useState} from 'react';
import {View, TouchableOpacity, Text, Dimensions} from 'react-native';
import {useDispatch} from 'react-redux';
import ResizeableVideo from 'App/components/ResizeableVideo';
import LinearGradient from 'react-native-linear-gradient';
import {constants} from 'App/constants';

const Media = ({isInView = true, width, navigation, videoAr, data, title}) => {
  // check if type == null?
  // potential FLOCK_BUG
  console.log("WIDTH", width);
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
  if (!visible) {
    return <View style={{width: 200 , height: 300}} />;
  }
  //return <View style={{height: 300}} />;
  return <ResizeableVideo data = {data} horizontalLimit={true} wLimit={maxWidth} muted={true} />;
}

export default Media;
