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

import React, {useState, useEffect, createContext, useContext} from 'react';
import {View, Text, TextInput, Image, ImageBackground, TouchableOpacity} from 'react-native';
import FeedList from './feed/FeedList';
import {constants} from 'App/constants';
import styles from './Home.style.ios';
import LinearGradient from 'react-native-linear-gradient';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {fetchChatGroups} from 'App/utils';
import {firebase, db} from 'App/firebase/config';
import {CommonActions, NavigationContainer} from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();
const KeyContext = createContext();
const KeyContextProvider = (props) => {
  const [routeKey, setRouteKey] = useState(null);
  return (
    <KeyContext.Provider
      value={{key: routeKey, setKey: (value) => setRouteKey(value)}}>
      {props.children}
    </KeyContext.Provider>
  );
};

const DataList = ({navigation, route}) => {
  const val = route.params?.value || null;
  const {setKey} = useContext(KeyContext);
  console.log(route.params);
  useEffect(() => {
    setKey(route.key);
  }, [route, setKey]);
  var data = route.params.videoData;
  // data.map(()=>{});
  // const boxes = <View style={{backgroundColor: 'white'}}>{data.map(()=>{
  //   <View style={{width: 30, height: 50, backgroundColor: 'red'}} />
  // })}</View>
  return <View style={{height: '100%', backgroundColor: 'pink', width: '100%'}}><Text style={{color: 'white'}}>{val}</Text><FeedList route={route} /></View>;
}

const HomeTabSwipe = ({videoData, navigation}) => {
  const [flockData, setFlockData] = useState([{flock: 'test'}]);
  const [rentData, setRentData] = useState([{flock: 'test'}]);
  const {key} = useContext(KeyContext);
  React.useEffect(() => {
    if (key) {
      setTimeout(() => {
        navigation.dispatch({
          ...CommonActions.setParams({value: 'Updated state'}),
          source: key,
        });
      }, 10000);

      var citiesRef = db.collection("chatGroups");
      // this filter is kind of inefficient; gets the entire table
      var query = citiesRef;
      var unsubscribe = query
      .onSnapshot(function(querySnapshot) {
        const rent = [];
        const flock = [];
        querySnapshot.forEach(function(doc) {
          console.log("FOUNDDDDDD");
          if (doc.data().completed === false) {
          flock.push(doc.data());
          } else {
            rent.push(doc.data());
          }
        });
        navigation.dispatch({
          ...CommonActions.setParams({videoData: rent}),
          source: key,
        });
        // setFlockData(flock);
        // setRentData(rent);
      });
  
      return () => {unsubscribe()};
    }

  }, [key]);


  var navigator = 
  <Tab.Navigator>
  <Tab.Screen name="posts" component={FeedList} initialParams={{videoData: videoData}} />
  <Tab.Screen name="Flocking" component={DataList} initialParams={{value: 'hello world', videoData:[]}} />
  <Tab.Screen name="Popular" component={FeedList} initialParams={{videoData: []}} />
  <Tab.Screen name="Borrow" component={FeedList} initialParams={{videoData: []}} />
</Tab.Navigator>;


return <>{navigator}</>;


}
const Home = ({route, navigation, lastVisible = null}) => {


  const [testString, setTestString] = useState("helloworld");
  // {lastVisible} for keep track of firebase paging


{/* <FeedList navigation={navigation} route={route} /> */}


  useEffect(()=>{
    // fetchChatGroups().then((ar) => {
    //   setFlockData(ar);
    //   setTestString("worldhello");
    //   console.log("FLOCKS", ar);
    // });
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
        <KeyContextProvider>
        <HomeTabSwipe navigation={navigation} videoData={route.params.videoData} />
        </KeyContextProvider>
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
