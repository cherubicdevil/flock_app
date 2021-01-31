import React, {useState, useRef, Fragment} from 'react';
import {View, ScrollView, Text, Switch, TextInput, Image,Button,SafeAreaView, TouchableOpacity} from 'react-native';
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

const ShareScreen = ({navigation, route}) => {
    return <Fragment>
    <SafeAreaView style={{backgroundColor: constants.TRANSLUCENT}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constants.PINK_BACKGROUND}}>
            <View style={{height: 80, borderBottomRightRadius: 50, borderBottomLeftRadius: 50, backgroundColor: constants.TRANSLUCENT}}>
    <View style={{alignSelf: 'center'}}>
        <Text style={{fontSize: 17, fontFamily: constants.FONT, alignSelf: 'center', fontWeight: 'bold'}}>Share</Text>
        <Text style={{fontSize: 17, fontFamily: constants.FONT, alignSelf: 'center'}}>%{route.params.flockId.padStart(5,0)}</Text>
    </View>
    <TouchableOpacity 
    style={{borderRadius: 40, backgroundColor: constants.DARKGREY, padding: 10, alignSelf:'flex-end', marginTop: -30, marginRight: 20}}
    onPress={()=>{
        navigation.goBack();
    }}>
        <Text>done</Text>
    </TouchableOpacity>
    </View>
    <ShareSocial product = {route.params.product} data = {route.params.data} flockId={route.params.flockId} /></SafeAreaView>
    </Fragment>;
}

export default ShareScreen;