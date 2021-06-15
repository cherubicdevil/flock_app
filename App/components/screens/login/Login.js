/* @flow */

import React, {Component} from 'react';
import {
  ScrollView,
  Button,
  TouchableOpacity,
  View,
  Text,
  Image,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Keyboard,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Myform from './Myform';
import Social from './Social';
import { TouchableWithoutFeedback } from 'react-native';
import MyFormPhone from './MyFormPhone';
import LoginCommon from './LoginCommon';
import Icon from 'react-native-vector-icons/FontAwesome';
const Login = ({navigation}) => {
    return (<>
      <LoginCommon navigation={navigation} content={<MyFormPhone navigation={navigation} registration= {false} />} />

      </>
 


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
    marginTop: 0,
    marginBottom: 0,
  },
});


export default Login;