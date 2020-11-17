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
import {View, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import Video from 'App/components/Video';
import LinearGradient from 'react-native-linear-gradient';
import {constants} from 'App/constants';

const Media = ({isInView = true, width, navigation, videoAr, data}) => {
  const [vh, setVH] = useState(0);
  const changeViewHeight = (height) => {
    setVH(height);
  };
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
        });
      }}>
      <View style={{backgroundColor: '#ddd'}}>
        <Video
          viewHeight={vh}
          persistHeightFunc={changeViewHeight}
          visible={isInView}
          masonry={true}
          muted={true}
          paused={false}
          repeat={true}
          data={data}
          maxWidth={width}
        />
      </View>
      <VideoGradient />
    </TouchableOpacity>
  );
};

const VideoGradient = () => {
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
        }}>
        {title}
      </Text>
    </LinearGradient>
  );
};

export default Media;
