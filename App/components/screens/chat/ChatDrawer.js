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
import ChatGroup from './ChatGroup';

const Drawer = createDrawerNavigator();

const ChatDrawer = ({navigation, route}) => {
  return (
    <Drawer.Navigator
      minSwipeDistance={30}
      edgeWidth={130}
      openByDefault={false}
      drawerType="slide"
      drawerContent={(props) => {
        return (
          <DrawerContentComponent
            {...props}
            navigation={navigation}
            route={route}
          />
        );
      }}>
      {renderDrawers(data)}
    </Drawer.Navigator>
  );
};

const renderDrawers = (data) => {
  return Object.entries(data).map(([, item]) => {
    return (
      <Drawer.Screen
        key={Math.random()}
        name={item.flock}
        component={ChatGroup}
        initialParams={{data: item}}
      />
    );
  });
};

const DrawerContentComponent = (props) => {
  const wasDrawerOpen = useIsDrawerOpen();
  const [dummyState, setDummyState] = useState(false);
  return (
    <>
      {/* <View
      style={{
        width: 700,
        height: 100,
        position: 'absolute',
        bottom: 70,
        zIndex: 900,
        backgroundColor: 'black',
      }}
    /> */}
      {!wasDrawerOpen ? null : (
        <NavBar navigation={props.navigation} route={props.route} />
      )}

      <DrawerContentScrollView style={{backgroundColor: constants.RED}}>
        <DrawerItem
          label="Kevin Gao"
          labelStyle={{
            fontSize: 20,
            fontFamily: constants.FONT,
            paddingLeft: 10,
            fontWeight: '800',
          }}
          style={{
            borderRadius: 25,
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}
        />
        <View
          style={{
            marginTop: 10,
            marginLeft: 10,
            marginRight: 10,
            borderRadius: 20,
            backgroundColor: 'rgba(0,255,255,0.04)',
          }}>
          <View
            style={{
              marginBottom: -15,
              //backgroundColor: "red",
              flexDirection: 'row',
            }}>
            <DrawerItem
              label="Your Flocks"
              labelStyle={{
                fontFamily: constants.FONT,
                fontSize: 17,
                color: constants.OFF_BLACK,
                fontSize: 15,
                fontWeight: '500',
              }}
              style={{flex: 1}}
            />
            <View style={{justifyContent: 'center', paddingBottom: 5}}>
              <TouchableOpacity
                onPress={() => {
                  console.log('adding');
                  // data[2] = {flock: 'Test'};
                  // setDummyState(!dummyState);
                  //console.log(data);
                }}>
                <Text style={{fontSize: 30, color: constants.DARK_BLUE}}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginLeft: 10}}>
            <MyDrawerItemList {...props} />
          </View>
        </View>
        <Image
          source={constants.BIRDS}
          style={{
            tintColor: constants.PURPLE,
            zIndex: 1,
            opacity: 0.4,
            width: 230,
            height: 200,
          }}
        />
      </DrawerContentScrollView>
    </>
  );
};

const MyDrawerItemList = ({descriptors, state, navigation}) => {
  return (
    <View style={{marginTop: 10}}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(route.name);
              console.log('navigating to', route.name);
            }}>
            <View
              style={{
                height: 30,
                marginLeft: 10,
                paddingLeft: 10,
                justifyContent: 'center',
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20,
                backgroundColor: isFocused
                  ? constants.LIGHT_BLUE
                  : 'transparent',
                width: '100%',
              }}>
              <Text
                style={{
                  fontFamily: constants.FONT,
                  color: isFocused ? 'black' : constants.OFF_BLACK,

                  fontWeight: '500',
                }}>
                {route.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const data = {
  0: {
    flock: 'squad up',
    id: '0',
    buys: [
      {
        title: 'Game boy',
        url: null,
        price: '24.99',
        buyers: ['xxxHacker', 'jasonny'],
      },
      {
        title: 'Nintendo Switch',
        url: null,
        price: '300.99',
        buyers: [
          'xxxHacker',
          'jasonny',
          'danielpark',
          'Qrowsaki',
          'Me',
          'Hello',
        ],
      },
    ],
    boughts: [],
    friends: ['xxxHacker', 'stupidbro', 'jasonny', 'danielpark', 'Qrowsaki'],
    messages: [],
  },
  1: {
    flock: 'church friends',
    id: '1',
    buys: [],
    boughts: [],
    friends: ['Qrowsaki'],
    messages: [],
  },
};

export default ChatDrawer;
