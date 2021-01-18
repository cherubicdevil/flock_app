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
import {SafeAreaView, View, Text, TextInput, Image, ImageBackground, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import FeedList from './feed/FeedList';
import {constants} from 'App/constants';
import styles from './Home.style.ios';
import LinearGradient from 'react-native-linear-gradient';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {fetchChatGroups} from 'App/utils';
import {firebase, db} from 'App/firebase/config';
import {CommonActions, NavigationContainer} from '@react-navigation/native';
import Carousel from 'App/components/screens/videopage/Carousel'
import VideoPage from 'App/components/screens/videopage/VideoPage';
import NewVideoPage from 'App/components/screens/videopage/NewVideoPage';
import {useDispatch, } from 'react-redux';
import { fetchAlbums } from '../../../utils';
import FeatherPanResponder from 'App/components/FeatherPanResponder';
import ResizeableImage from 'App/components/ResizeableImage';

import FeatherCarousel from 'App/components/FeatherCarousel';
// import FeatherPanResponder from 'App/components/FeatherPanResponder';

const Tab = createMaterialTopTabNavigator();
const KeyContext = createContext();
const KeyContextProvider = (props) => {
  const [routeKey, setRouteKey] = useState(null);
  const [routeKey1, setRouteKey1] = useState(null);
  const [pageEnd, setPageEnd] = useState(2);
  const [limit, setLimit] = useState(2);
  const [limitRent, setLimitRent] = useState(2);
  const [arrFlock, setArrFlock] = useState([]);
  const [arrRent, setArrRent] = useState([]);
  const [videoData, setVideoData] = useState([]);
  return (
    <KeyContext.Provider
      value={{key: routeKey, 
      setKey: (value) => setRouteKey(value), 
      key1: routeKey1, 
      setKey1: (value) => setRouteKey1(value),
      pageKey: pageEnd,
      setPageEnd: (value) => setLimit(value),
      limitKey: limit,
      setLimitKey: (value) => setLimit(value),
      limitKeyRent: limitRent,
      setLimitKeyRent: (value) => setLimitRent(value),
      keyArrFlock: arrFlock,
      setKeyArrFlock: (value) => setArrFlock(value),
      keyArrRent: arrRent,
      setKeyArrRent: (value) => setArrRent(value),
      keyVideoData: videoData,
      setKeyVideoData: (value) => setVideoData(value),

      }}>
      {props.children}
    </KeyContext.Provider>
  );
};

const DataList = ({navigation, route}) => {
  const val = route.params?.value || null;
  const {key, setKey, key1, setKey1} = useContext(KeyContext);
  const {keyArrFlock, keyArrRent, keyVideoData} = useContext(KeyContext);
  //route.params.videoData = route.params[route.params.dataType];
  if (route.params.dataType === "flockData") {
    route.params.videoData = keyArrFlock;
  } else if (route.params.videoData === "rentData") {
    route.params.videoData = keyArrRent;
  } else if (route.params.videoData === "videoData") {
    route.params.videoData = keyVideoData;
  }
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
  return <View style={{height: '100%', backgroundColor: constants.PINK_BACKGROUND, width: '100%'}}><Text style={{color: 'white'}}>{val}</Text><FeedList route={route} flockOrNot={route.params.dataType} KeyContext={KeyContext} feedItem={(al)=>{
  // console.log('al image', al.image, al.title, al.product.image);
    return <TouchableOpacity onPress={()=>{
    if (route.params.dataType === "flockData") {
      navigation.navigate('ChatInterface', {data: al});
    } else if (route.params.dataType === "rentData") {
    navigation.navigate('FlockReserve', {data:al});
    }
  }}

  >
    <View style={{backgroundColor: 'black', width: '100%', resizeMode: 'contain'}} >
      <ResizeableImage source = {{uri: al?.product?.image}} wLimit = {Dimensions.get('window').width/2 - 30} />
    </View>
    </TouchableOpacity>}} 
      productBlurb={(item)=> {
        return <View style={{padding: 20, width: '100%'}} >
          <Text numberOfLines={1} style={{flex: 1, fontWeight:'bold'}}>{item.product?.title}hi</Text>
          
        </View>
      }}
    /></View>;
}

const HomeTabSwipe = ({videoData, navigation, route}) => {
  const {key, key1, limitKey, unsubscribeKey, limitKeyRent} = useContext(KeyContext);
  const {keyArrFlock, setKeyArrFlock, keyArrRent, setKeyArrRent, keyVideoData} = useContext(KeyContext);
  var unsubscribeCurrent;
  var unsubscribeCurrentRent;
  React.useEffect(() => {
    // this should make it so that on creating new listener with new limit, the previous one is gone.
      if (unsubscribeCurrent) {
        console.log('unsubscribing flock');
        unsubscribeCurrent();
      }

    if (key && key1) {
      setTimeout(() => {
        navigation.dispatch({
          ...CommonActions.setParams({value: 'Updated state'}),
          source: key,
        });
      }, 10000);

      // getMessages(navigation, key, key1);
      console.log('subscribing flock');
      var citiesRef = db.collection("chatGroups");
      // this filter is kind of inefficient; gets the entire table
      var query = citiesRef;
      unsubscribeCurrent = query
      .where('completed', '==', false)
      .limit(limitKey)
      .onSnapshot(function(querySnapshot) {
        const rent = [];
        const flock = [];
        querySnapshot.forEach(function(doc) {
          if (doc.data().completed === false) {
          flock.push(doc.data());
          } else {
            rent.push(doc.data());
          }
        });
        // navigation.dispatch({
        //   ...CommonActions.setParams({videoData: [], rentData: rent, flockData: flock}),
        //   source: key,
        // });
        setKeyArrFlock(flock);
        // navigation.dispatch({
        //   ...CommonActions.setParams({videoData: [], rentData: rent, flockData: flock}),
        //   source: key1,
        // });
        // setFlockData(flock);
        // setRentData(rent);
      });
  

      // this breaks something v
      //return () => {unsubscribe()};
    }


    return () => {
      if (unsubscribeCurrent) {
        console.log("unsubscribing flock");
        unsubscribeCurrent();
      }
    };
  }, [key, limitKey]);

  React.useEffect(() => {
    // this should make it so that on creating new listener with new limit, the previous one is gone.
      if (unsubscribeCurrentRent) {
        console.log('unsubscribing rent');
        unsubscribeCurrentRent();
      }

    if (key && key1) {
      setTimeout(() => {
        navigation.dispatch({
          ...CommonActions.setParams({value: 'Updated state'}),
          source: key,
        });
      }, 10000);

      // getMessages(navigation, key, key1);
      var citiesRef = db.collection("chatGroups");
      // this filter is kind of inefficient; gets the entire table
      console.log('subscribing rent');
      var query = citiesRef;
      unsubscribeCurrentRent = query
      .where('completed', '==',true)
      .limit(limitKeyRent)
      .onSnapshot(function(querySnapshot) {
        const rent = [];
        const flock = [];
        querySnapshot.forEach(function(doc) {
          if (doc.data().completed === false) {
          flock.push(doc.data());
          } else {
            rent.push(doc.data());
          }
        });
        // navigation.dispatch({
        //   ...CommonActions.setParams({videoData: [], rentData: rent, flockData: flock}),
        //   source: key,
        // });
        // navigation.dispatch({
        //   ...CommonActions.setParams({videoData: [], rentData: rent, flockData: flock}),
        //   source: key1,
        // });
        setKeyArrRent(rent);
        // setFlockData(flock);
        // setRentData(rent);
      });
  

      // this breaks something v
      //return () => {unsubscribe()};
    }


    return () => {
      if (unsubscribeCurrentRent) {
        console.log('unsubscribing rent')
        unsubscribeCurrentRent();
      }
    };
  }, [key1, limitKeyRent]);

  // useEffect(()=>{
    // return () => {
    //   if (unsubscribeCurrent) {
    //     unsubscribeCurrent();
    //   }
    // };
  // },[key, key1]);
  var navigator = 
  <Tab.Navigator
  >
    <Tab.Screen name="for you" component = {MiniCarousel}/>
  <Tab.Screen name="posts" component={DataList} initialParams={{videoData: keyVideoData, dataType:'videoData'}} />
  <Tab.Screen name="Popular" component={FeedList} initialParams={{videoData: []}} />
  <Tab.Screen name="Flocking" component={DataList} initialParams={{value: 'hello world', videoData:[], flockData: [], rentData: [], dataType: 'flockData'}} />
  <Tab.Screen name="Request" component={DataList} initialParams={{value: 'hello world', videoData:[], flockData: [], rentData: [], dataType: 'rentData'}} />
  {/* <Tab.Screen name="Flocking" component={FeedList} initialParams={{value: 'hello world', videoData:[], flockData: [], rentData: [], dataType: 'flockData', flockOrNot: 'flockData'}} /> */}
  {/* <Tab.Screen name="Request" component={FeedList} initialParams={{value: 'hello world', videoData:[], flockData: [], rentData: [], dataType: 'rentData', flockOrNot: 'rentData'}} /> */}
  <Tab.Screen name="feather" component={FeatherCarousel} initialParams={{value: 'hello world', videoData:[], flockData: [], rentData: [], dataType: 'rentData'}} />
  {/* <Tab.Screen name="featherpan" component={FeatherPanResponder} initialParams={{KeyContext: KeyContext,value: 'hello world', videoData:[], flockData: [], rentData: [], dataType: 'rentData'}} /> */}

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

const MiniCarousel = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [viewHeight, setViewHeight] = useState(800);
  const {key, setKey, key1, setKey1, keyArrRent, keyArrFlock, keyVideoData, setKeyVideoData} = useContext(KeyContext);
  // return <View><Text>Hi</Text></View>;
  const [finalAr, setFinalAr] = useState([]);
  var testAr = [];
  useEffect(()=> {
    setFinalAr(shuffle([...keyArrRent, ...keyArrFlock,...keyVideoData]));
    
  }, [keyArrRent, keyArrFlock, keyVideoData]);

  useEffect(()=>{
    dispatch({type:'sendCarouselIndex', payload: 0});
    fetchAlbums().then((ar) => {
      setKeyVideoData(ar.ar);
    })
  }, [])

  var res = [];
  for (const item of finalAr) {
    res.push(<View style={{height: viewHeight, width: '100%', borderWidth: 1}}>
    {/* <Text>{item?.product?.title || item.flock}</Text> */}
    <NewVideoPage navigation={navigation} data={item} index={finalAr.indexOf(item)} currIndex={finalAr.indexOf(item)} viewHeight={viewHeight} />
    </View>);
  }
  // return <View onLayout = {(event) => {
  //   setViewHeight(event.nativeEvent.layout.height);
  // }} style={{height: '100%'}}>
  //   <ScrollView horizontal={false} showsVerticalScrollIndicator={false}
  //   onMomentumScrollEnd={(event)=>{
  //     console.log(event.nativeEvent.contentOffset)
  //     dispatch({type:'sendCarouselIndex', payload: Math.floor(event.nativeEvent.contentOffset.y / viewHeight)});
  //   }}
  //   // onScroll ={(event)=>{
  //   //   dispatch({type:'sendCarouselIndex', payoad: Math.floor()});
  //   // }}
  //     pagingEnabled={true}>
  //       {res}
  //     </ScrollView>
  // </View>
  return <FeatherPanResponder navigation={navigation} route={route} data={res} />;

}

const shuffle = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array;
}

const Page = () => {
  return <View>

  </View>
};

export default Home;
