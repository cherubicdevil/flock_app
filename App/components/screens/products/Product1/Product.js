import React, {Component, useState, useEffect, useRef} from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  SafeAreaView,
  Button,
  Linking,
  Dimensions,
  Animated
} from 'react-native';
import CommentsModal from 'App/components/screens/videopage/CommentsModal';
import { CommonActions } from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import {firebase, au, db} from 'App/firebase/config';
import {WebView} from 'react-native-webview';
import {constants} from 'App/constants';
import LinearGradient from 'react-native-linear-gradient';
//import Flockit from './Flockit';
import PropTypes from 'prop-types';
import Video from 'react-native-video';
import productData from './product.json';

import PhotoButton from './PhotoButton';
import ProductStyles from './ProductStyle';
import ModalSelector from 'react-native-modal-selector';
import Icon from 'react-native-vector-icons/FontAwesome';
import ResizeableImage from 'App/components/ResizeableImage';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import HelpDialog from 'App/components/HelpDialog';
import AnimatedModal from 'App/components/AnimatedModal';

const styles = StyleSheet.create({...ProductStyles});

let index = 0;
let useFlockPrice = false;
let flockPrice = 0;
const data = [
  {
    key: index++,
    section: true,
    label:
      'HOW IT WORKS \n\n You choose the desired discount amount. We present your request to the retailer along with requests of other FLOCKERS when the countdown ends. \n\n If the retailer accepts the request, we’ll charge your credit card and submit the order. Your credit card will NOT be charged unless we can get this for you.',
  },
  {key: index++, label: '-0%'},
  {key: index++, label: '-10%'},
  {key: index++, label: '-20%'},
  {key: index++, label: '-30%'},
  {key: index++, label: '-40%'},
];

const Flockit = () => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <View style={{flex: 1, height: '100%', zIndex: 10}}>
      <ModalSelector
        data={data}
        initValue="FLOCK IT"
        initValueTextStyle={{
          height: '100%',
          fontSize: 24,
          paddingTop: 7,
          color: '#fff',
        }}
        selectTextStyle={{
          height: '100%',
          fontSize: 24,
          paddingTop: 7,
          color: '#fff',
        }}
        onChange={(option) => {
          if (option.key == 1) {
            useFlockPrice = false;
            flockPrice = 0;
          } else {
            flockPrice = option.label.substring(1, 3);
          }
          console.log('FLOCCKCKKC', flockPrice);
        }}
      />
    </View>
  );
};

const Product = ({route, navigation}) => {
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [tutorialScreen, setTutorialScreen] = useState(route.params.tutorial);
  const arrowMargin = new Animated.Value(0);
  const [flockAr, setFlockAr] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(()=>{

    var citiesRef = firebase.firestore().collection("chatGroups");
    // console.log(route.parm.title);
    // Create a query against the collection.
    var query = citiesRef.where("productTitle", "==", route.params.album.title);
    var unsubscribe = query
    .onSnapshot(function(querySnapshot) {
      const arr = [];
      querySnapshot.forEach(function(doc) {
        console.log("FOUNDDDDDD");
        if (doc.data().completed === false  && doc.data().time >= Date.now()/1000 - 60*60*24*7) {
        arr.push({...doc.data(), id:doc.id});

          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
        }
      });
      setFlockAr(arr);
    });
    // query.get()
    // .then(function(querySnapshot) {
    //   const arr = [];
    //     querySnapshot.forEach(function(doc) {
    //       console.log("FOUNDDDDDD");
    //       arr.push(doc.data());
    //         // doc.data() is never undefined for query doc snapshots
    //         console.log(doc.id, " => ", doc.data());
    //     });
    //     setAr(arr);
    // })

    return () => {unsubscribe()};
  }, [route.params.album]);
  useFocusEffect(()=>{
    // const animateArrow = Animated.spring(arrowMargin, {
    //   velocity: 5,
    //   useNativeDriver: false,
    //   toValue: 20,
    // });
    // const animateArrowUp = Animated.spring(arrowMargin, {
    //   velocity: 5,
    //   useNativeDriver: false,
    //   toValue: 20,
    // })

    // var interval = setInterval(()=>{
    //   Animated.sequence([animateArrow, animateArrowUp]).start();
    // }, 2000);
    return () => {
      // clearInterval(interval);
      // setTutorialScreen(false);
    };
  },[]);

  const renderDetail = () => {
    return (
      
      <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between'}} onPress={() => {
        Linking.openURL(
          'https://shopwithflock.com/redirect/?url=' +
            route.params.album.url,
        );
      }}>
        <Text style={{fontFamily: constants.FONTBOLD, fontSize: 14, color: 'black'}}>
          Product information, description, and details
        </Text>
        <Icon name="chevron-right" color = {constants.LIGHTGREY} size={25} />
      </TouchableOpacity>
    );
  };

  const renderDescription = () => {
    return (
      <View>
        <Text style={{fontSize: 14, marginBottom: 5,}}>
        <Text style={{fontWeight: 'bold'}}>{route.params.album.brand?route.params.album.brand+" ":""}</Text>{route.params.album.title}
        </Text>
        <View style={{flexDirection:'row', alignItems: 'center'}}>
        <Text style={{textDecorationLine: 'line-through', fontFamily: constants.FONTBOLD, color: constants.ORANGE, fontSize: 16}}>
          ${route.params.album.price}
        </Text>
        {/*<Text style={styles.descriptionText}>50 flockers have bought</Text>*/}
        {/*<Text style={styles.descriptionText}>Recommended by username</Text>*/}
        <LinearGradient
          colors={[constants.YELLOW, constants.ORANGE]}
          start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
          style={{
            marginLeft: 10, 
            borderRadius: 30,
            zIndex: 40,
          }}><TouchableOpacity style={{borderRadius: 30, color: 'white', justifyContent: 'center', alignItems:'center', paddingBottom: 5, paddingTop: 3,paddingLeft: 10, paddingRight: 10}}><Text style={{color: 'white', fontSize: 14, fontFamily: constants.FONTBOLD}}>{"$" + Math.round(parseFloat(route.params.album.price) / 25 * 1.4) + " when you flock"}</Text></TouchableOpacity>
</LinearGradient>
      <View style={{position: 'absolute', right: 0}}>
        <HelpDialog text="Incorrect or missing title, description, or product picture? Notify us below." context={{uid: au.currentUser.uid, name: au.currentUser.displayName, productName: route.params.album.title, productId: route.params.album.id}} />
          </View>
        </View>
        
      </View>
    );
  };

   const renderNavigator = () => {
    return (
      <View style={{flexDirection: 'column'}}>
        <TouchableOpacity style={[styles.navigatorButton, {flex: 2}]}>
          <Text style={styles.navigatorText}>SIZE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navigatorButton, {flex: 2}]}>
          <Text style={styles.navigatorText}>COLOR</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContactHeader = () => {
    // console.log(this.props.route.params.album.image);
    // console.log("PRODUCt", this.props.route.params.album)


    return (
      <View style={styles.headerContainer}>

        <View style={styles.coverContainer}>
          <View style={styles.coverImage}>

            <View style={{resizeMode: 'cover'}}>
            <Image
              style={{
                width: '100%',
                resizeMode: 'cover',
                aspectRatio: 1,
                height: '100%',
                //height: 200,
                alignSelf: 'center',
              }}
              source={{uri: route.params.album.image}}
            />
            </View>
            <Video
          repeat={true}
          muted={true}
          source={{
            uri: route.params.video?.video || "",
          }}
          style={{
            height: 150,
            width: 150,
            position: 'absolute',
            bottom: -33,
            right: -15,
          }}
        />
          </View>
        </View>
      </View>
    );
  };

  const renderBackOrClose = () => {
    if (!route.params.tutorial) { //  means its from startflock
      return <TouchableOpacity style={{resizeMode: 'cover', zIndex: 50, height: 30, width: 50,position: 'absolute', top: 40, left: 30}} onPress={navigation.goBack}><Icon color={constants.LIGHTGREY} name="chevron-left" style={{width: 35, height: 35, tintColor: constants.LIGHTGREY}} size={35} /></TouchableOpacity>
    } else {
      return <TouchableOpacity style={{resizeMode: 'cover', zIndex: 50, height: 30, width: 50,position: 'absolute', top: 40, left: 30}} onPress={()=>{
                  navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'Carousel' },
          ],
        })
                  );
      }}><Icon name="times" size={35} color={constants.LIGHTGREY} /></TouchableOpacity>
    }
  }
  console.log("URLSSSS:", route.params.album.url);
  const randomId = (Math.random()*10000).toFixed(0);
  console.log(randomId);
    return (
      <View style={{flex: 1, backgroundColor: constants.PINK_BACKGROUND}}>
                            {renderBackOrClose()}
      <ScrollView pagingEnabled={true} showsVerticalScrollIndicator style={styles.mainViewStyle}>
        {/* <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(40,60,81, 0.4)']}
          style={{
            width: '100%',
            zIndex: 40,
            position: 'absolute',
            bottom: 0,
            height: '30%',
            width: '100%',
          }}> */}
        {/* <Image
            style={{
              height: '100%',
              width: '100%',
              //tintColor: 'rgb(180,44,81)',
              tintColor: constants.RED,
              resizeMode: 'repeat',
              zIndex: 50,
            }}
            source={require('App/Assets/Images/gray-floral.png')}
          /> */}
        {/* </LinearGradient> */}

        <View style={styles.scroll}>
              {renderContactHeader()}
          <View
            style={{
              flex: 1,
              height: '100%',
              //borderWidth: 1,
              //borderColor: 'rgba(0,0,0,0.2)',
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
              overflow: 'hidden',
              //backgroundColor: 'white',
            }}>
            
            <View style={styles.productRow}>{renderDescription()}</View>
            <View style={[styles.productRow, {backgroundColor: 'white'}]}>
            <Text style={{fontWeight: 'bold'}}>{flockAr.reduce((total, item)=>total + item.members.length, 0)} people are currently flocking.</Text>
            <TouchableOpacity onPress={()=>{
              setModalOpen(true);
            }}>
            <FlockList close = {()=>{setModalOpen(false)}}navigation = {navigation} product = {route.params.album} ar = {flockAr} randomId={randomId} />
            </TouchableOpacity>
            </View>
            <View style={styles.productRow}>{renderDetail()}</View>
          </View>
          {/* <View style={styles.productRow}>{this.renderNavigator()}</View> */}
          {/*   <View style={styles.productRow}>{this.renderDetail()}</View> */}

        
        </View>
        
        {/* <View style={styles.cluckfooter}>
          <TouchableOpacity style={styles.buttonCluck}>
            <Image
              style={styles.circleProfile}
              source={require('App/Assets/Images/ProfilePic.png')}
            />
            <Text style={styles.textFooter}>Cluck</Text>
          </TouchableOpacity>
        </View> */}
      
      <View style={{fontFamily: constants.FONT, paddingLeft: 10, paddingRight: 15}}>
      <Text style={{alignSelf: 'center', marginTop: 20, fontSize: 16}}>How Flock Works</Text>
      <Text style={{fontFamily: constants.FONT, marginTop: 10}}>Step 1: Drooling over an item but sobbing at the price? Add it onto our app!</Text>
      <Text style={{fontFamily: constants.FONT, marginTop: 10}}>Step 2: You can split the cost with other flockers who also want it. </Text>
      <Text style={{fontFamily: constants.FONT, marginTop: 10}}>Step 3: You co-own the item and store it with us. We’ll take care of the cleaning too.</Text>
      <Text style={{fontFamily: constants.FONT, marginTop: 10}}>Step 4: Whenever you want, we’ll send it to you. </Text>
      <Text style={{fontFamily: constants.FONT, marginTop: 10}}>Anything you want at a fraction of the cost, that is the magic of Flock!</Text>
      </View>
      </ScrollView>
      
      <TouchableOpacity style = {{position: 'absolute',bottom: 0,}} onPress={()=>{
        setTutorialScreen(false);
      }}>
      <View style={{backgroundColor: "rgba(0,0,0,0.5)", height: tutorialScreen?Dimensions.get('window').height:0, width: tutorialScreen?Dimensions.get('window').width:0}} >
        <View style={{position: 'absolute', bottom: 100, right: 130,resizeMode: 'contain', }}>
        {/* <Icon name="arrow-down" size={30} color={'white'}  /> */}
        <Image source = {require('App/Assets/Images/handarrow.png')}  style={{tintColor: 'white', width: 100, height: 105}} />
        {/* <TouchableWithoutFeedback style={{width: '100%', height: '100%',}} onPress={()=> {
          setTutorialScreen(false);
        }} /> */}
        </View>
      </View>
      </TouchableOpacity>
                <View style={{flexDirection: 'row', height: 40, marginBottom: 30, marginRight: 10, marginLeft:20, justifyContent: 'space-between', alignItems: 'center', }}>

            
                <TouchableOpacity style={{shadowOpacity: 0.3, shadowColor: '#555', shadowOffset: {height: 2, width: 0},}} onPress={()=>{
                  setCommentsVisible(true);
                }}>
                <Image
              style={{height: 30, width: 30, aspectRatio: 1, marginTop: 3}}
              source={require('App/Assets/Images/Comment_Icon_White.png')}
            />
              </TouchableOpacity>
                
                <View style={{justifyContent: 'center', alignItems: 'center', shadowOpacity: 0.3, shadowColor: '#555', shadowOffset: {height: 2, width: 0},}}><Image source = {require('App/Assets/Images/heart.png')} style={{width: 25, height: 25,  shadowOpacity: 0.2, shadowOffset: {height:1 , width: 0}}} />
                <Text style={{position: 'absolute', top: 5,fontSize: 12}}>{route.params.data.likes}</Text>
                </View>
                <TouchableOpacity  onPress={()=>{
                  navigation.navigate('ShareSocial', {product:route.params.album, data:{}, flockId: route.params.id})
                }}>
                <Image 
                style={{shadowOpacity: 0.3, shadowOffset:{height:2, width:0},  width: 30, height: 30, aspectRatio:1}}
                source={require('App/Assets/Images/Share_Icon_White_Earn.png') } />
              </TouchableOpacity>
              
              <View style={{shadowOpacity: 1, shadowColor: '#555', shadowOffset: {height: 2, width: 0}, borderRadius: 30, overflow: 'hidden', flex: 0.8, flexDirection: 'row', backgroundColor: constants.ORANGE, height: 50, alignItems: 'center', marginRight: 10,}}>
              {flockAr.length > 0?<LinearGradient
              colors={[constants.YELLOW, constants.LIGHTORANGE]}
              start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
              style={{
                flexDirection: 'row',
                borderBottomLeftRadius: 30,
                borderTopLeftRadius: 30,
                height: '100%',
                flex: 1,
              }}>
                <View style={{flex: 1, height: '100%', justifyContent:'center'}}>
                  <TouchableOpacity onPress={()=>{
            //         Linking.openURL(
            //   'https://shopwithflock.com/redirect/?url=' +
            //     route.params.album.url,
            // );
                    setModalOpen(true);
            } }><Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold',  fontSize: 13}}>Join a Flock</Text></TouchableOpacity>
                </View>
              </LinearGradient>:<></>}
              <LinearGradient
              colors={['#ff8000', '#ff4d00']}
              start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
              style={{
                flexDirection: 'row',
                borderBottomRightRadius: 30,
                borderTopRightRadius: 30,
                height: '100%',
                flex: 1,
              }}>
              <View style={{flex:1, height: '100%', justifyContent: 'center'}}>
                <TouchableOpacity style={{height: "100%", justifyContent: 'center'}} onPress= {() => {

                  navigation.navigate('StartFlock', {index: 0, product: route.params.album, data:{}, flockId: randomId});
    
                }}
    
                  >
                    <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 13}}>Start Your Flock</Text>
                </TouchableOpacity>
                </View>
                </LinearGradient>
                </View>
                </View>
                <AnimatedModal visible={modalOpen} close={()=>{setModalOpen(false)}} content={<View style={{paddingLeft: 20, paddingRight: 20}}><FlockList close = {()=>{setModalOpen(false)}} limited = {false} navigation={navigation} product = {route.params.album} ar={flockAr} /></View>} />
                <CommentsModal data={route.params.data} toggleFunc={() => {
            setCommentsVisible(false);
          }}
          modalVisible={commentsVisible}
          />
                </View>
    );
  }




const Countdown = ({dateObj}) => {
  const [now, setNow] = useState(Math.round(Date.now()/1000));
  var diff = dateObj - now + 3600*24*7;
  useFocusEffect(()=> {
   var interval = setInterval(()=> setNow(Math.round(Date.now()/1000)), 1000);

   return ()=>{
     clearInterval(interval);
   }
  }, []);

  const days = Math.round(diff / (3600*24));
  var remainder = diff % (3600*24);
  const hours = Math.floor(remainder / 3600);
  remainder %= (3600);
  const minutes = Math.floor(remainder / 60);
  remainder %= 60;
  const seconds = Math.floor(remainder);

  return <><View style={{flexDirection: 'row', justifyContent:'space-between'}}><View style={{ flex: 1, alignSelf: 'stretch' }}><Text style={{textAlign:'center'}}>{days<10?0:''}{days}</Text></View><Text>:</Text><View style={{ flex: 1, alignSelf: 'stretch' }}><Text style={{textAlign: 'center'}}>{hours<10?0:''}{hours}</Text></View><Text>:</Text><Text style={{ flex: 1, alignSelf: 'stretch', textAlign: 'center' }}>{minutes<10?0:''}{minutes}</Text><Text>:</Text><Text style={{ flex: 1, alignSelf: 'stretch', textAlign: 'center'}}>{seconds<10?0:''}{seconds}</Text></View>
  <View style={{flexDirection: 'row', justifyContent:'space-between', fontSize: 10}}><Text style={{fontSize:10, alignSelf: 'stretch'}}>days</Text><Text style={{fontSize:10, alignSelf: 'stretch'}}>hrs</Text><Text style={{fontSize:10, alignSelf: 'stretch'}}>min</Text><Text style={{fontSize:10, alignSelf: 'stretch'}}>left</Text></View></>
}

const FlockList = ({product, navigation, ar, close, limited = true, randomId}) => {
  const scrollRef = useRef();
  var offset = 0;

  const callback = ()=>{
      offset+=50;
      if (offset/50 + 1> ar.length) {
        console.log(offset/50, ar.length);
          scrollRef.current.scrollTo({y:0});
          offset = 0;
      } else {
      scrollRef.current.scrollTo({y:offset});
      //console.log('scrolling', offset);
      }
  };
  useFocusEffect(()=>{
    var interval;
      if (data !== null && data.length > 2) {
      interval = setInterval(callback, 3500);
      }
      return ()=>{
        if (interval) {
          clearInterval(interval);
        }
      }
  },[])

  // const [ar, setAr] = useState([]);
  // useEffect(()=>{

  //   var citiesRef = firebase.firestore().collection("chatGroups");
  //   console.log(product.title);
  //   // Create a query against the collection.
  //   var query = citiesRef.where("productTitle", "==", product.title);
  //   var unsubscribe = query
  //   .onSnapshot(function(querySnapshot) {
  //     const arr = [];
  //     querySnapshot.forEach(function(doc) {
  //       console.log("FOUNDDDDDD");
  //       if (doc.data().completed === false) {
  //       arr.push({...doc.data(), id:doc.id});

  //         // doc.data() is never undefined for query doc snapshots
  //         console.log(doc.id, " => ", doc.data());
  //       }
  //     });
  //     setAr(arr);
  //   });
  //   // query.get()
  //   // .then(function(querySnapshot) {
  //   //   const arr = [];
  //   //     querySnapshot.forEach(function(doc) {
  //   //       console.log("FOUNDDDDDD");
  //   //       arr.push(doc.data());
  //   //         // doc.data() is never undefined for query doc snapshots
  //   //         console.log(doc.id, " => ", doc.data());
  //   //     });
  //   //     setAr(arr);
  //   // })

  //   return () => {unsubscribe()};
  // }, [product]);
  const result = [];
  for (i = 0; i < Math.min(ar.length); i++) {
    console.log("index", i);
    const dat = ar[i];
    const tempFunc = ()=>{
      console.log("check array", ar);
      //console.log(ar.length, ar[0]);
      
      console.log(i);
      console.log("SENDING DATA", dat);
      navigation.navigate("ChatInterface", {data: dat});
      console.log('going');
      close();
    };
    // console.log(result.length);
    var leftover = parseFloat(ar[i].product.price);
    var paidFor = 0;
    var obj = ar[i].maximums;
    // console.log(typeof ar[i].maximums);
    if (typeof ar[i].maximums==="object") {
      var obj = Object.entries(ar[i].maximums);
      for (const item of obj) {
        paidFor += parseFloat(item[1]);
      }

    } else {
    for (const item of obj) {
      // console.log(leftover, item);
      // leftover -= parseFloat(value[0]);
      const resuPrice = parseFloat(Object.entries(item)[0][1]);
      paidFor += resuPrice;
    }
  }
    paidFor = paidFor.toFixed(2);
    var paidForPercent = Math.round(100 * paidFor/ar[i].product.price);
    result.push(  
      <View style={{flexDirection: 'row', height: 50, justifyContent: 'space-between', paddingTop: 10, borderTopWidth:i==0?0:2, borderColor: constants.GREY, paddingBottom:3}}>
      <View style={{flex: 1}}>
    <Text numberOfLines = {1} style={{fontWeight: 'bold', fontSize:15,width: 80, height: 20, }}>@{ar[i].members[0].name}</Text>
      {ar[i].members.length>1?<Text>and {ar[i].members.length-1} others</Text>:<></>}
      </View>
      <View style={{flex: 1.75, flexDirection:'row', justifyContent: 'space-between'}}>
      <View style={{flex:1, marginRight: 15}}>
      <Countdown dateObj = {ar[i].time} />
      </View>
      <View style={{borderRadius: 30, justifyContent:'center', overflow: 'hidden',  borderColor: constants.ORANGE, borderWidth: 2}}>
      <View style={{position: 'absolute', left: "-40%", width: paidForPercent+ 40 + "%", height: '100%', backgroundColor: constants.ORANGE, opacity: 0.8, borderRadius: 40, transform: [{ scaleX: 1 }, { scaleY: 1.3 }] }} />
      <TouchableOpacity style={{paddingLeft: 10, paddingRight: 10,}}
      onPress={()=>{
        console.log('going')
        tempFunc();}}>
        
      <Text style={{color: 'black', fontFamily: constants.FONT, fontWeight: 'bold', fontSize: 13}}>${(ar[i].product.price - paidFor).toFixed(2)} to go</Text>
      </TouchableOpacity>
      </View>
      </View>
      </View>
    );
  }
  return <ScrollView decelerationRate={0.5} ref={scrollRef} pagingEnabled={limited} showsVerticalScrollIndicator={false} style={{padding:0, paddingBottom: 10, height: limited?100:'100%'}}>
  {result.length > 0?<>{result}<View style={{height: 50}} /></>:(<View style={{height: 60}}>
    <View style={{borderTopWidth: 1, borderColor: constants.PINK_BACKGROUND_OPAQUE, paddingTop: 15, paddingLeft:20, marginTop: 10, alignItems: 'center', flexDirection: 'row'}}>
    <Text>No current flocks.</Text>
    <View
          style={{
            flexDirection: 'row',
            backgroundColor: constants.ORANGE,
            height: '100%',
            height: 30,
            width: 30,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 20,
            marginLeft: 60,
            alignSelf: 'center',
            borderRadius: 40,
            flex: 1,
          }}>
  <TouchableOpacity onPress= {() => {
    navigation.navigate('StartFlock', {index: 0, product: product, flockId: randomId});

  }}><Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 13}}>Start Your Flock</Text>
  </TouchableOpacity></View></View></View>)}</ScrollView>;



}



export default Product;
