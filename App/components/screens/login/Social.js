/* @flow */

import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

export default class Social extends Component {
  render() {
    return (
      <View style={styles.MainContainer}>
        {/*}        <Text style={styles.title}>OR</Text>
        <TouchableOpacity style={styles.SocialStyle} activeOpacity={0.5}>
          <Image
            style={styles.ImageIconStyle}
            source={require('./images/FacebookIcon.png')}
          />
          <Text style={styles.buttontext}>Continue with Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.SocialStyle}>
          <Image
            style={styles.ImageIconStyle}
            source={require('./images/TwitterIcon.png')}
          />
          <Text style={styles.buttontext}>Continue with Twitter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.SocialStyle}>
          <Image
            style={styles.ImageIconStyle}
            source={require('./images/InstagramIcon.png')}
          />
          <Text style={styles.buttontext}>Continue with Instagram</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.SocialStyle}>
          <Image
            style={styles.ImageIconStyle}
            source={require('./images/GoogleIcon.png')}
          />
          <Text style={styles.buttontext}>Continue with Google</Text>
        </TouchableOpacity>
      */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  SocialStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#fff',
    height: 40,
    width: 220,
    borderRadius: 5,
    margin: 5,
  },
  ImageIconStyle: {
    padding: 10,
    margin: 10,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
  },
  buttontext: {
    textAlign: 'center',
    color: '#ffff',
    fontWeight: 'bold',
    marginBottom: 2,
    marginRight: 5,
  },
  buttontext2: {
    textAlign: 'center',
    color: '#ffff',
    fontWeight: 'bold',
    marginTop: 5,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
});
