import React, {useEffect, useState, useRef} from 'react';
import {constants} from 'App/constants';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  SafeAreaView,
  ScrollView,
  View,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {firebase, db} from 'App/firebase/config';
import io from 'socket.io-client';
import NavBar from 'App/components/common/NavBar';
import {GiftedChat} from 'react-native-gifted-chat';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector, useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Countdown from 'App/components/Countdown';
import HeaderGradient from 'App/components/HeaderGradient';

const FlockSuccess = ({navigation, route}) => {
  console.log(route.params.data.memberIds);
    return <SafeAreaView>
            <HeaderGradient navigation={navigation} closeX={true} absolute={false}>
        {/* <Text style={{fontSize: 18, fontFamily: constants.FONT, marginTop: -10}}>Success</Text> */}
    </HeaderGradient>
    <View style={{paddingVertical:10, paddingHorizontal:20, backgroundColor: constants.PINK_BACKGROUND_OPAQUE, height: '100%'}}>
    <Text style={{alignSelf: 'center'}}>
        Congratulations! Your flock succeeded!
    </Text>

    <Text style={{marginTop: 20,}}>
    We will order your item immediately and notify you in Flock chat, text, and email when it arrives at Flock headquarters. Tap below to book your item for use. 
    </Text>

    <Text style={{marginTop: 20}}>
    You can find all your completed Flocks on your Profile page.
    </Text>

    <TouchableOpacity style={{marginTop: 20, }} onPress={()=>{
        navigation.navigate("FlockReserve", {data: route.params.data});
      }}>
      <View style={{padding: 20, marginBottom: 15, paddingLeft: 10, borderRadius: 50, backgroundColor: 'white', borderWidth: 2, borderColor: constants.LAVENDER,  elevation: 1}}>
      <View style={{flexDirection:'row', alignItems: 'center'}}>
      <Image style={{width: 50, height: 50}} source={{uri: route.params.data.product.image}} />
      <View style={{marginLeft: 5, flex: 1}}>
        <Text numberOfLines={2}>{route.params.data.product.title}</Text>
      </View>
      <Icon name="chevron-right" size={25} color={constants.LAVENDER} />
      </View>
      </View>
      </TouchableOpacity>
      </View>
      </SafeAreaView>;
}

export default FlockSuccess;