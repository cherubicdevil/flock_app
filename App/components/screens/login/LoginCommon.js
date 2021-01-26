import React, {Component, useEffect, useState} from 'react';
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
  Animated,
} from 'react-native';
import LottieView from 'lottie-react-native';
import Myform from './Myform';
import Social from './Social';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableWithoutFeedback } from 'react-native';

const anim_duration = 20000;
const LoginCommon = ({content, lowerlink}) => {
    const [cloudPos, setCloudPos] = useState(new Animated.Value(-200));
    useEffect(() => {
        const animation = Animated.timing(cloudPos, {
            duration: anim_duration,
            // velocity: 1,
            toValue: 500,
            useNativeDriver: false,
        });
        const resetAnimation = Animated.timing(cloudPos, {
            duration: 0,
            toValue: -200,
            useNativeDriver: false,
        });
        animation.start();
        var anim = setInterval(()=>{
            // cloudPos = -200;
            resetAnimation.start();
            animation.start();
        }, anim_duration);

        return () => {
            clearInterval(anim);
        }
    },[])
    return <LinearGradient
    colors={['#a48fac', '#c39cad', "#ff9966", "#ff7009"]}
    start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
    style={styles.headerbg}>
        <Animated.View style={{position: 'absolute', left: 20, marginLeft: cloudPos, top: 50}}>
        <Image style={{tintColor: 'rgba(255,255,255,0.5)', opacity: 0.3,}} source={require('App/Assets/Images/cloud.png')}/>
        </Animated.View>
      <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()} style={{flex: 1}}>
    <View behavior="padding" style={styles.container}>
      <View style={styles.logocontainer}>
        <Image
          style={styles.logo}
          source={require('App/Assets/Images/flock_logo_splash_screen.png')}
        />
      </View>
      <View style={styles.myform}>
        {content}
        {lowerlink}
      </View>

      <View style={styles.social}>

        <Social />

      </View>
    </View>
</TouchableWithoutFeedback>
  </LinearGradient>
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
      marginTop: 40,
      flex: 1.8,
    },
    logo: {
        // shadowColor: 'white',
        // shadowOpacity: 0.4,
        // shadowRadius: 10,
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
      marginTop: 35,
      marginBottom: 15,
    },
  });
  

  export default LoginCommon;