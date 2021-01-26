/* @flow */

import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import Myform from './Myform';
import Social from './Social';
import LoginCommon from './LoginCommon';
const Signup = ({navigation}) =>  {
  return (
    <LoginCommon content={<Myform registration= {true} navigation={navigation} />} />

  );
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
    flex: 2,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  myform: {
    flex: 2,
  },
  social: {
    flex: 4,
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
    marginTop: 0,
    marginBottom: 15,
  },
});


export default Signup;