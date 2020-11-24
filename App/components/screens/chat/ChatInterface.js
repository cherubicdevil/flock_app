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

var eventify = function (arr, callback) {
  arr.push = function (e) {
    Array.prototype.push.call(arr, e);
    callback(arr);
  };
};

const systemMessages = [];

function ChatInterface({route, navigation}) {
  const socket = useRef(null);
  const [recvMessages, setRecvMessages] = useState(route.params.data.messages);
  //const [recvMessages, setRecvMessages] = useState([testSystemMessage]);
  const [dummyState, setDummyState] = useState(false);
  //firebase.firestore().collection("posts").get();
  useEffect(function () {
    //firebase.firestore().collection("posts").get();
    eventify(systemMessages, (message) => {
      console.log('adding');
      setRecvMessages((prevState) => GiftedChat.append(prevState, message));
    });
    // socket.current = io('http://10.0.0.228:3001');
    // socket.current.on('message', (message) => {
    //   console.log(message);
    //   setRecvMessages((prevState) => GiftedChat.append(prevState, message));
    // });
  }, []);

  // const setRecvMessages = (messages) => {
  //   recvMessages = messages;
  //   setDummyState(!dummyState);
  // };
  const onSend = (messages) => {
    //socket.current.emit('message', messages[0].text);
    console.log(route.params.data);
    updateCache(route.params.data.id, recvMessages);
    setRecvMessages((prevState) => GiftedChat.append(prevState, messages));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          position: 'absolute',
          zIndex: 90,
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderBottomColor: '#efefef',
          borderBottomWidth: 1,
          height: 100,
          width: '100%',
          top: 0,
          paddingLeft: 20,
          paddingBottom: 20,
        }}>
        <Text style={{fontSize: 20}}>{route.params.data.flock}</Text>
        <Button
          title="
            ⓘ"
          onPress={() => {
            navigation.navigate('Info');
          }}
        />
      </View>
      <GiftedChat
        renderSystemMessage={(props) => {
          //console.log("SYSTEM MESSAGE PROPS", props);
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Info', {
                  openId: props.currentMessage.openId,
                });
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  //borderWidth: 1,
                  shadowOpacity: 0.2,
                  shadowOffset: {height: 5, width: 2},
                  backgroundColor: '#22a',
                  borderRadius: 2,
                  paddingRight: 15,
                  paddingLeft: 15,
                  paddingTop: 10,
                  paddingBottom: 10,
                  alignSelf: 'center',
                  marginBottom: 10,

                  width: '75%',
                }}>
                <Text style={{textAlign: 'center', color: 'white'}}>
                  {props.currentMessage.text}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        messages={recvMessages}
        onSend={onSend}
        user={{_id: 1}}
      />
    </SafeAreaView>
  );
}

export default ChatInterface;
