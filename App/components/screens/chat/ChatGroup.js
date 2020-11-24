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
import Info from './info/Info';
import ChatInterface from './ChatInterface';

const Stack = createMaterialTopTabNavigator();
//const Stack = createStackNavigator();
const ChatGroup = ({route}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
      tabBarOptions={{
        showLabel: false,
        showIcon: false,
        indicatorStyle: {opacity: 0},
        tabStyle: {height: 0, margin: 0, padding: 0},
        indicatorContainerStyle: {opacity: 0},
      }}>
      <Stack.Screen
        name="Chat"
        component={ChatInterface}
        initialParams={{data: route.params.data}}
      />
      <Stack.Screen
        name="Info"
        component={Info}
        initialParams={{
          friends: route.params.data.friends,
          data: route.params.data,
        }}
      />
    </Stack.Navigator>
  );
};

export default ChatGroup;
