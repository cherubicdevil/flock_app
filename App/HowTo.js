import React, {useState, useRef, useEffect} from 'react';
import {View, ScrollView, Text, Switch, TextInput, Image,} from 'react-native';
import ProgressHeader from 'App/components/ProgressHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {constants} from 'App/constants';
import LinearGradient from 'react-native-linear-gradient';
import {shareActions} from 'App/utils';
import {useDispatch} from 'react-redux';
import ViewShot from 'react-native-view-shot';
import Animation from 'lottie-react-native';
import {firebase, db} from 'App/firebase/config';
import ShareSocial from 'App/components/ShareSocial';
import { set } from 'react-native-reanimated';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import PriceSlider from 'App/components/PriceSlider';

const HowTo = () => {
return <View style={{fontFamily: constants.FONT, paddingLeft: 10, paddingRight: 15}}>
<Text style={{alignSelf: 'center', marginTop: 20, fontSize: 16}}>How the Flock Percentage Works</Text>
<Text style={{fontFamily: constants.FONT, marginTop: 10}}>You own a percentage of the item, depending on how much you paid.</Text>
<Text style={{fontFamily: constants.FONT, marginTop: 10}}>We make sure you have the item in your possession for the proportionate amount of time.</Text>
<Text style={{fontFamily: constants.FONT, marginTop: 10}}>For example: You own 4% of the item. You can use up to 4% of the year.</Text>
<Text style={{fontFamily: constants.FONT, marginTop: 10}}>When you want to use the item, the previous flocker will ship it to you. </Text>
<Text style={{fontFamily: constants.FONT, marginTop: 10}}>The item is in your possession for at least 8 days or until the next flocker requests it.</Text>
<Text style={{fontFamily: constants.FONT, marginTop: 10}}>You will send it to  the next flocker. </Text>
<Text style={{fontFamily: constants.FONT, marginTop: 10}}>We take care of the shipping details.</Text>
<Text style={{fontFamily: constants.FONT, marginTop: 10}}>You will collect 4% of the profit when the item is rented by others.</Text>
</View>
}

export default HowTo;