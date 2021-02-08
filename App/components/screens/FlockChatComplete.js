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

function FlockChatComplete({route, navigation}) {
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
    socket.current.on('complete', () => {
      console.log('completingggg');
      navigation.navigate('VideoMasonry');
    });
    console.log("MESSAGES");
    setRecvMessages(route.params.data.messages);
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
      //data["id"] = docRef.id;
      console.log("DAT", route.params.data);
      db.collection('chatGroups').doc(route.params.data.id).update({
          messages: firebase.firestore.FieldValue.arrayUnion({sender: {name: firebase.auth().currentUser.displayName, uid: firebase.auth().currentUser.uid}, ...messages[0]}),
        });
        //console.log("messages format",recvMessages);
    setRecvMessages((prevState) => GiftedChat.append(prevState, messages));
  };

  console.log(route.params.data);
  const user = firebase.auth().currentUser;
  var part = false;
  for (const member of route.params.data.members) {
    if (user.uid === member.uid) {
      part = true;
      break;
    }
  }
  const [partOf, setPartOf] = useState(part);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <HeaderGradient navigation={navigation} >
        <Text style={{marginBottom: 7, fontFamily: constants.FONT}}>{route.params.data.flock}</Text>
      </HeaderGradient>

      <View style={{ position: 'absolute', zIndex: 200, top: 100, width: '100%', borderRadius: 0, borderBottomRightRadius: 30, borderBottomLeftRadius: 30}}>
      <View style={{shadowColor: constants.LAVENDER, shadowOffset: {height: 0, width: 0}, shadowOpacity: 0.42, elevation: 13, shadowRadius: 28.30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30}}>
      <LinearGradient
          colors={[constants.LAVENDER, constants.PURPINK]}
          start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
          style={{
            borderRadius: 20,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            
            padding: 10,
            shadowColor: "#ff7009", shadowOffset: {height: 10, width: 0}, shadowOpacity: 0.39, elevation: 13, shadowRadius: 8.30,
            //alignItems: 'center',
            flex: 1,
          }}>
            <View style={{width: '80%', alignSelf: 'center'}}>
            <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>This flock has succeeded! Click the blurb below to use your new item!</Text>
            </View>
            <TouchableOpacity onPress={()=>{
              navigation.navigate("FlockReserve", {data: route.params.data});
            }}>
            <View style={{padding: 20, marginBottom: 15, paddingLeft: 30, borderRadius: 50, shadowRadius: 2.62, backgroundColor: 'white', shadowOpacity: 0.23, shadowOffset:{height: 2,width:0}, elevation: 1}}>
            <View style={{flexDirection: 'row',}}>
            <Image style={{width: 50, height: 50}} source={{uri: route.params.data.product.image}} />
            <View style={{paddingRight: 30}}>
              <Text numberOfLines={2} style={{flex: 1}}>
                {route.params.data.product.title}
              </Text>
            </View>
            </View>
            </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      <View style={{marginTop: 20, flexDirection: 'row'}}>
        <Image style = {{width: 40, height: 40}} source ={constants.PLACEHOLDER_IMAGE } />
        <View style={{borderRadius: 30, flex: 1, backgroundColor: constants.GREYBLUE, padding: 20, marginRight: 20, shadowColor: constants.GREYBLUE, shadowOffset: {height: 10, width: 0}, shadowOpacity: 0.82, elevation: 13, shadowRadius: 18.30,}}><Text>Description Hello world</Text></View>
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
      
      {partOf?<></>:<View style={{position: 'absolute', bottom: 0, width: '100%', height: 100, backgroundColor: 'white'}}><View style={{height: '100%', backgroundColor: constants.PINK_BACKGROUND }}>
        <TouchableOpacity style={{width: '90%', height: 50, backgroundColor: constants.ORANGE, alignSelf: 'center', borderRadius: 30, justifyContent: 'center'}} onPress={()=>{
          const memberInfo = {name: firebase.auth().currentUser.displayName, uid: firebase.auth().currentUser.uid, max: 50};
          // check if the flock is completed
          // make user enter credit card information
          // db.collection('users').doc(firebase.auth().currentUser.uid).update({
          //   chatIds: firebase.firestore.FieldValue.arrayUnion(route.params.data.id)
          // });
          // db.collection('chatGroups').doc(route.params.data.id).update({
          //   members: firebase.firestore.FieldValue.arrayUnion(memberInfo)
          // });
          setPartOf(true);
        dispatch({type: "UPDATE_DATA", payload: ["chatIds", "add", "array", route.params.data.id]});
        dispatch({type: "UPDATE_DATA", payload: ["chatGroups", "add", "array", route.params.data]});
          route.params.data.members.push(memberInfo);
          // send to socket, which pushes a broadcast
          // test signal, send test, on receive, console log "RECEIVED"
          // condition
          if (true) {
          socket.current.emit('complete', route.params.data.id);
          }
          if (route.params.data.members.length > 3) {
            // send to socket complete signal, which three are complete
          }
      }}><Text style={{color: 'white', alignSelf: 'center', fontWeight: 'bold'}}>JOIN</Text></TouchableOpacity></View></View>}
    </SafeAreaView>
  );
}


export default FlockChatComplete;
