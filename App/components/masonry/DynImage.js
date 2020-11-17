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
 * DynImage.js
 *
 * This file contains code for the DynImage of Flock the app.
 * Is a container for the Video clucks on FeedList.
 *
 *
 */

import React, {useState} from 'react';
import {Dimensions, View} from 'react-native';
import InViewPort from 'App/components/InViewPort';
import ProductBlurb from 'App/components/masonry/ProductBlurb';
import Berry from 'App/components/masonry/Berry';
import {constants} from 'App/constants';
import Media from 'App/components/masonry/Media';

const DynImage = ({videoAr, navigation, data}) => {
  const width = Dimensions.get('window').width / 2 - 10;

  const [isInView, setIsInView] = useState(false);

  return (
    <InViewPort
      onChange={(isVisible) => {
        setIsInView(isVisible);
      }}>
      <View
        style={{
          borderRadius: 15,
          overflow: 'hidden',
          marginLeft: 5,
          width: width,
        }}>
        <Berry />
        <Media
          isInView={isInView}
          width={width}
          navigation={navigation}
          data={data}
          videoAr={videoAr}
        />
        <ProductBlurb data={data} />
        <View style={{height: 10}} />
      </View>
    </InViewPort>
  );
};

const styles = {
  textStyle: {
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  mediaStyle: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,

    backgroundColor: 'rgba(0,0,0,0.3)',
  },
};

export default DynImage;
