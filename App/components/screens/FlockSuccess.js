import React, {useEffect, useState, useRef} from 'react';
import {constants} from 'App/constants';
import Collapsible from 'react-native-collapsible';
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
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  createDrawerNavigator,
  useIsDrawerOpen,
} from '@react-navigation/drawer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector, useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Countdown from 'App/components/Countdown';
import HeaderGradient from 'App/components/HeaderGradient';

const FlockSuccess = ({navigation, route}) => {
    return <SafeAreaView>
            <HeaderGradient navigation={navigation} closeX={true} absolute={false}>
        <Text>Success</Text>
    </HeaderGradient>
    <View style={{paddingVertical:10, paddingHorizontal:20}}>
    <Text style={{alignSelf: 'center'}}>
        Congratulations! Your flock succeeded!
    </Text>

    <Text style={{marginTop: 20,}}>
    Tap below to begin using your item. Note, there will be around a two week delay while we order your product. We will notify you in your flock chat and by email when the item has arrived and we can start shipping the product to you.
    </Text>

    <Text style={{marginTop: 20}}>
        You can find all your completed flocks in your profile page, under Flocks.
    </Text>

    <TouchableOpacity style={{marginTop: 20, }} onPress={()=>{
        navigation.navigate("FlockReserve", {data: route.params.data});
      }}>
      <View style={{padding: 20, marginBottom: 15, paddingLeft: 30, borderRadius: 50, shadowRadius: 2.62, backgroundColor: 'white', borderWidth: 2, borderColor: constants.ORANGE, shadowOpacity: 0.23, shadowOffset:{height: 2,width:0}, elevation: 1}}>
      <View style={{flexDirection:'row', paddingRight: 30}}>
      <Image style={{width: 50, height: 50}} source={{uri: route.params.data.product.image}} />
      <View>
        <Text numberOfLines={2} style={{flex:1}}>{route.params.data.product.title}</Text>
      </View>
      </View>
      </View>
      </TouchableOpacity>
      </View>
      </SafeAreaView>;
}

export default FlockSuccess;