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
            <Myform registration={true} />
          </View>
          <View style={styles.social}>
            <Social />
            <TouchableOpacity
              style={styles.buttontext2}
              onPress={() => {
                this.props.navigation.navigate('Login');
                console.log('trying to goto login');
              }}>
              <Text style={styles.buttontext}> Already a flocker? Login!</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    marginTop: 5,
    marginBottom: 15,
  },
});
