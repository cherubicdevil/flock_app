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
const io = require("socket.io-client");
import React, {useState, useEffect, createContext, useContext, Fragment, useRef} from 'react';
import {SafeAreaView, View, Text, TextInput, Image, ImageBackground, TouchableOpacity, TouchableWithoutFeedback,ScrollView, Dimensions, Animated,
  FlatList
} from 'react-native';
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
import {useDispatch, useSelector, useStore} from 'react-redux';
import {au} from 'App/firebase/config';
import { fetchAlbums, fetchFlockables, fetchRentables, shuffle, fetchFlockablesFirst, fetchRentablesFirst } from '../../../utils';
import FeatherPanResponder from 'App/components/FeatherPanResponder';
import ResizeableImage from 'App/components/ResizeableImage';
import NewTutorial from 'App/components/NewTutorial';
import FeatherCarousel from 'App/components/FeatherCarousel';
// import Animated from 'react-native-reanimated';
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
  const [finishedLoading, setFinishedLoading] = useState(false);
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

      keyFinishedLoading: finishedLoading,
      setKeyFinishedLoading: (value) => setFinishedLoading(value),

      }}>
      {props.children}
    </KeyContext.Provider>
  );
};

const Socket = (props) => {
  console.log("SOCKET", props.ref)
  const {link, socketref, ...rest} = props;
  useEffect(()=> {
    console.log("SOCKETT GETTING MADE")
    const socket = io(link)
    console.log("ref", socketref, props.ref)
    console.log(props);
    if (socketref) {
      console.log("reference assignment")
      socketref.current = socket;
    }
    const propsList = Object.entries(rest);
    propsList.map(([key, val])=> {
      socket.on(key, val);
    });

  }, [])
  return <></>;
}

const DataList = ({navigation, route}) => {
  const [testArray, setTestArray] = useState([]);

  const val = route.params?.value || null;
  const {key, setKey, key1, setKey1} = useContext(KeyContext);
  const {keyArrFlock, keyArrRent, keyVideoData} = useContext(KeyContext);
  const [cover, setCover] = useState(false);
  //route.params.videoData = route.params[route.params.dataType];
  if (route.params.dataType === "flockData") {
    route.params.videoData = keyArrFlock;
  } else if (route.params.dataType === "rentData") {
    route.params.videoData = keyArrRent;
  } else if (route.params.dataType === "videoData") {
    if (keyVideoData == null || keyVideoData.length  == 0) {
    route.params.videoData = shuffle([...keyArrRent, ...keyArrFlock]);
    keyVideoData.push(...route.params.videoData);
    } else {
      route.params.videoData = keyVideoData;
    }
  }
  useEffect(() => {
    if (route.params.dataType === 'flockData') {
      setKey(route.key);
    } else {
      setKey1(route.key);
    }
    
  }, [route, setKey, key]);
  const [coverfade, setCoverFade] = useState(new Animated.Value(1));
  const [coverheight, setCoverHeight] = useState(new Animated.Value(Dimensions.get('window').height));
  const {keyFinishedLoading} = useContext(KeyContext);
  useEffect(()=>{
    const fadeAnimation = Animated.timing(coverfade, // The animated value to drive
      {
        toValue: 0, // Animate to opacity: 1 (opaque)
        delay: 200, 
        duration: 400, // 2000ms
        useNativeDriver: false,
      },
    );
    const sizeAnimation = Animated.timing(coverheight,
      {
        toValue: 0,
        delay: 300,
        duration: 300,
        useNativeDriver: false,
      });
      if (keyFinishedLoading) {
        Animated.parallel([fadeAnimation, sizeAnimation]).start();
      }


  }, [keyFinishedLoading]);

  useEffect(()=>{
    // setTimeout(()=>{
    //   setCover(false);
    // }, 2500);
  },[])
  var data = route.params.videoData;
  // data.map(()=>{});
  // const boxes = <View style={{backgroundColor: 'white'}}>{data.map(()=>{
  //   <View style={{width: 30, height: 50, backgroundColor: 'red'}} />
  // })}</View>
  return <>
      {/* <Animated.View style={{backgroundColor: 'white', position: 'absolute', left: 0, bottom: 0, width:'100%', height: coverheight, opacity: coverfade, zIndex: 500}} >
      <View style={{
    backgroundColor: constants.PINK_BACKGROUND, height: '100%', width: '100%', paddingTop: 100, 
    justifyContent: 'center', alignItems: 'center',
    // resizeMode:'contain'
    overflow:'visible'
}}/>
<Image source={require('App/Assets/Images/flock_gif.gif')} style={{width: 300, marginTop: 50,height: 300, resizeMode:'contain', alignSelf: 'center', position: 'absolute', top:'20%'}} />
</Animated.View> */}
<View style={{height: '100%', backgroundColor: constants.PINK_BACKGROUND_OPAQUE, width: '100%'}}><Text style={{color: 'white'}}>{val}</Text><FeedList testArray={testArray} setTestArray={setTestArray} navigation={navigation} route={route} videoData={route.params.videoData} flockOrNot={route.params.dataType} KeyContext={KeyContext} 
  FeedItemLocal={React.memo(({al})=>{
  // console.log('al image', al.image, al.title, al.product.image);
    return <TouchableOpacity key={al.id} onPress={()=>{
    if (al.completed === false) { // flock
      navigation.navigate("Product", {album: al.product, data: al, id: al.id});
    } else if (al.completed === true) {
    navigation.navigate('FlockReserve', {data:al});
    } else {
      navigation.navigate("Product", {album: al.product, data: al, id: al.id})
    }
  }}

  >
    <View style={{backgroundColor: 'black', width: '100%', resizeMode: 'contain'}} >
      <ResizeableImage source = {{uri: al?.product?.image}} wLimit = {Dimensions.get('window').width/2 - 30} />
    {/* <Image defaultSource={require('App/Assets/Images/flock_logo_white.png')} style={{width: 50, height: 50,}} source = {{uri: al?.product?.image}} /> */}
    </View>
    </TouchableOpacity>}, (prev, next)=>prev.al.id==next.al.id)} 
    /></View>

    </>;
}

const HomeTabSwipe = ({videoData, navigation, route}) => {
  const {key, key1, limitKey, unsubscribeKey, limitKeyRent} = useContext(KeyContext);
  const {keyArrFlock, setKeyArrFlock, keyArrRent, setKeyArrRent, keyVideoData, setKeyVideoData} = useContext(KeyContext);
  var unsubscribeCurrent;
  var unsubscribeCurrentRent;

  const [coverfade, setCoverFade] = useState(new Animated.Value(1));
  const [coverheight, setCoverHeight] = useState(new Animated.Value(Dimensions.get('window').height));

  useEffect(()=>{
    if (au?.currentUser) {
    au.currentUser.reload();
    }
  },[]);
  // React.useEffect(() => {
  //   // this should make it so that on creating new listener with new limit, the previous one is gone.
  //     if (unsubscribeCurrent) {
  //       console.log('unsubscribing flock');
  //       unsubscribeCurrent();
  //     }

  //   if (key && key1) {
  //     setTimeout(() => {
  //       navigation.dispatch({
  //         ...CommonActions.setParams({value: 'Updated state'}),
  //         source: key,
  //       });
  //     }, 10000);

  //     // getMessages(navigation, key, key1);
  //     console.log('subscribing flock');
  //     var citiesRef = db.collection("chatGroups");
  //     // this filter is kind of inefficient; gets the entire table
  //     var query = citiesRef;
  //     unsubscribeCurrent = query
  //     .where('completed', '==', false)
  //     .limit(limitKey)
  //     .onSnapshot(function(querySnapshot) {
  //       const rent = [];
  //       const flock = [];
  //       querySnapshot.forEach(function(doc) {
  //         if (doc.data().completed === false) {
  //         flock.push({...doc.data(), id: doc.id});
  //         } else {
  //           rent.push(doc.data({...doc.data(), id: doc.id}));
  //         }
  //       });
  //       // navigation.dispatch({
  //       //   ...CommonActions.setParams({videoData: [], rentData: rent, flockData: flock}),
  //       //   source: key,
  //       // });
  //       setKeyArrFlock(flock);
  //       // console.log("KEY FLOCK", flock)
  //       // navigation.dispatch({
  //       //   ...CommonActions.setParams({videoData: [], rentData: rent, flockData: flock}),
  //       //   source: key1,
  //       // });
  //       // setFlockData(flock);
  //       // setRentData(rent);
  //     });
  

  //     // this breaks something v
  //     //return () => {unsubscribe()};
  //   }


  //   return () => {
  //     if (unsubscribeCurrent) {
  //       console.log("unsubscribing flock");
  //       unsubscribeCurrent();
  //     }
  //   };
  // }, [key, limitKey]);

  // React.useEffect(() => {
  //   // this should make it so that on creating new listener with new limit, the previous one is gone.
  //     if (unsubscribeCurrentRent) {
  //       console.log('unsubscribing rent');
  //       unsubscribeCurrentRent();
  //     }

  //   if (key && key1) {
  //     setTimeout(() => {
  //       navigation.dispatch({
  //         ...CommonActions.setParams({value: 'Updated state'}),
  //         source: key,
  //       });
  //     }, 10000);

  //     // getMessages(navigation, key, key1);
  //     var citiesRef = db.collection("chatGroups");
  //     // this filter is kind of inefficient; gets the entire table
  //     console.log('subscribing rent');
  //     var query = citiesRef;
  //     unsubscribeCurrentRent = query
  //     .where('completed', '==',true)
  //     .limit(limitKeyRent)
  //     .onSnapshot(function(querySnapshot) {
  //       const rent = [];
  //       const flock = [];
  //       querySnapshot.forEach(function(doc) {
  //         if (doc.data().completed === false) {
  //         flock.push({...doc.data(), id: doc.id});
  //         } else {
  //           rent.push({...doc.data(), id: doc.id});
  //         }
  //       });
  //       // navigation.dispatch({
  //       //   ...CommonActions.setParams({videoData: [], rentData: rent, flockData: flock}),
  //       //   source: key,
  //       // });
  //       // navigation.dispatch({
  //       //   ...CommonActions.setParams({videoData: [], rentData: rent, flockData: flock}),
  //       //   source: key1,
  //       // });
  //       setKeyArrRent(rent);
  //       console.log("RENTTTTTTTTTTTTTTTTTTTTTTTTT", rent,"RENT");
  //       // setFlockData(flock);
  //       // setRentData(rent);
  //     });
  

  //     // this breaks something v
  //     //return () => {unsubscribe()};
  //   }


  //   return () => {
  //     if (unsubscribeCurrentRent) {
  //       console.log('unsubscribing rent')
  //       unsubscribeCurrentRent();
  //     }
  //   };
  // }, [key1, limitKeyRent]);

  // useEffect(()=>{
  //   fetchAlbums().then((ar) => {
  //     setKeyVideoData(ar.ar);
  //   });
  // }, []);

  // const {keyFinishedLoading} = useContext(KeyContext);
  // useEffect(()=>{
  //   const fadeAnimation = Animated.timing(coverfade, // The animated value to drive
  //     {
  //       toValue: 0, // Animate to opacity: 1 (opaque)
  //       delay: 2500, 
  //       duration: 400, // 2000ms
  //       useNativeDriver: false,
  //     },
  //   );
  //   const sizeAnimation = Animated.timing(coverheight,
  //     {
  //       toValue: 0,
  //       delay: 2500,
  //       duration: 300,
  //       useNativeDriver: false,
  //     });
  //     if (keyFinishedLoading) {
  //       Animated.sequence([fadeAnimation, sizeAnimation]).start();
  //     }


  // }, [keyFinishedLoading]);

  // useEffect(()=>{
    // return () => {
    //   if (unsubscribeCurrent) {
    //     unsubscribeCurrent();
    //   }
    // };
  // },[key, key1]);
  var navigator = 
  <Tab.Navigator
  swipeEnabled={false}
  tabBar= {(props)=><TopBar {...props} />}

  >
       {/* <Tab.Screen name="for you" component = {MiniCarousel}/> */}

    {/* <Tab.Screen name="flocking" component={DataList} initialParams={{value: 'hello world', videoData:[], flockData: [], rentData: [], dataType: 'flockData'}} /> */}
    <Tab.Screen name="for you" component={DataList} initialParams={{videoData: keyVideoData, dataType:'videoData'}} />
    <Tab.Screen name="flocks" component = {MiniCarouselFlocking}/>
    {/* <Tab.Screen name="borrow" component = {MiniCarouselRenting}/> */}

    {/* <Tab.Screen name="borrow" component={DataList} initialParams={{value: 'hello world', videoData:[], flockData: [], rentData: [], dataType: 'rentData'}} /> */}
  

  {/* <Tab.Screen name="Popular" component={FeedList} initialParams={{videoData: []}} /> */}
  
  
  {/* <Tab.Screen name="Flocking" component={FeedList} initialParams={{value: 'hello world', videoData:[], flockData: [], rentData: [], dataType: 'flockData', flockOrNot: 'flockData'}} /> */}
  {/* <Tab.Screen name="Request" component={FeedList} initialParams={{value: 'hello world', videoData:[], flockData: [], rentData: [], dataType: 'rentData', flockOrNot: 'rentData'}} /> */}
  {/* <Tab.Screen name="feather" component={FeatherCarousel} initialParams={{value: 'hello world', videoData:[], flockData: [], rentData: [], dataType: 'rentData'}} /> */}
  {/* <Tab.Screen name="featherpan" component={FeatherPanResponder} initialParams={{KeyContext: KeyContext,value: 'hello world', videoData:[], flockData: [], rentData: [], dataType: 'rentData'}} /> */}

</Tab.Navigator>;


return <>
{/* {navigator} */}



</>;


}
const Home = ({route, navigation, lastVisible = null}) => {

  const socket = useRef(4);
  const [serverData, setServerData] = useState([]);
  // {lastVisible} for keep track of firebase paging


{/* <FeedList navigation={navigation} route={route} /> */}


  return (
    <View style={{backgroundColor: constants.MENU_COLOR, flex: 1}}>
    <View style={{borderBottomEndRadius: 50, borderBottomLeftRadius: 50, overflow: 'hidden', height: Dimensions.get('window').height - constants.NAVBARHEIGHT,}}>
    <Fragment><SafeAreaView style={{ flex: 0, backgroundColor: constants.TRANSLUCENT }} />
    {/* <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}> */}
    {/* <SafeAreaView style={[styles.wrapperAll,{backgroundColor: constants.PINK_BACKGROUND}]}> */}
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
 
      {/* <View style={styles.sectionThreeStyle}> */}
        {/* <View style={styles.loadingBackground}>
          <Image
            style={{width: 60, height: 60}}
            source={require('App/Assets/Images/cute_duck.png')}
          />
          <Text style={{fontFamily: constants.FONT}}>Curating your clucks</Text>
        </View> */}

        {/* <KeyContextProvider>
        <HomeTabSwipe navigation={navigation} route= {route} videoData={route.params.videoData} />
        </KeyContextProvider> */}
<Socket link={"http://localhost:8080"}
  socketref = {socket}
  giveFeatureStructure={(k) => {
    console.log("getting features length");
    socket.current.emit("offerPrefs", new Array(k).fill(0));
    setTimeout(()=> {
      socket.current.emit("requestClientData");
    }, 2000)
  }}
  requestDataResult={(ar)=>{
    setServerData(ar);
  }}

  dataChange={(product)=> {
    setServerData([...serverData, product])
    console.log(product);
  }}

  />
<View style={{flex: 1, backgroundColor: constants.PINK_BACKGROUND}}>
  <FeedList videoData={serverData.map((it)=>{ return {id: 23, product:it}})} />
  </View>
      {/* </View> */}
    {/* </SafeAreaView> */}
    
    </Fragment>
    </View>
    </View>
  );
};


const MiniCarouselRenting = ({navigation, route}) => {
  const select = useSelector(state=>state.videopage);
  const dispatch = useDispatch();
  const [viewHeight, setViewHeight] = useState(800);
  const {key, key1, keyArrRent, setKeyArrRent, limitKeyRent, keyArrFlock, setKeyArrFlock, keyVideoData, setKeyVideoData, setKeyFinishedLoading} = useContext(KeyContext);
  var unsubscribeCurrentRent;
  const [lastVisibleRent, setLastVisibleRent] = useState(null);
  const [cover, setCover] = useState(false);
  const [coverFade, setCoverFade] = useState(new Animated.Value(1));

  // const [finalAr, setFinalAr] = useState([]);
  var finalAr;
  useEffect(()=>{
    fetchRentablesFirst().then(({ar, lastVisible}) => {
      setKeyArrRent(ar);
      setLastVisibleRent(lastVisible);
      dispatch({type:'sendCarouselRentIndex', payload: ar.length - 1});
      dispatch({type:'resetRent'});
    });
  },[]);

  if (select.carIndexRent < 0) {
    // dispatch({type:'sendCarouselRentIndex', payload: 9});
    dispatch({type:'sendCarouselRentIndex', payload: keyArrRent.length < 10?keyArrRent.length-1:9});
    dispatch({type:'resetRent'});
    fetchRentables(lastVisibleRent).then(({ar, lastVisible}) => {
      setKeyArrRent([...ar,...keyArrRent]);
      setLastVisibleRent(lastVisible);
    }).catch(err=>{
      console.log('something happened', err);
    })
  }


  // var finalAr = keyArrRent;
  // to be reverted.
  // var finalAr = []
  var finalAr = keyArrRent.slice(Math.max(0,keyArrRent.length-10), keyArrRent.length);
  // var finalAr = keyArrRent;
  var res = [];
  // for (const item of finalAr) {
  //   res.push(<View style={{height: '100%', width: '100%', borderWidth: 0, borderOpacity: 0.1,borderBottomWidth: 0,}}>
  //   {/* <Text>{item?.product?.title || item.flock}</Text> */}
  //   <NewVideoPage route={route} navigation={navigation} data={item} index={finalAr.indexOf(item)} currIndex={finalAr.indexOf(item)} viewHeight={viewHeight} />
  //   </View>);
  // }
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
  if (finalAr.length == 0) {
    return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: constants.PINK_BACKGROUND}}>
      <Text style={{color: constants.LAVENDER, fontSize: 15, fontFamily: constants.FONT}}>
        No completed flocks to borrow from yet.
      </Text>
    </View>
  }
  return <>
    <NewTutorial screenId="flocking" >
  <View style={{position: 'absolute', zIndex: 400, top: '40%', alignSelf: 'center',}}
                >
                {/* <Text style={{color:'black'}}>Swipe</Text> */}
                <Image source={require('App/Assets/Images/updown_swipe.png')} style={{height: 150, width: 150, shadowOpacity:0.2, tintColor: 'white', shadowOffset:{height:5, width:0}, shadowRadius:5,}} />
            </View>
  </NewTutorial>
  {/* <Animated.View style={{backgroundColor: 'white', position: 'absolute', left: 0, bottom: 0, width:'100%', height: cover?"100%":0, opacity: coverFade, zIndex: 10000}} ><View style={{
    backgroundColor: constants.PINK_BACKGROUND, height: '100%', width: '100%',
    justifyContent: 'center', alignItems: 'center',
}}/>
<Image source={require('App/Assets/Images/flock_gif.gif')} style={{width: 300, height: 300, resizeMode:'contain', position: 'absolute', top: '30%', left: '30%'}} />
</Animated.View> */}
  <View 

  onLayout = {(event) => {
    // setViewHeight(event.nativeEvent.layout.height);
  }}><FeatherPanResponder navigation={navigation} route={route} data={finalAr} viewHeight={Dimensions.get('window').height - 80 - 50 - constants.NAVBARHEIGHT} type="rent" /></View>
      {keyArrRent.length == 0?<View style={{flex: 1, backgroundColor: constants.PINK_BACKGROUND, justifyContent: 'center', alignItems: 'center'}}>
      <Text>No completed flocks available to borrow from.</Text>
      <TouchableOpacity style={{padding: 10, backgroundColor: constants.LAVENDER, borderRadius: 20, margin: 10}} onPress={()=>{
        navigation.navigate("flocks")
      }}>
        <Text>Join an ongoing flock</Text>
      </TouchableOpacity>
      <Text>or</Text>
      <TouchableOpacity style={{padding: 10, backgroundColor: constants.GREYBLUE, borderRadius: 20, margin: 10}} onPress={()=>{
        navigation.navigate("CamScreen", {data:[]})
      }}>
        <Text>Search online</Text>
        </TouchableOpacity>
    </View>
  :<></>}
  </>;

};

const MiniCarouselFlocking = ({navigation, route}) => {
  const store = useStore();
  const select = useSelector(state => state.videopage);
  const {keyFinishedLoading} = useContext(KeyContext);
  const [lastVisibleFlock, setLastVisibleFlock] = useState(null);
  const dispatch = useDispatch();
  const [viewHeight, setViewHeight] = useState(600);
  const {key, key1, keyArrRent, setKeyArrRent, limitKey, keyArrFlock, setKeyArrFlock, keyVideoData, setKeyVideoData, setKeyFinishedLoading} = useContext(KeyContext);
  var unsubscribeCurrentFlock;
  const [cover, setCover] = useState(true);
  const [coverFade, setCoverFade] = useState(new Animated.Value(1));

  var finalAr;

  

  useEffect(()=>{
    fetchFlockables().then(({ar, lastVisible}) => {
      setKeyArrFlock(ar);
      setLastVisibleFlock(lastVisible)
      dispatch({type:'sendCarouselFlockIndex', payload: ar.length - 1});
    });
  },[]);

  useEffect(()=>{
    // console.log('changing sthit', select.carIndexFlock);
    if (select.carIndexFlock < 0) {
    dispatch({type:'sendCarouselFlockIndex', payload: keyArrFlock.length < 10?keyArrFlock.length-1:9});
    dispatch({type:'resetFlock'});
    fetchFlockables(lastVisibleFlock).then(({ar, lastVisible}) => {
      setLastVisibleFlock(lastVisible);
      setKeyArrFlock([...keyArrFlock, ...ar]);

    });
    // dispatch({type:'sendCarouselFlockIndex', payload: 7});
  }
  }, [select.carIndexFlock]);
  // console.log(store.getState().videopage.carIndex);
  // if (store.getState().videopage.carIndex < 0) {
    // console.log(select.carIndexFlock, 'fasdfasdfasdfasfd', !cover);
  // if (select.carIndexFlock < 1) {
    // console.log('reached the end');
    // dispatch({type:'sendCarouselFlockIndex', payload: 9});
    // fetchFlockables().then((ar) => {
    //   setKeyArrFlock([...keyArrFlock, ...ar]);
    //   // setFinalAr([...ar,...keyArrFlock, ]);
    //   console.log('donneeeee');
    //   setFinalAr([...ar]);
    //   // dispatch({type:'sendCarouselFlockIndex', payload: ar.length-1});
    //   console.log(ar.length);
    //   console.log("finalAr", ar);
    //   console.log('done');
    //   setCover(false);
    //   // setFinishedLoading(true);
    //   Animated.timing(coverFade, {
    //     toValue: 0,
    //     duration: 500,
    //     delay: 1000,
    //     useNativeDriver: false,
    //   }).start();
    //   setTimeout(()=>setCover(false), 2500);

    // });
    // setCover(true);
    // Animated.timing(coverFade, {
    //   toValue: 1,
    //   duration: 200,
    //   delay: 0,
    //   useNativeDriver: false,
    // }).start();
  // }

  var res = [];
  // to be reverted
  // var finalAr = []
  var finalAr = keyArrFlock.slice(Math.max(0,keyArrFlock.length-10), keyArrFlock.length,);
  // console.log("finalAr", finalAr, keyArrFlock.length, select.carIndexFlock);
  for (const item of finalAr) {
    res.push(<View style={{height: '100%', width: '100%', borderWidth: 0, borderOpacity: 0.1,borderBottomWidth: 0,}}>
    {/* <Text>{item?.product?.title || item.flock}</Text> */}
    <NewVideoPage route={route} navigation={navigation} data={item} index={finalAr.indexOf(item)} currIndex={finalAr.indexOf(item)} viewHeight={viewHeight} />
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
  return <>
  <NewTutorial screenId="flocking" >
  <View style={{position: 'absolute', zIndex: 400, top: '40%', alignSelf: 'center',}}
                >
                {/* <Text style={{color:'black'}}>Swipe</Text> */}
                <Image source={require('App/Assets/Images/updown_swipe.png')} style={{height: 150, width: 150, shadowOpacity:0.2, tintColor: 'white', shadowOffset:{height:5, width:0}, shadowRadius:5,}} />
            </View>
  </NewTutorial>
    {/* <Animated.View style={{backgroundColor: 'white', position: 'absolute', left: 0, bottom: 0, width:'100%', height: cover?"100%":0, opacity: coverFade, zIndex: 10000}} ><View style={{
    backgroundColor: constants.PINK_BACKGROUND, height: '100%', width: '100%',
    justifyContent: 'center', alignItems: 'center',
    // resizeMode:'contain'
    overflow:'visible'
}}/>
<Image source={require('App/Assets/Images/flock_gif.gif')} style={{width: 300, height: 300, resizeMode:'contain', alignSelf: 'center', position: 'absolute', top:'20%'}} />
</Animated.View> */}
<View 
style={{flex: 1}}
onLayout = {(event) => {
    // setViewHeight(event.nativeEvent.layout.height);
  }}><FeatherPanResponder navigation={navigation} route={route} data={finalAr} viewHeight={Dimensions.get('window').height - 50- constants.NAVBARHEIGHT-80} type="flock" /></View>
    {keyArrFlock.length == 0?<View style={{flex: 1, backgroundColor: constants.PINK_BACKGROUND, justifyContent: 'center', alignItems: 'center'}}>
      <Text>No flocks currently.</Text>
      <TouchableOpacity style={{padding: 10, backgroundColor: constants.LAVENDER, borderRadius: 20, margin: 10}} onPress={()=>{
        navigation.navigate("for you")
      }}>
        <Text>Find a product to flock...</Text>
      </TouchableOpacity>
      <Text>or</Text>
      <TouchableOpacity style={{padding: 10, backgroundColor: constants.GREYBLUE, borderRadius: 20, margin: 10}} onPress={()=>{
        navigation.navigate("CamScreen", {data:[]})
      }}>
        <Text>Search online</Text>
        </TouchableOpacity>
    </View>
  :<></>}
</>
};

const MiniCarousel = ({navigation, route}) => {

  const dispatch = useDispatch();
  const [viewHeight, setViewHeight] = useState(800);
  const {key, setKey, key1, setKey1, keyArrRent, keyArrFlock, keyVideoData, setKeyVideoData, setKeyFinishedLoading} = useContext(KeyContext);
  // return <View><Text>Hi</Text></View>;
  const [finalAr, setFinalAr] = useState([]);
  var testAr = [];
  useEffect(()=> {
    // setFinalAr(shuffle([...keyArrRent, ...keyArrFlock,...keyVideoData]));
    setFinalAr([...keyArrRent, ...keyArrFlock])
    
  }, [keyArrRent, keyArrFlock, keyVideoData]);

  useEffect(()=>{
    
    // fetchAlbums().then((ar) => {
    //   setKeyVideoData(ar.ar);
    //   dispatch({type:'sendCarouselIndex', payload: ar.length - 1});
    //   setTimeout(()=>{
    //     setKeyFinishedLoading(true);
    //   }, 2000);

    // })
  }, []);



  var res = [];
  for (const item of finalAr) {
    res.push(<View style={{height: '100%', width: '100%', borderWidth: 0, borderOpacity: 0.1,borderBottomWidth: 0, shadowOffset:{height: -10, width: 0}, shadowColor:'black', shadowOpacity: 0.5, shadowRadius: 5, backgroundColor:"#000"}}>
    {/* <Text>{item?.product?.title || item.flock}</Text> */}
    <NewVideoPage route={route} navigation={navigation} data={item} index={finalAr.indexOf(item)} currIndex={finalAr.indexOf(item)} viewHeight={viewHeight} />
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
  return <View onLayout = {(event) => {
    setViewHeight(event.nativeEvent.layout.height);
  }}><FeatherPanResponder navigation={navigation} route={route} data={finalAr} viewHeight={viewHeight} /></View>;

}



const Page = () => {
  return <View>

  </View>
};

const TopBar = ({descriptors, state, navigation}) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  // if (focusedOptions.tabBarVisible === false) {
  //   return null;
  // }
  const totalWidth = Dimensions.get("window").width;
  const tabWidth = totalWidth / state.routes.length;
  const [left, setLeft] = useState(new Animated.Value(0));
  const tabScale = new Animated.Value(1);
  var color = left.interpolate({
    inputRange: [0, tabWidth, tabWidth*2, tabWidth*3],
    outputRange: [constants.PURPLE, constants.ORANGE, constants.RED, constants.GREY]
});

  const tabColors = [["#c09bae", "#ff9966"], ["#6989af", "#c09bae"], ["#c09bae","#e1cbd7"], ['black',"#ffffff"],['black',"#ffffff"],['black',"#ffffff"]];

  return (
    <LinearGradient
    colors={[constants.TRANSLUCENT, 'white']}
    start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
    style={{
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      paddingTop: 10,
      paddingBottom: 20,
      borderBottomRightRadius:20,
      borderBottomLeftRadius: 20,
      //shadowColor: "#ff7009", shadowOffset: {height: 10, width: 0}, shadowOpacity: 0.39, elevation: 13, shadowRadius: 28.30,
      //alignItems: 'center',
    }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        
        
        const isFocused = state.index === index;

        const onPress = () => {

          const slide = Animated.spring(left, {
            toValue: index * tabWidth,
            velocity: 10,
            useNativeDriver: true,
          });
          const shrink = Animated.timing(tabScale, {
            toValue: 0.2,
            duration: 1000,
            useNativeDriver: false,
          });
          const grow = Animated.timing(tabScale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          });
          const shrinkgrow = Animated.sequence([shrink, grow]);
          // Animated.parallel([slide, shrinkgrow]).start();
          slide.start();
          navigation.navigate(route.name);
        }

          return <TouchableOpacity key={route.key} activeOpacity={1} style={{flex: 1,marginLeft: 10, marginRight: 10,
            
          }} onPress={onPress}>
          {/* <LinearGradient 
          colors={[constants.TRANSLUCENT, 'white']}
          style={{width: '100%', height: 50,  
          padding: 10, borderRadius: 30, borderWidth: 1,justifyContent: 'center', alignItems: 'center'}}>
            <Text>{route.name}</Text>
            </LinearGradient> */}
            <View style={{borderRadius: 40, shadowOpacity: isFocused?0:0, shadowRadius: 5, shadowColor: tabColors[index][0], shadowOffset: {height: 5}}}>
            <LinearGradient 
          colors={[isFocused?tabColors[index][0]:'white', isFocused?tabColors[index][1]:'white']}
          style={{width: '100%',   borderRadius: 40,
          }}>
                      <View
          style={{borderWidth: isFocused?0:2, width: '100%', height: 42, borderColor: constants.GREY,
          
          padding: 10, borderRadius: 30, justifyContent: 'center', alignItems: 'center'}}>
            
            <Text style={{color: isFocused?'white':'black'}}>{route.name}</Text>
            
            </View>

            </LinearGradient>
            </View>
            </TouchableOpacity>

      })}
      {/* <Animated.View style={{alignSelf: 'center',height: 25, position: 'absolute',  width: tabWidth - 50,
      borderRadius: 40, zIndex: -10, left: 30, backgroundColor: 'blue',
    transform: [{scale: tabScale },{ translateX: left}, ],
     }} > */}
      {/* <LinearGradient 
          colors={[constants.PURPLE, 'white']}
          style={{width: '100%', height: '100%',   borderRadius: 40,
          }} /> */}
     {/* </Animated.View> */}
    </LinearGradient>
  );
};


export default Home;
