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

import ChatDrawer from './ChatDrawer';
//import {firebase} from 'App/firebase/config';

const systemMessages = [];

const user = {displayName: 'Qrowsaki'};
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

const updateCache = (id, messages) => {
  data[id].messages = messages;
};

const testSystemMessage = {
  _id: 1,
  text: 'This is a system message',
  createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
  system: true,
  // Any additional custom parameters are passed through
};

//var recvMessages = [testSystemMessage];

export default ChatDrawer;
