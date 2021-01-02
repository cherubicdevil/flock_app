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

var eventify = function (arr, callback) {
  arr.push = function (e) {
    Array.prototype.push.call(arr, e);
    callback(arr);
  };
};

const updateCache = (id, messages) => {
  //data[id].messages = messages;
};

const systemMessages = [];

function ChatInterface({route, navigation}) {
  const select = useSelector((state) => state);
  const socket = useRef(null);
  const [recvMessages, setRecvMessages] = useState(route.params.data.messages);
  //const [recvMessages, setRecvMessages] = useState([testSystemMessage]);
  const [dummyState, setDummyState] = useState(false);
  const dispatch = useDispatch();
  //firebase.firestore().collection("posts").get();
  useEffect(function () {
    //firebase.firestore().collection("posts").get();
    eventify(systemMessages, (message) => {
      console.log('adding');
      setRecvMessages((prevState) => GiftedChat.append(prevState, message));
    });
    //socket.current = io('https://enigmatic-bastion-86695.herokuapp.com/');
    socket.current = io('http://10.0.0.228:5000');
    console.log('WHY IS THIS RUNNING AGAIN');
    socket.current.emit('join', route.params.data.id);
    socket.current.on('message', (message) => {
      console.log(message);
      setRecvMessages((prevState) => GiftedChat.append(prevState, message));
    });
    dispatch({type: 'emptySystemMessages'});
  }, []);

  useEffect(() => {
    for (const message of select.chat.systemMessages) {
      setRecvMessages((prevState) => GiftedChat.append(prevState, message));
    }
  }, [select.chat.systemMessages]);

  // const setRecvMessages = (messages) => {
  //   recvMessages = messages;
  //   setDummyState(!dummyState);
  // };
  const onSend = (messages) => {
    if (route.params.data.id === 'self') {
      setRecvMessages((prevState) => GiftedChat.append(prevState, messages));
      return;
    }
    socket.current.emit('message', {
      text: messages[0].text,
      id: route.params.data.id,
    });
    console.log(route.params.data);
    updateCache(route.params.data.id, recvMessages);
    setRecvMessages((prevState) => GiftedChat.append(prevState, messages));
  };

  console.log(route.params.data);
  const user = firebase.auth().currentUser;
  var partOf = false;
  for (const member of route.params.data.members) {
    if (user.uid === member.uid) {
      partOf = true;
      break;
    }
  }
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
          backgroundColor: constants.TRANSLUCENT,
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
        }}>
                <Button style={{zIndex:100, position: 'absolute', top: 200,}} title="leave" onPress={() =>{
        console.log('left');
        // FLOCK_BUG this code is repeated a lot throughout codebase
        console.log(route.params.data);
        db.collection('users').doc(firebase.auth().currentUser.uid).update({
          chatIds: firebase.firestore.FieldValue.arrayRemove(route.params.data.id)
        });
              dispatch({type: "UPDATE_DATA", payload: ["chatIds", "remove", "array", route.params.data.id]});
              dispatch({type: "UPDATE_DATA", payload: ["chatGroups", "remove", "array", route.params.data]});
              navigation.navigate('Carousel');
      }} />
        <Text style={{fontSize: 20}}>{route.params.data.flock}</Text>
        <Button
          title="
            ⓘ"
          onPress={() => {
            navigation.navigate('Info');
          }}
        />
      </View>
      <View style={{ position: 'absolute', zIndex: 200, top: 100, width: '100%', borderRadius: 0, borderBottomRightRadius: 30, borderBottomLeftRadius: 30}}>
      <View style={{shadowColor: "#ff7009", shadowOffset: {height: 10, width: 0}, shadowOpacity: 0.39, elevation: 13, shadowRadius: 28.30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30}}>
      <LinearGradient
          colors={[constants.ORANGE, constants.PEACH]}
          start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
          style={{
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            padding: 10,
            shadowColor: "#ff7009", shadowOffset: {height: 10, width: 0}, shadowOpacity: 0.39, elevation: 13, shadowRadius: 28.30,
            //alignItems: 'center',
            flex: 1,
          }}>
            <View style={{width: '80%', alignSelf: 'center'}}>
            <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>Current flock price: ${route.params.data?.product?.price || ""}</Text>
            {/* <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>Total price: ${route.params.data?.product?.price || ""}</Text> */}
            <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>You can have it now if all flockers increase maximum to $150.</Text>
            <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>Your maximum: </Text>
            <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>Want to pay less? Get more people to join!</Text>
            </View>
            <View style={{padding: 20, marginBottom: 15, paddingLeft: 30, borderRadius: 50, shadowRadius: 2.62, backgroundColor: 'white', shadowOpacity: 0.23, shadowOffset:{height: 2,width:0}, elevation: 1}}>
            <Image style={{width: 50, height: 50}} source={{uri: route.params.data.product.image}} />
            </View>
          </LinearGradient>
        </View>
      <View style={{marginTop: 20, flexDirection: 'row'}}>
        <Image style = {{width: 40, height: 40}} source ={constants.PLACEHOLDER_IMAGE } />
        <View style={{borderRadius: 30, flex: 1, backgroundColor: constants.GREYBLUE, padding: 20, marginRight: 20}}><Text>Description Hello world</Text></View>
      </View>
      </View>
      
      <View style={{backgroundColor: constants.PINK_BACKGROUND, flex: 1}}>
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
      /></View>
      
      {partOf?<></>:<View style={{position: 'absolute', bottom: 0, width: '100%', height: 100, backgroundColor: 'white'}}><View style={{height: '100%', backgroundColor: constants.PINK_BACKGROUND }}><TouchableOpacity style={{width: '90%', height: 50, backgroundColor: constants.ORANGE, alignSelf: 'center', borderRadius: 30, justifyContent: 'center'}} onPress={()=>{}}><Text style={{color: 'white', alignSelf: 'center', fontWeight: 'bold'}}>JOIN</Text></TouchableOpacity></View></View>}
    </SafeAreaView>
  );
}

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
export default ChatInterface;
