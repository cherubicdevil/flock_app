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
import HowTo from 'App/HowTo';
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

import ModalSelector from 'react-native-modal-selector';
import Icon from 'react-native-vector-icons/FontAwesome';
import ResizeableImage from 'App/components/ResizeableImage';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import HelpDialog from 'App/components/HelpDialog';
import AnimatedModal from 'App/components/AnimatedModal';

const Description = ({brand, title, productId, price, colors=[constants.YELLOW, constants.ORANGE], bannerText=(price)=>{
    return "$" + (parseFloat(price) / 25 * 1.4).toFixed(2) + " when you flock"
},
lowkey=false
}) => {
  if (lowkey) {
    return <View>
    <Text style={{fontSize: 14, marginBottom: 5,}}>
    <Text style={{fontWeight: 'bold'}}>{brand?brand+" ":""}</Text>{title}
    </Text>
    <View style={{flexDirection:'row', alignItems: 'center'}}>
    <Text style={{textDecorationLine: 'line-through', fontFamily: constants.FONTBOLD, color: colors[0], fontSize: 15}}>
    ${price} <Text>original</Text>
    </Text>
    {/*<Text style={styles.descriptionText}>50 flockers have bought</Text>*/}
    {/*<Text style={styles.descriptionText}>Recommended by username</Text>*/}
    <View
      style={{
        alignSelf: 'center',
        marginLeft: 10, 
        borderRadius: 30,
        zIndex: 40,
      }}><View style={{borderRadius: 30, borderWidth: 0, borderColor: colors[0], color: 'black', justifyContent: 'center', alignItems:'center',paddingVertical: 5, paddingLeft: 10, paddingRight: 10}}>
        <Text style={{color: colors[0], fontSize: 14, fontFamily: constants.FONTBOLD}}>{bannerText(price)}</Text></View>
</View>
  <View style={{position: 'absolute', right: 0}}>
    <HelpDialog text="Incorrect or missing title, description, or product picture? Notify us below." context={{uid: au.currentUser.uid, name: au.currentUser.displayName, productName: title, productId: productId}} />
      </View>
    </View>
  </View>
  }
    return (
      <View>
        <Text style={{fontSize: 14, marginBottom: 5,}}>
        <Text style={{fontWeight: 'bold'}}>{brand?brand+" ":""}</Text>{title}
        </Text>
        <View style={{flexDirection:'row', alignItems: 'center'}}>
        <Text style={{textDecorationLine: 'line-through', fontFamily: constants.FONT, color: 'black', fontSize: 15}}>
        ${price} <Text>original</Text>
        </Text>
        {/*<Text style={styles.descriptionText}>50 flockers have bought</Text>*/}
        {/*<Text style={styles.descriptionText}>Recommended by username</Text>*/}
        {/* <LinearGradient
          colors={colors}
          start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
          style={{
            alignSelf: 'center',
            marginLeft: 10, 
            borderRadius: 30,
            zIndex: 40,
          }}> */}
            <View style={{borderRadius: 30, color: 'white', justifyContent: 'center', alignItems:'center',paddingVertical: 5, paddingLeft: 10, paddingRight: 10}}><Text style={{fontSize: 14, fontFamily: constants.FONTBOLD, color: colors[0]}}>{bannerText(price)}</Text></View>
{/* </LinearGradient> */}
      <View style={{position: 'absolute', right: 0}}>
        <HelpDialog text="Incorrect or missing title, description, or product picture? Notify us below." context={{uid: au.currentUser.uid, name: au.currentUser.displayName, productName: title, productId: productId}} />
          </View>
        </View>
        
      </View>
    );
  };

  export default Description;