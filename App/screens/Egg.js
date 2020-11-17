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
 * Egg.js
 *
 * This file contains code for the Egg page of flock the app.
 * It graphically shows how close the user is to getting a discount
 * when the egg fills up.
 *
 * Communicates with redux and firebase to sync egg data.
 *
 *
 */

import React from 'react';
import {ImageBackground, View, Text, Image} from 'react-native';
import {useSelector} from 'react-redux';
import NavBar from 'App/components/static/NavBar';
import ProfileIcon from 'App/components/ProfileIcon';
import {constants} from 'App/constants';

const Egg = ({route, navigation}) => {
  const selector = useSelector((state) => state);
  return (
    <ImageBackground style={{flex: 1}} source={constants.GRADIENT2}>
      <View style={styles.contentWrapper}>
        <Text style={styles.eggCountText}>
          {selector.goose.count} {eggCountCaption}
        </Text>
        <ProfileIcon
          navigation={navigation}
          style={styles.profileSpatialPosition}
        />
        {renderEgg(selector)}
      </View>
      <NavBar route={route} navigation={navigation} />
    </ImageBackground>
  );
};

const renderEgg = (selector) => {
  const percent = (selector.goose.count / maxEgg) * 100;
  if (percent < 100) {
    return (
      <View style={imageSize}>
        <View style={[styles.eggBackfillContainer, {height: `${percent}%`}]}>
          <Image style={styles.eggBackfill} source={eggFill} />
        </View>
        <Image style={[imageSize, {zIndex: 10}]} source={eggOutline} />
      </View>
    );
  } else {
    return <Image style={imageSize} source={completedEgg} />;
  }
};

const styles = {
  eggBackfillContainer: {
    width: '100%',

    position: 'absolute',
    bottom: 0,
    zIndex: 1,
    overflow: 'hidden',
  },
  eggBackfill: {
    width: 300,
    height: 400,
    position: 'absolute',
    bottom: 0,
  },
  profileSpatialPosition: {position: 'absolute', right: 20, top: 30},
  eggCountText: {
    position: 'absolute',
    textAlign: 'center',
    top: 40,
    fontSize: 20,
    fontFamily: constants.FONT,
    borderRadius: 4,
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
};

const imageSize = {width: 300, height: 400};
const eggCountCaption = 'eggs saved';
const eggFill = require('App/Assets/Images/Egg_2.png');
const eggOutline = require('App/Assets/Images/Egg_1.png');
const completedEgg = require('App/Assets/Images/Egg_3.png');
const maxEgg = 80;

export default Egg;
