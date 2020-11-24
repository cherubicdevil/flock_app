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
// import io from "socket.io-client";
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
import BuyInfo from './BuyInfo';

const systemMessages = [];
const user = {displayName: 'Qrowsaki'};

const Info = ({route, navigation}) => {
  const [bigDummyState, setBigDummyState] = useState(false);
  //const [buyData, setBuyData] = useState(route.params.data.buys);
  const renderFriends = (friends) => {
    if (friends === null) {
      return <Text>No friends in this chat</Text>;
    }
    return friends.map((friend) => (
      <View
        style={{
          backgroundColor: friend === user.displayName ? '#acf' : 'transparent',
          width: '100%',
          //marginBottom: 20,
          paddingBottom: 10,
          paddingTop: 10,
          flexDirection: 'row',
        }}>
        <Image
          style={{height: 50, width: 50, borderRadius: 100}}
          key={Math.random()}
          source={{uri: 'https://placeimg.com/140/140/any'}}
        />
        <Text style={{marginLeft: 10, marginTop: 10, fontSize: 14}}>
          {friend}
        </Text>
      </View>
    ));
  };
  return (
    <SafeAreaView style={{flex: 1, marginLeft: 30, marginRight: 20}}>
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{alignSelf: 'center'}}>
              <Text
                style={{
                  fontSize: 16,
                  //marginTop: 10,
                  fontWeight: 'bold',
                }}>
                {route.params.data.flock}
              </Text>
              <Text>{route.params.friends.length} Friends</Text>
            </View>
            <TouchableOpacity
              style={{
                marginTop: 15,
                marginLeft: 10,
                borderRadius: 20,
                borderWidth: 2,
                width: 25,
                height: 25,
                borderColor: '#cae',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 2,
              }}
              onPress={() => {}}>
              <Text style={{fontSize: 15, color: '#cae', fontWeight: 'bold'}}>
                +
              </Text>
            </TouchableOpacity>
          </View>
          <Button
            title="back"
            style={{
              width: '10%',
              alignSelf: 'flex-start',
            }}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
        <ScrollView>{renderFriends(route.params.friends)}</ScrollView>
      </View>
      <BuyInfo route={route} />
    </SafeAreaView>
  );
};

export default Info;
