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
import HeaderGradient from 'App/components/HeaderGradient';

const ShareScreen = ({navigation, route}) => {
    const [plusCoins, setPlusCoins] = useState(0);
    const onSuccessfulShare = () =>{
        setPlusCoins(plusCoins+10);
    };
    return <Fragment>
    <SafeAreaView style={{backgroundColor: constants.TRANSLUCENT}} />
        <SafeAreaView style={{flex: 1, backgroundColor: constants.PINK_BACKGROUND_OPAQUE}}>
    <HeaderGradient navigation={navigation} absolute={false}>
        <View style={{alignSelf: 'center'}}>
        <Text style={{fontSize: 17, fontFamily: constants.FONT, alignSelf: 'center', fontWeight: 'bold'}}>Share</Text>
        <Text style={{fontSize: 17, fontFamily: constants.FONT, alignSelf: 'center'}}>%{route.params.flockId.padStart(5,0).substring(0,5)}</Text>
    </View>
    <View>
        <Text style={{color: constants.ORANGE}}>
            +{plusCoins}
        </Text>
    <TouchableOpacity 
    style={{position: 'absolute', right: 5, bottom: 12, borderRadius: 40, backgroundColor: constants.ORANGE, padding: 10, alignSelf:'flex-end', marginTop: -30, marginRight: 20}}
    onPress={()=>{

        navigation.goBack();
    }}>
        <Text style={{color: 'white'}}>done</Text>
    </TouchableOpacity>
    </View>
        </HeaderGradient>
    <ShareSocial product = {route.params.product} data = {route.params.data} flockId={route.params.flockId} onSuccess={onSuccessfulShare} /></SafeAreaView>
    </Fragment>;
}

export default ShareScreen;