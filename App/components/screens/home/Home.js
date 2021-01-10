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

var messages = [] 
var listeners = []    // list of listeners
var pageStart = null      // start position of listener
var pageEnd = null        // end position of listener  
function getMessages(navigation, key, key1) {    // query reference for the messages we want
  let ref = db.collection('chatGroups')
  ref.orderBy('flock', 'desc')
  // .limit(1)
  .get()
  .then((snapshots) => {
  pageStart = snapshots.docs[snapshots.docs.length - 1]    // create listener using startAt snapshot (starting boundary)    
  let listener = ref.orderBy('flock')
    .startAt(pageStart)
    .onSnapshot((querySnapshot) => {        // append new messages to message array
      const rent = [];
      const flock = [];
      querySnapshot.forEach(function(doc) {
        if (doc.data().completed === false) {
        flock.push(doc.data());
        } else {
          rent.push(doc.data());
        }
      });
      navigation.dispatch({
        ...CommonActions.setParams({videoData: [], rentData: rent, flockData: flock}),
        source: key,
      });
      navigation.dispatch({
        ...CommonActions.setParams({videoData: [], rentData: rent, flockData: flock}),
        source: key1,
      });     
    })
    // add listener to list
    listeners.push(listener)
  })
}

function getMoreMessages(navigation) {
  let ref = db.collection('chats').doc(chatId)
  .collection('messages')    // single query to get new startAt snapshot
  ref.orderBy('createdAt', 'desc')
  .startAt(start)
  .limit(1).get()
  .then((snapshots) => {     // previous starting boundary becomes new ending boundary
    pageEnd = start
    start = snapshots.docs[snapshots.docs.length - 1]      // create another listener using new boundaries     
    let listener = ref.orderBy('createdAt')
    .startAt(start).endBefore(pageEnd)
    .onSnapshot((groups) => {
      // groups.forEach((group) => {
      //   messages = messages.filter(x => x.id !== message.id)
      //   messages.push(message.data())
      // })
      messages = [...groups];
    })
    listeners.push(listener)
  })
}

const Tab = createMaterialTopTabNavigator();
const KeyContext = createContext();
const KeyContextProvider = (props) => {
  const [routeKey, setRouteKey] = useState(null);
  const [routeKey1, setRouteKey1] = useState(null);
  return (
    <KeyContext.Provider
      value={{key: routeKey, setKey: (value) => setRouteKey(value), key1: routeKey1, setKey1: (value) => setRouteKey1(value)}}>
      {props.children}
    </KeyContext.Provider>
  );
};

const DataList = ({navigation, route}) => {
  const val = route.params?.value || null;
  const {key, setKey, key1, setKey1} = useContext(KeyContext);
  route.params.videoData = route.params[route.params.dataType];
  //route.params.videoData = route.params.flockData;

  useEffect(() => {
    if (route.params.dataType === 'flockData') {
      setKey(route.key);
    } else {
      setKey1(route.key);
    }
    
  }, [route, setKey, key]);
  var data = route.params.videoData;
  // data.map(()=>{});
  // const boxes = <View style={{backgroundColor: 'white'}}>{data.map(()=>{
  //   <View style={{width: 30, height: 50, backgroundColor: 'red'}} />
  // })}</View>
  return <View style={{height: '100%', backgroundColor: 'pink', width: '100%'}}><Text style={{color: 'white'}}>{val}</Text><FeedList route={route} feedItem={(al)=><TouchableOpacity onPress={()=>{
    if (route.params.dataType === "flockData") {
      navigation.navigate('ChatInterface', {data: al});
    } else if (route.params.dataType === "rentData") {
    navigation.navigate('FlockReserve', {data:al});
    }
  }}><View style={{height: 150, backgroundColor: 'black', width: '100%'}} /></TouchableOpacity>} /></View>;
}

const HomeTabSwipe = ({videoData, navigation, route}) => {
  const [flockData, setFlockData] = useState([{flock: 'test'}]);
  const [rentData, setRentData] = useState([{flock: 'test'}]);
  const {key, key1} = useContext(KeyContext);
  var unsubscribe;
  React.useEffect(() => {
    if (key && key1) {
      setTimeout(() => {
        navigation.dispatch({
          ...CommonActions.setParams({value: 'Updated state'}),
          source: key,
        });
      }, 10000);

      getMessages(navigation, key, key1);
      // var citiesRef = db.collection("chatGroups");
      // // this filter is kind of inefficient; gets the entire table
      // var query = citiesRef;
      // unsubscribe = query
      // .onSnapshot(function(querySnapshot) {
      //   const rent = [];
      //   const flock = [];
      //   querySnapshot.forEach(function(doc) {
      //     if (doc.data().completed === false) {
      //     flock.push(doc.data());
      //     } else {
      //       rent.push(doc.data());
      //     }
      //   });
      //   navigation.dispatch({
      //     ...CommonActions.setParams({videoData: [], rentData: rent, flockData: flock}),
      //     source: key,
      //   });
      //   navigation.dispatch({
      //     ...CommonActions.setParams({videoData: [], rentData: rent, flockData: flock}),
      //     source: key1,
      //   });
      //   // setFlockData(flock);
      //   // setRentData(rent);
      // });
  

      // this breaks something v
      //return () => {unsubscribe()};
    }

  }, [key, key1]);

  useEffect(()=>{
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  },[]);
  var navigator = 
  <Tab.Navigator>
  <Tab.Screen name="posts" component={FeedList} initialParams={{videoData: videoData}} />
  <Tab.Screen name="Flocking" component={DataList} initialParams={{value: 'hello world', videoData:[], flockData: [], rentData: [], dataType: 'flockData'}} />
  <Tab.Screen name="Popular" component={FeedList} initialParams={{videoData: []}} />
  <Tab.Screen name="Request" component={DataList} initialParams={{value: 'hello world', videoData:[], flockData: [], rentData: [], dataType: 'rentData'}} />
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
        <HomeTabSwipe navigation={navigation} route= {route} videoData={route.params.videoData} />
        </KeyContextProvider>
      </View>
    </View>
  );
};

export default Home;
