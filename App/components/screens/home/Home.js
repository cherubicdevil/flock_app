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

import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Image, ImageBackground, TouchableOpacity} from 'react-native';
import FeedList from './feed/FeedList';
import {constants} from 'App/constants';
import styles from './Home.style.ios';
import LinearGradient from 'react-native-linear-gradient';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {fetchChatGroups} from 'App/utils';

const Tab = createMaterialTopTabNavigator();

const Home = ({route, navigation, lastVisible = null}) => {
  const [flockData, setFlockData] = useState([{flock: 'test'}]);
  console.log('flock DATA', flockData);
  const [testString, setTestString] = useState("helloworld");
  // {lastVisible} for keep track of firebase paging

  var navigator = 
  <Tab.Navigator>
  <Tab.Screen name="posts" component={FeedList} initialParams={{videoData: route.params.videoData}} />
  <Tab.Screen name="Liked" component={FeedList} initialParams={{videoData: route.params.flockData, test: testString}} />
</Tab.Navigator>;

{/* <FeedList navigation={navigation} route={route} /> */}


  useEffect(()=>{
    fetchChatGroups().then((ar) => {
      setFlockData(ar);
      setTestString("worldhello");
      console.log("FLOCKS", ar);
    });
    // fetchRentGroups().then((ar) => {
    //   setRentData(ar);
    // });
  }, []);
  return (
    <View style={styles.wrapperAll}>

      <View style={[styles.sectionOneStyle, {backgroundColor: 'rgba(255,255,255,0.3)'}]}>
        <View style={{width: '100%', height: '100%'}} />
        {/* <ImageBackground
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
        </ImageBackground> */}
      </View>
 
      <View style={styles.sectionThreeStyle}>
        {/* <View style={styles.loadingBackground}>
          <Image
            style={{width: 60, height: 60}}
            source={require('App/Assets/Images/cute_duck.png')}
          />
          <Text style={{fontFamily: constants.FONT}}>Curating your clucks</Text>
        </View> */}
        {navigator}
      </View>
    </View>
  );
};

const T1 = ({navigation}) => {
  return <TouchableOpacity onPress={()=>{navigation.navigate("ProfileMain")}}><Text>Hi</Text></TouchableOpacity>
}
const T2 = () => {
  return <Text>Hi2</Text>
}

export default Home;
