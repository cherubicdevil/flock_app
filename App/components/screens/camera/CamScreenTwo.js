import React, {useRef, useState} from 'react';
import {WebView} from 'react-native-webview';

import {
  Button,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  FlatList
} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
const cheerio = require('react-native-cheerio')
import ResizeableImage from 'App/components/ResizeableImage';
import {constants} from 'App/constants';
import ProgressHeader from 'App/components/ProgressHeader';
import {firebase, db} from 'App/firebase/config';
import { CommonActions } from '@react-navigation/native';
import AnimatedModal from 'App/components/AnimatedModal';
import LinearGradient from 'react-native-linear-gradient';
import {pinLocalFunc} from 'App/utils';
import { set } from 'react-native-reanimated';


const jsCode = 'window.ReactNativeWebView.postMessage(document.documentElement.innerHTML)'

const CamScreenTwo = ({navigation, route}) => {
  const [modalOpen, setModalOpen] = useState(false);
  route.params.data['hello2'] ='twp';
  const [fade, setFade] = useState(new Animated.Value(1));
  const [loading, setLoading] = useState(false);
  var urlResult = "";
  const [htmlBody, setHtml] = useState("");


  const [pinned, setPinned] = useState(false);

  const [canNext, setCanNext] = useState(pinned);
  const [searchResultPlaceholder, setSearchResultPlaceholder] = useState("Search for a product on the internet.");


  

  

 const pinFunc=() => {
   urlResult = urlState;
   console.log("urlResult", urlState);
   setLoading(true);
  console.log('pinned');
  fetch(
    'https://powerful-everglades-32172.herokuapp.com/find_product/' +
      searchUrl,
  )
    .then((response) => response.json())
    .then((data) => {
      setTitleState(data.title || "");
      setPriceState((data.price || "").replace("-","").trim());
      dataUrl = data.url;
      var ar = [""];
      if (data?.image) {
        var ar = data.image.split('//');
        setImageState('https://' + ar[ar.length - 1]);
      } else {
      
      }
      

      
      // setTimeout(() => {
      //   setEnlarge(false);
      // }, 500);
      // Keyboard.dismiss();
      console.log(data);
      setTimeout(() => {
        setModalOpen(false);
      }, 500);
      setLoading(false);
    }).catch((err) =>{
      console.log(err);
    });

  Keyboard.dismiss();
};
  const searchFunc = () => {
    var url = '';
    const isURL =
      searchUrl.split(' ').length === 1 &&
      searchUrl.includes('.');
    if (isURL) {
      if (!searchUrl.startsWith('http')) {
        url = 'https://www.' + searchUrl;
      } else {
        url = searchUrl;
      }
    } else {
      url = `https://www.google.com/search?q=${searchUrl}`;
    }
    console.log(url, searchUrl);
    setUrlState(url);
    //setSearchUrl(url);
  };

  const startAnimation = () => {
    Animated.timing(fade, {
      useNativeDriver: false,
      toValue: 1,
      delay: 0,
      duration: 700,
    }).start();
  };

  const resetAnimation = () => {
    Animated.timing(fade, {
      useNativeDriver: false,
      toValue: 0,
      delay: 0,
      duration: 500,
    }).start();
  };

  const [changePicture, openChangePicture] = useState(false);

  const [foundProduct, setFoundProduct] = useState(true);
  const [titleState, setTitleState] = useState(null);
  const [brandState, setBrandState] = useState("");
  const [descState, setDescState] = useState(null);
  const [priceState, setPriceState] = useState(0);
  const [dataUrl, setDataUrl] = useState("");
  const [enlarge, setEnlarge] = useState(false);
  const animation = useRef(new Animated.Value(90));
  //var searchUrl = '';
  const [imageState, setImageState] = useState(null);
  const [imageSet, setImageSet] = useState([]);
  const [searchUrl, setSearchUrl] = useState('');
  const [urlState, setUrlState] = useState('');

  const renderForm = () => {
    //console.log('foundProduct:', foundProduct);
    if (!enlarge && foundProduct) {
      return (
        <View
          style={{
            backgroundColor: 'white',
            width: '100%',
            paddingLeft: 20,
            paddingRight: 20,
            zIndex: 100,
            paddingTop: 10,
            paddingBottom: 10,
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
          }}>

            <View style={{flexDirection: 'row'}}>
              <View style={{alignSelf: 'flex-start',
                // width: 150,
                // height: 150,
                resizeMode: 'contain',
                marginRight: 15,
                marginVertical: 10,
                overflow: 'hidden',
                borderWidth: 0,
                paddingBottom: 5,
                // borderRadius: 40,
                // borderTopLeftRadius: 0,
                // borderTopRightRadius: 0,
                }}>
                  
              <View style={{width: 150, height: 150, alignItems: 'center', resizeMode: 'contain'}}>
                <View style={{borderWidth:2, borderColor: constants.DARKGREY,borderRadius:30,overflow: 'hidden', }}>
            <ResizeableImage
              defaultSource={require('App/Assets/Images/Blank_Photo_Icon.png')}
              source={
                {uri: imageState}
              }
              horizontalLimit={false}
              limitHorizontal={false}
              hLimit={150}
              // wLimit={150}
            />
            {/* <Text>Click to change product picture</Text> */}
            
            </View>
            </View>
            
            <TouchableOpacity onPress={()=>{
                    if (pinned) {

                    openChangePicture(true);
                    }
                  }}>
            <View style={{height: 30, marginTop: 7, width: '100%', alignSelf:'center', backgroundColor:constants.PINK_BACKGROUND, borderRadius:40, paddingVertical:7}}>
              <Text style={{color: constants.LAVENDER, textAlign:'center'}}>Change</Text>
            </View>
            </TouchableOpacity>
            </View>
            <View style={{justifyContent: 'flex-start', flex: 1, marginTop: 5,}}>
            <View style={{marginBottom: 10}}>
              <Text style={{marginLeft: 15, color: constants.DARKGREY}}>Title</Text>
              <TextInput
                placeholder="Describe the product"
                style={styles.descriptionStyle}
                placeholderTextColor={constants.DARKGREY}
                onChangeText={(text) => {
                  setTitleState(text);
                }}
                value={titleState}
              />
            </View>

            <View style={{marginBottom: 5}}>
              <Text style={{marginLeft: 15, color: constants.DARKGREY}}>Brand</Text>
              <TextInput
                // placeholder="Describe the product"
                style={styles.descriptionStyle}
                placeholderTextColor={constants.DARKGREY}
                onChangeText={(text) => {
                  setBrandState(text);
                }}
                value={brandState}
              />
            </View>
            {/* <View style={{marginTop: 5, marginBottom: 10}}>
              <Text>Description</Text>
              <TextInput
              numberOfLines={3}
              multiline
              style={[styles.descriptionStyle, {height: 50, paddingLeft: 15}]}
                placeholder="Tell flockers what's so special"
                onChangeText={(text) => {
                  setDescState(text);
                }}
                placeholderTextColor={constants.DARKGREY}
                value={descState}
              />
            </View> */}
            <View style={{marginTop: 5, paddingRight: 10}}>
              <Text style={{marginLeft: 15, color:constants.DARKGREY}}>Price</Text>
              <View style={[styles.descriptionStyle, {flexDirection: 'row', width: 100, alignItems: 'center'}]}>
                <Text>$</Text>
              <TextInput
              keyboardType="numeric"
                placeholder="0.00"
                onChangeText={(text) => {
                  if (text === "") {
                    setPriceState("");
                } else {
                    setPriceState(parseInt(text.replace(".","").replace("$","").replace(/\D/g,''))/100);
                    // console.log(parseInt(text.replace(".","").replace("$",""))/100);
                }
                }}
                placeholderTextColor={constants.DARKGREY}
                value={(typeof priceState)==="string"?priceState:priceState.toFixed(2)}
              />
              </View>
            </View>
          </View>
            </View>
            {/* <View style={{flex: 2}}>
              <View
                style={{
                  //backgroundColor: 'black',

                  flex: 1,
                  flexDirection: 'row',
                }}>
                <Image
                  style={{
                    flex: 1,
                    margin: 10,
                    width: '100%',
                    height: null,
                    resizeMode: 'contain',
                  }}
                  source={require('App/Assets/Images/Blank_Photo_Icon.png')}
                />
                <Image
                  style={{
                    flex: 1,
                    width: '80%',
                    height: null,
                    resizeMode: 'contain',
                  }}
                  source={require('App/Assets/Images/Blank_Photo_Icon.png')}
                />
              </View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Image
                  style={{
                    margin: 10,
                    flex: 1,
                    width: '100%',
                    height: null,
                    resizeMode: 'contain',
                  }}
                  source={require('App/Assets/Images/Blank_Photo_Icon.png')}
                />
                <Image
                  style={{
                    flex: 1,
                    width: '100%',
                    height: null,
                    resizeMode: 'contain',
                  }}
                  source={require('App/Assets/Images/Blank_Photo_Icon.png')}
                />
              </View>
            </View> */}
          
        </View>
      );
    } else {
      return <View />;
    }
  };

  
  return (
    <>
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: constants.PINK_BACKGROUND_OPAQUE}}
      behavior="padding"
      keyboardVerticalOffset={100}>
        
      <View behavior="height" keyboardVerticalOffset={0} style={{flex: 1}}>
        <View
          style={{
            height: enlarge ? 1000 : 0,
            width: enlarge ? 1000 : 0,
            backgroundColor: 'black',
            opacity: 0.6,
            position: 'absolute',
            zIndex: 300,
          }}>
          <TouchableOpacity
            style={{height: '100%', width: '100%'}}
            onPress={() => {
              setEnlarge(false);
              resetAnimation();
              Keyboard.dismiss();
            }}
          />
        </View>

        <ProgressHeader
        closeText="done"
          headerText="Find a Product"
          goBack={true}
          nextRoute="Product Options"
          canGoNext={canNext}
          number={1}
          index={0}
          backRoute="Add Video"
          navigation={navigation}
          data={route.params.data}
          nextFunc={()=>{
            route.params.data.product = {
              price: priceState || "",
              title: titleState || "",
              image: imageState || "",
              brand: brandState || "",
              url: dataUrl || "",
            };
          }}
          closeFunc={()=>{
            route.params.data.product = {
              price: priceState || "",
              title: titleState || "",
              image: imageState || "",
              brand: brandState || "",
              url: dataUrl || "",
            };
            console.log('closing');
            console.log(route.params.data);
            db.collection("posts").add(route.params.data)
          .then(function(docRef) {
              console.log("Document written with ID: ", docRef.id);
          })
          .catch(function(error) {
              console.error("Error adding document: ", error);
          });
  
          // navigation.dispatch(
          //   CommonActions.reset({
          //     index: 0,
          //     routes: [
          //       { name: 'Home' },
          //     ],
          //   })
          // );
          navigation.navigate("Product", {album: route.params.data.product, data: route.params.data, id: route.params.data.id, tutorial: true});
          }}
        />
        
        <ScrollView scrollEnabled={false} style={{flex: 1, zIndex: -100, backgroundColor: constants.PINK_BACKGROUND_OPAQUE}}>
          <View style={{paddingLeft: 20, paddingTop: 10, paddingRight: 20, backgroundColor: 'white'}}>
            
            <TouchableOpacity style={[{padding: 10, backgroundColor: 'white', borderRadius: 50, borderWidth: 1, borderColor: constants.DARKGREY}]} value={""} onPress={()=>{
              setModalOpen(true);
            }}>
              <Text style={{fontFamily: constants.FONT, color: constants.LIGHTGREY}}>
                {searchResultPlaceholder}
              </Text>
            </TouchableOpacity>
          </View>
          {renderForm()}
          <Text style={{color: constants.LAVENDER, textAlign: 'center', marginTop: 25, width: 200, alignSelf: 'center'}}>Please make sure the above information is accurate.</Text>
        </ScrollView>

      </View>
      <View style={{position: 'absolute', zIndex: 10000, height:loading?50:0, width: loading?50:0, backgroundColor: 'black'}} />
    </KeyboardAvoidingView>
    <AnimatedModal colored = {true} colors={['#ff7009', '#ff9966']} behind={false} upPercent={"90%"} visible={modalOpen} close={()=>setModalOpen(false)} content={
      
    <View style={{height:"100%"}}>
      <View style={{alignItems: 'center', width: '100%', height: 50, flexDirection: 'row'}}>

        <TouchableOpacity 
        style={{marginRight: 10, marginLeft: 10, paddingLeft: 15, paddingRight: 15, height: 40, justifyContent:'center', alignItems:'center', backgroundColor: "#d8d8d8", borderRadius: 50,}}
        onPress={()=> {
          Keyboard.dismiss();
          setModalOpen(false);
        }}>
          <Text style={{color: 'black'}}>close</Text>
          </TouchableOpacity>
      <TextInput
      onSubmitEditing={searchFunc}
                  placeholder="Enter link or search by keyword"
                  selectTextOnFocus
                  value={searchUrl}
                  onChangeText={(text) => {
                    //searchUrl = text;
                    setSearchUrl(text);
                  }}
                  style={
                    styles.textBoxStyle}
                  // onFocus={() => {
                  //   console.log('focusing');
                  //   setEnlarge(true);
                  //   startAnimation();
                  // }}
      />
              <TouchableOpacity 
        style={{marginRight: 10, marginLeft: 10, paddingLeft: 15, paddingRight: 15, height: 40, justifyContent:'center', alignItems:'center', backgroundColor:constants.ORANGE, borderRadius: 50,}}
        onPress={()=>{
          const result = pinLocalFunc(htmlBody, urlState);
          setImageState(result.image);
          setImageSet(result.imageSet);
          console.log(result.imageSet);
          setTitleState(result.title);
          setPriceState(result.price.replace(',','').replace('$','').replace(/[^0-9.]+/, '').split("$")[0]);
          // console.log(result.price.replace(',','').replace('$','').replace(/[^0-9.]+/, ''), result.price);
          setBrandState(result.brand.charAt(0).toUpperCase() + result.brand.slice(1));
          setDataUrl(urlState);
          setModalOpen(false);
          setPinned(true);
          setCanNext(true);
          
          setSearchResultPlaceholder(result.brand.charAt(0).toUpperCase() + result.brand.slice(1) + " | " + result.title);
          }}>
          <Text style={{color: 'white'}}>import</Text>
          </TouchableOpacity>
                </View>
                <LinearGradient style={{flex: 1, height: '100%', width: '100%'}} colors={[constants.PINK_BACKGROUND_OPAQUE, constants.TRANSLUCENT]}>
                <View style={{flex: 1}}>
                <WebView
                injectedJavaScript={jsCode}
                onMessage={event => {
                  setHtml(event.nativeEvent.data);
                  // console.log('Received: ', event.nativeEvent.data)
                  // const $ = cheerio.load(event.nativeEvent.data);
                  // const result = $("title").text();
                  // console.log(result);
                  // pinLocalFunc(event.nativeEvent.data);
              }}
                onNavigationStateChange={(webViewState) => {
                  setUrlState(webViewState.url);
                  setSearchUrl(webViewState.url);
                  console.log(webViewState);
                  
                }}
                style={{
                  backgroundColor: enlarge ? 'white' : 'transparent',
                }}
                source={{uri: urlState}}
              />
                </View>
                </LinearGradient>
    </View>

    } />

    <AnimatedModal visible={changePicture} close={()=>{openChangePicture(false)}}>
      <View style={{flex:1,}}>
      <FlatList key={12334} style={{alignSelf: 'center'}} data = {imageSet} numColumns={4} renderItem={(item)=>{
        if (item.item.startsWith("//")) {
          item.item = "https:" +item.item;
        }
        // return <Image source={{uri: item}} style={{height:200, aspectRatio:1, borderRadius: 40}} />
        return <TouchableOpacity onPress={()=>{
          setImageState(item.item);
          openChangePicture(false);
        }}><View style={{flex:1, height: 100,alignItems: 'center', resizeMode:'cover'}}>
          <Image source={{uri: item.item}} style={{flex: 1, aspectRatio:1, borderRadius: 40}} />
          {/* <Text>{item.item}</Text> */}
        </View>
        </TouchableOpacity>
      }} />
      
      </View>
    </AnimatedModal>
    </>
  );
};

const styles = StyleSheet.create({
  topInnerBox: {
    width: '100%',
    backgroundColor: 'white',
  },

  textBoxStyle: {
    fontFamily: 'Nunito-Light',
    flex: 10,
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    width: '50%',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: constants.DARKGREY,
  },
  descriptionStyle: {padding: 5, paddingLeft: 15, borderRadius: 30, borderWidth: 1, borderColor: constants.DARKGREY,},
});

export default CamScreenTwo;
