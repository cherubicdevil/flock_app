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
 * Home.js
 *
 * This file contains code for the Home page of flock the app that has the
 * FeedList and searchBar.
 *
 *
 */

import React from 'react';
import {View, Text, TextInput, Image, ImageBackground} from 'react-native';
import NavBar from 'App/components/static/NavBar';
import FeedList from 'App/components/masonry/FeedList';
import {constants} from 'App/constants';
import styles from './Home.style.ios';

const Home = ({route, navigation, lastVisible = null}) => {
  // {lastVisible} for keep track of firebase paging

  return (
    <View style={styles.wrapperAll}>
      <View style={styles.sectionOneStyle}>
        <ImageBackground
          imageStyle={{borderRadius: 25}}
          style={styles.topBox}
          source={require('App/Assets/Images/Orange_Gradient_Small.png')}>
          <View style={styles.textBoxWrapper}>
            <TextInput
              placeholder="Search products and clucks"
              style={styles.textBoxStyle}
            />
            <Image
              source={require('App/Assets/Images/Search.png')}
              style={styles.searchIcon}
            />
          </View>
        </ImageBackground>
      </View>

      <View style={styles.sectionThreeStyle}>
        <View style={styles.loadingBackground}>
          <Image
            style={{width: 60, height: 60}}
            source={require('App/Assets/Images/cute_duck.png')}
          />
          <Text style={{fontFamily: constants.FONT}}>Curating your clucks</Text>
        </View>
        <FeedList navigation={navigation} route={route} />
      </View>

      <NavBar route={route} navigation={navigation} />
    </View>
  );
};

export default Home;
