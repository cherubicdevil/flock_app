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
    socket.current.on('complete', () => {
      console.log('completingggg');
      navigation.navigate('FlockChatComplete', {data: route.params.data});
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
  console.log(route.params.data.maximums, user.uid);

  const priceText = () => {
    if (part) {
      return <><Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>You can have it now if all flockers increase maximum to ${(route.params.data.product.price / route.params.data.members.length).toFixed(2)}.</Text>
      <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>Your maximum: ${route.params.data.maximums[user.uid]}</Text>
      <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>Want to pay less? Get more people to join!</Text></>;

    } else {
      return <><Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>You can have it now if you join for ${(route.params.data.product.price / (route.params.data.members.length+1)).toFixed(2)}.</Text>
      <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>Want to pay less? Get more people to join!</Text>
      </>;
    }
  }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      
<HeaderView navigation={navigation} route={route} />
      <View style={{ position: 'absolute', zIndex: 200, top: 100, width: '100%', borderRadius: 0, borderBottomRightRadius: 30, borderBottomLeftRadius: 30}}>
      <View style={{shadowColor: "#ff7009", shadowOffset: {height: 0, width: 0}, shadowOpacity: 0.42, elevation: 13, shadowRadius: 28.30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30}}>
      <LinearGradient
          colors={[constants.ORANGE, constants.PEACH]}
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
            <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>Current flock price: ${route.params.data?.product?.price || ""}</Text>
            {/* <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>Total price: ${route.params.data?.product?.price || ""}</Text> */}
            {priceText()}
            </View>
            <View style={{flexDirection: 'row', padding: 20, marginBottom: 15, paddingLeft: 30, borderRadius: 50, shadowRadius: 2.62, backgroundColor: 'white', shadowOpacity: 0.23, shadowOffset:{height: 2,width:0}, elevation: 1}}>
            <Image style={{width: 50, height: 50}} source={{uri: route.params.data.product.image}} />
            <Text>{route.params.data.product.title}</Text>
            </View>
          </LinearGradient>
        </View>
        {route.params.data.product.description?
      <View style={{marginTop: 20, flexDirection: 'row'}}>
        <Image style = {{width: 40, height: 40}} source ={constants.PLACEHOLDER_IMAGE } />
        <View style={{borderRadius: 30, flex: 1, backgroundColor: constants.GREYBLUE, padding: 20, marginRight: 20, shadowColor: constants.GREYBLUE, shadowOffset: {height: 10, width: 0}, shadowOpacity: 0.82, elevation: 13, shadowRadius: 18.30,}}><Text>Description Hello world</Text></View>
      </View>:<></>
}
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
          db.collection('users').doc(firebase.auth().currentUser.uid).update({
            chatIds: firebase.firestore.FieldValue.arrayUnion(route.params.data.id)
          });
          const maxi = {};
          
          // TODO: change to data maxPrice
          maxi[firebase.auth().currentUser.uid] = 100;
          console.log(maxi, "IS THIS WHERE IT GOES WRONG");
          db.collection('chatGroups').doc(route.params.data.id).update({
            members: firebase.firestore.FieldValue.arrayUnion(memberInfo),
            maximums: firebase.firestore.FieldValue.arrayUnion(maxi)
          });
          setPartOf(true);
        dispatch({type: "UPDATE_DATA", payload: ["chatIds", "add", "array", route.params.data.id]});
        dispatch({type: "UPDATE_DATA", payload: ["chatGroups", "add", "array", route.params.data]});
          route.params.data.members.push(memberInfo);
          // send to socket, which pushes a broadcast
          // test signal, send test, on receive, console log "RECEIVED"
          // condition
          // FLOCK_UPDATE
          if (true) {
          socket.current.emit('complete', route.params.data.id);
          db.collection('chatGroups').doc(route.params.data.id).set({
            completed: true,
            
            // rentPrice: ((route.params.data.product.price * .15 + route.params.data.product.price / route.params.data.members.length) / 2).toFixed(2),
            // FLOCK_UPDATE this should go in the backend so that prices can be adjusted easily
          });
          
          navigation.navigate('FlockChatComplete', {data: route.params.data})
          }
          if (route.params.data.members.length > 3) {
            // send to socket complete signal, which three are complete
          }
      }}><Text style={{color: 'white', alignSelf: 'center', fontWeight: 'bold'}}>JOIN</Text></TouchableOpacity></View></View>}
    </SafeAreaView>
  );
}

const HeaderView = ({navigation, route}) => {
  const [collapsed, setCollapsed] = useState(true);
  return <View
  style={{
    position: 'absolute',
    zIndex: 90,

    borderBottomColor: '#efefef',
    borderBottomWidth: 1,
    height: 100,
    width: '100%',
    top: 0,

    //backgroundColor: constants.TRANSLUCENT,
    // borderBottomLeftRadius: 15,
    // borderBottomRightRadius: 15,
  }}>
    <LinearGradient
    colors={[constants.TRANSLUCENT, 'white']}
    start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
    style={{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingLeft: 20,
      paddingBottom: 20,
      // borderBottomRightRadius:20,
      // borderBottomLeftRadius: 20,
      //shadowColor: "#ff7009", shadowOffset: {height: 10, width: 0}, shadowOpacity: 0.39, elevation: 13, shadowRadius: 28.30,
      //alignItems: 'center',
    }}>
    
          <TouchableOpacity onPress={()=>{ navigation.goBack()}}><Image style={{width: 35, height: 35}} source = {require('App/Assets/Images/Back_Icon.png')} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={()=>{ setCollapsed(!collapsed); }}>
  <View>
    
  <Text style={{fontSize: 14}}>{route.params.data.flock}</Text>
  <Countdown dateObj={route.params.data.time} />
  <Collapsible collapsed={collapsed}>
    <ScrollView horizontal >
  {route.params.data.members.map((item)=>{
    const buyer = item.name;
    const user = firebase.auth().currentUser;
  return <View>
  <Image
    key={Math.random()}
    style={{
      height: buyer === user.displayName ? 50 : 46,
      marginRight: 10,
      marginTop: 10,
      width: buyer === user.displayName ? 50 : 46,
      borderWidth: 3,
      borderColor:
        buyer === user.displayName ? '#3cf' : 'transparent',
      borderRadius: 50,
    }}
    source={{uri: 'https://placeimg.com/140/140/any'}}
  />
  <Text
    numberOfLines={1}
    style={{
      fontWeight:
        buyer === user.displayName ? 'bold' : 'normal',
      color: buyer === user.displayName ? '#3cf' : 'black',
      fontSize: 10,
      width: 48,
      textAlign: 'center',
      overflow: 'hidden',
    }}>
    {buyer === user.displayName ? 'You' : buyer}
  </Text>
</View>;
  })}
      </ScrollView>
      </Collapsible>
  </View>
  </TouchableOpacity>
  <Button
    title="
      ⓘ"
    onPress={() => {
      navigation.navigate('Info', {
        friends: [],
        data: route.params.data,
      });
    }}
  />
  </LinearGradient>
</View>
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
export default ChatInterface;
