/* @flow */

import React, {Component} from 'react';
import {
  Button,
  TouchableOpacity,
  View,
  Text,
  Image,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Myform from './Myform';
import Social from './Social';
export default class Login extends Component {
  render() {
    return (
      <ImageBackground
        style={styles.headerbg}
        source={require('./images/OrangePurpleGradient.png')}>
        <View behavior="padding" style={styles.container}>
          <View style={styles.logocontainer}>
            <Image
              style={styles.logo}
              source={require('./images/flockicon3.png')}
            />
          </View>
          <View style={styles.myform}>
            <Myform registration={false} />
          </View>
          <View style={styles.social}>
            <Social />
            <TouchableOpacity
              style={styles.buttontext2}
              onPress={() => {
                this.props.navigation.navigate('Signup');
              }}>
              <Text style={styles.buttontext}>
                {' '}
                Not yet a flocker? Sign up now!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <LottieView speed = { 2} source={require('App/Assets/coins.json')} autoPlay loop /> */}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  headerbg: {
    flex: 1,
    width: null,
    alignSelf: 'stretch',
  },
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  logocontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1.8,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  myform: {
    flex: 3,
  },
  social: {
    flex: 3,
  },
  buttontext: {
    textAlign: 'center',
    color: '#ffff',
    fontWeight: 'bold',
    marginBottom: 10,
    marginRight: 5,
  },
  buttontext2: {
    textAlign: 'center',
    color: '#ffff',
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 15,
  },
});
