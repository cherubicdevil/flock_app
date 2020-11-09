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
import {constants} from 'App/constants';
import ProgressHeader from 'App/components/ProgressHeader';

const CamScreenTwo = ({navigation}) => {
  const [foundProduct, setFoundProduct] = useState(true);
  const [titleState, setTitleState] = useState(null);
  const [descState, setDescState] = useState(null);
  const [priceState, setPriceState] = useState(null);
  const [enlarge, setEnlarge] = useState(false);
  const animation = useRef(new Animated.Value(90));
  //var searchUrl = '';
  const [imageState, setImageState] = useState(null);
  const [searchUrl, setSearchUrl] = useState('https://www.shopwithflock.com');
  const [urlState, setUrlState] = useState('https://www.shopwithflock.com');
  const startAnimation = () => {
    Animated.timing(animation.current, {
      useNativeDriver: false,
      toValue: 95,
      delay: 0,
      duration: 500,
    }).start();
  };

  const renderForm = () => {
    //console.log('foundProduct:', foundProduct);
    if (!enlarge && foundProduct) {
      return (
        <View
          style={{
            flex: 10,
            backgroundColor: constants.BGGREY,
            width: '100%',
            paddingLeft: 30,
            paddingRight: 30,
            zIndex: 100,
          }}>
          <View style={{height: 200, flexDirection: 'row'}}>
            <Image
              style={{
                flex: 2,
                width: '100%',
                height: null,
                resizeMode: 'contain',
              }}
              source={
                {uri: imageState} ||
                require('App/Assets/Images/Blank_Photo_Icon.png')
              }
            />
            <View style={{flex: 2}}>
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
            </View>
          </View>
          <View style={{flex: 2, justifyContent: 'flex-start'}}>
            <View style={{paddingRight: 10, marginBottom: 20}}>
              <Text>Title</Text>
              <TextInput
                placeholder="Describe the product"
                placeholderTextColor={constants.DARKGREY}
                onChangeText={(text) => {
                  setTitleState(text);
                }}
                value={titleState}
              />
            </View>
            <View style={{marginTop: 10, paddingRight: 10, marginBottom: 20}}>
              <Text>Description</Text>
              <TextInput
                placeholder="Give more details about the product"
                onChangeText={(text) => {
                  setDescState(text);
                }}
                placeholderTextColor={constants.DARKGREY}
                value={descState}
              />
            </View>
            <View style={{marginTop: 10, paddingRight: 10}}>
              <Text>Price</Text>
              <TextInput
                placeholder="$"
                onChangeText={(text) => {
                  setPriceState(text);
                }}
                placeholderTextColor={constants.DARKGREY}
                value={priceState}
              />
            </View>
          </View>
        </View>
      );
    } else {
      return <View />;
    }
  };
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
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
          }}
        />
        <ProgressHeader
          headerText="Find a Product"
          goBack={true}
          nextRoute="Product Options"
          index={2}
          navigation={navigation}
        />
        <View style={{flex: 1, zIndex: 300}}>
          <View style={{paddingLeft: 20, paddingTop: 10}}>
            <Text
              style={{fontFamily: 'Nunito-Light', color: constants.LIGHTGREY}}>
              Find the product you recommended. Import it below.
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              //height: '95%',
              width: '100%',
              shadowOpacity: enlarge ? 0.2 : 0,
              shadowOffset: {height: -20},
              backgroundColor: enlarge ? 'white' : constants.BGGREY,
              //opacity: 0,
              //backgroundColor: 'transparent',
              borderRadius: 20,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              marginTop: -2,
              //position: enlarge ? 'absolute' : 'relative',
              //bottom: 0,
              alignSelf: 'center',
            }}>
            <View
              style={{
                flex: 1,
                marginBottom: 10,
                flexDirection: 'row',
                paddingLeft: 10,
                paddingRight: 10,
              }}>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  left: 7,
                  top: -8,
                }}
                onPress={() => {
                  setEnlarge(false);
                  Keyboard.dismiss();
                }}>
                <Image
                  style={{
                    height: enlarge ? 15 : 0,
                    width: enlarge ? 15 : 0,
                    tintColor: 'black',
                  }}
                  source={require('App/Assets/Images/Close_Icon_White.png')}
                />
              </TouchableOpacity>
              <View
                style={{
                  shadowOpacity: enlarge ? 0.2 : 0,
                  shadowOffset: {height: -25},
                  flex: 1,
                  flexDirection: 'row',
                  marginTop: 2.2,
                  marginBottom: 7,

                  //marginLeft: 10,
                  //marginRight: 10,
                  backgroundColor: enlarge ? constants.GREY : 'white',
                  //width: '90%',
                  borderRadius: 25,
                  marginLeft: enlarge ? 17 : 0,
                  paddingLeft: 10,
                  paddingRight: 15,
                  paddingTop: 7,
                  paddingBottom: 7,
                  alignSelf: 'center',
                  borderBottomColor: 'constants.PURPLE',

                  borderStartColor: 'constants.PURPLE',
                  borderBottomWidth: enlarge ? 1 : 0,
                  borderStartWidth: enlarge ? 1 : 0,
                }}>
                <TextInput
                  placeholder="Enter link or search by keyword"
                  selectTextOnFocus
                  value={enlarge ? searchUrl : ''}
                  onChangeText={(text) => {
                    //searchUrl = text;
                    setSearchUrl(text);
                  }}
                  style={[
                    styles.textBoxStyle,

                    {
                      color: constants.LIGHTGREY,
                      backgroundColor: enlarge ? constants.GREY : 'white',
                    },
                  ]}
                  onFocus={() => {
                    console.log('focusing');
                    setEnlarge(true);
                  }}
                />
                <TouchableOpacity
                  style={{height: 20}}
                  onPress={() => {
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
                  }}>
                  <Image
                    source={require('App/Assets/Images/Search.png')}
                    style={{
                      tintColor: constants.ICONGREY,
                      flex: 1,
                      width: 20,
                      resizeMode: 'contain',
                      height: 20,
                      marginRight: -10,
                    }}
                  />
                </TouchableOpacity>
                {/*<Button onPress={() => navigation.navigate('')} />*/}
              </View>
              {enlarge ? (
                <TouchableHighlight
                  onPress={() => {
                    console.log('pinned');
                    fetch(
                      'https://powerful-everglades-32172.herokuapp.com/find_product/' +
                        searchUrl,
                    )
                      .then((response) => response.json())
                      .then((data) => {
                        setTitleState(data.title);
                        setPriceState(data.price);
                        var ar = data.image.split('//');

                        setImageState('https://' + ar[ar.length - 1]);
                        setTimeout(() => {
                          setEnlarge(false);
                        }, 500);
                        Keyboard.dismiss();
                        console.log(data);
                      });
                  }}
                  style={{
                    height: 25,
                    marginTop: -13,
                    //borderWidth: 2,
                    borderRadius: 20,
                    paddingLeft: 5,
                    paddingRight: 5,
                    paddingTop: 2,
                    marginLeft: 5,
                    borderColor: 'white',
                    //borderWidth: 1,
                    backgroundColor: constants.PURPLE,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 14,
                      fontFamily: 'Nunito-Bold',
                      height: 90,
                      zIndex: 50,
                    }}
                    title="test">
                    Import
                  </Text>
                </TouchableHighlight>
              ) : (
                <View />
              )}
            </View>
            <View
              style={{
                marginTop: 5,
                alignSelf: 'center',
                width: '100%',
                height: enlarge ? 1000 : 0,
              }}>
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
          </View>
          {renderForm()}
        </View>
      </View>
    </KeyboardAvoidingView>
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
  },
});

export default CamScreenTwo;
