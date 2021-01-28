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
} from 'react-native';
import ResizeableImage from 'App/components/ResizeableImage';
import {constants} from 'App/constants';
import ProgressHeader from 'App/components/ProgressHeader';
import {firebase, db} from 'App/firebase/config';
import { CommonActions } from '@react-navigation/native';
import AnimatedModal from 'App/components/AnimatedModal';
import LinearGradient from 'react-native-linear-gradient';

const CamScreenTwo = ({navigation, route}) => {
  const [modalOpen, setModalOpen] = useState(false);
  route.params.data['hello2'] ='twp';
  const [fade, setFade] = useState(new Animated.Value(1));

 const pinFunc=() => {
  console.log('pinned');
  fetch(
    'https://powerful-everglades-32172.herokuapp.com/find_product/' +
      searchUrl,
  )
    .then((response) => response.json())
    .then((data) => {
      setTitleState(data.title);
      setPriceState(data.price);
      dataUrl = data.url;
      var ar = data.image.split('//');

      setImageState('https://' + ar[ar.length - 1]);
      // setTimeout(() => {
      //   setEnlarge(false);
      // }, 500);
      // Keyboard.dismiss();
      console.log(data);
    });
  setTimeout(() => {
    setModalOpen(false);
  }, 500);
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

  const [foundProduct, setFoundProduct] = useState(true);
  const [titleState, setTitleState] = useState(null);
  const [descState, setDescState] = useState(null);
  const [priceState, setPriceState] = useState(0);
  var dataUrl = "";
  const [enlarge, setEnlarge] = useState(false);
  const animation = useRef(new Animated.Value(90));
  //var searchUrl = '';
  const [imageState, setImageState] = useState(null);
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
                borderRadius: 40,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                }}>
            <ResizeableImage
              defaultSource={require('App/Assets/Images/Blank_Photo_Icon.png')}
              source={
                {uri: imageState}
              }
              horizontalLimit={false}
              limitHorizontal={false}
              hLimit={150}
            />
            </View>
            <View style={{justifyContent: 'flex-start', flex: 1, marginTop: 10,}}>
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
                    setPriceState(parseInt(text.replace(".","").replace("$",""))/100);
                    console.log(parseInt(text.replace(".","").replace("$",""))/100);
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
      style={{flex: 1, backgroundColor: constants.PINK_BACKGROUND}}
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
              url: dataUrl || "",
            };
          }}
          closeFunc={()=>{
            route.params.data.product = {
              price: priceState || "",
              title: titleState || "",
              image: imageState || "",
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
  
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                { name: 'Home' },
              ],
            })
          );
          }}
        />
        
        <View style={{flex: 1, zIndex: -100, backgroundColor: constants.PINK_BACKGROUND}}>
          <View style={{paddingLeft: 20, paddingTop: 10, paddingRight: 20, backgroundColor: 'white'}}>
            
            <TouchableOpacity style={[{padding: 10, backgroundColor: 'white', borderRadius: 50, borderWidth: 1, borderColor: constants.DARKGREY}]} value={""} onPress={()=>{
              setModalOpen(true);
            }}>
              <Text style={{fontFamily: constants.FONT, color: constants.LIGHTGREY}}>
                Search for a product on the internet
              </Text>
            </TouchableOpacity>
          </View>
          {renderForm()}
        </View>
      </View>
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
        onPress={pinFunc}>
          <Text style={{color: 'white'}}>import</Text>
          </TouchableOpacity>
                </View>
                <LinearGradient style={{flex: 1, height: '100%', width: '100%'}} colors={[constants.PINK_BACKGROUND, constants.TRANSLUCENT]}>
                <View style={{flex: 1}}>
                <WebView
                onNavigationStateChange={(webViewState) => {
                  setUrlState(webViewState.url);
                  setSearchUrl(webViewState.url);
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
