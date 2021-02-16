import React, {useEffect, useState, useRef} from 'react';
import {constants} from 'App/constants';
import { Bubble } from 'react-native-gifted-chat'
import {firebase, db, au} from 'App/firebase/config';
import io from 'socket.io-client';
import {GiftedChat} from 'react-native-gifted-chat';


const ChatComponent = ({route, socket}) =>{
const [recvMessages, setRecvMessages] = useState([]);
// useFocusEffect(()=>{
//   setRecvMessages(route.params.data.messages);
// }, []);
//const [recvMessages, setRecvMessages] = useState([testSystemMessage]);
const [dummyState, setDummyState] = useState(0);

//firebase.firestore().collection("posts").get();
useEffect(function () {
  // console.log('hillo');
  //firebase.firestore().collection("posts").get();
//   eventify(systemMessages, (message) => {
//     console.log('adding');
//     setRecvMessages((prevState) => GiftedChat.append(prevState, message));
//   });
  setRecvMessages(route.params.data.messages.reverse());
  socket.current = io('https://enigmatic-bastion-86695.herokuapp.com/');
  // socket.current = io('http://10.0.0.228:5000');
  console.log('WHY IS THIS RUNNING AGAIN');
  socket.current.emit('join', route.params.data.id);
  socket.current.on('message', (message) => {
    console.log(message);
    setRecvMessages((prevState) => GiftedChat.append(prevState, message.text));
    // setRecvMessages([...recvMessages, message.text]);
  });
  socket.current.on('complete', () => {
    console.log('completingggg');
    navigation.navigate('FlockSuccess', {data: route.params.data});
  });
  console.log("MESSAGES");
  setRecvMessages(route.params.data.messages);
//   dispatch({type: 'emptySystemMessages'});
}, []);

// useEffect(() => {
//   for (const message of select.chat.systemMessages) {
//     setRecvMessages((prevState) => GiftedChat.append(prevState, message));
//   }
// }, [select.chat.systemMessages]);

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
  console.log(messages[0].text);
    //data["id"] = docRef.id;
    console.log("DAT", route.params.data);
    db.collection('chatGroups').doc(route.params.data.id).update({
        messages: firebase.firestore.FieldValue.arrayUnion({sender: {name: firebase.auth().currentUser.displayName, uid: firebase.auth().currentUser.uid}, ...messages[0], createdAt: Date.parse(messages[0].createdAt)}),
      });
      //console.log("messages format",recvMessages);
    //   setTestMessages(messages[0].text);
    //   console.log('whwyywywwyywy', recvMessages);
  setRecvMessages((prevState) => GiftedChat.append(prevState, messages));
};

return <GiftedChat
scrollToBottom={true}
// ref={giftedRef}
style={{alignSelf: 'flex-end'}}
// inverted={false}
renderBubble={(props)=>{
  return <Bubble
  {...props}
  wrapperStyle={{
    left: {
      backgroundColor: constants.PEACH,
    },
    right: {
      backgroundColor: constants.PEACH
    }
  }}
  textStyle={{
    right: {
      color: "white"
    },
    left: {
      color: "white"
    }
  }}
  usernameStyle={{
    color: 'white',
  }}
  timeTextStyle={{
    left: {
      color: 'white',
    },
    right: {
      color: 'white',
    },
  }}
/>
}}
//       renderTime={(props) => {
//         // console.log('time object', toDateTime(props.currentMessage.createdAt.seconds));
//         return <Text style={{color: 'white', fontSize: 12, marginRight: 10}}>{toDateTime(props.currentMessage.createdAt.seconds)}</Text>
//         // return <View style={props.containerStyle}>
//         //   <CText size={10} style={{marginHorizontal: 10, marginBottom: 5}} bold color={props.position === "left" ? 'gray' : 'white'}>
//         //     {`${props.currentMessage.createdAt.toDate().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`}
//         //   </CText>
//         // </View>
// }}
// key={route.params.data.id}
  // renderSystemMessage={(props) => {
  //   //console.log("SYSTEM MESSAGE PROPS", props);
  //   return (
  //     <TouchableOpacity
  //       onPress={() => {
  //         navigation.navigate('Info', {
  //           openId: props.currentMessage.openId,
  //         });
  //       }}>
  //       <View
  //         style={{
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           //borderWidth: 1,
  //           shadowOpacity: 0.2,
  //           shadowOffset: {height: 5, width: 2},
  //           backgroundColor: '#22a',
  //           borderRadius: 2,
  //           paddingRight: 15,
  //           paddingLeft: 15,
  //           paddingTop: 10,
  //           paddingBottom: 10,
  //           alignSelf: 'center',
  //           marginBottom: 10,

  //           width: '75%',
  //         }}>
  //         <Text style={{textAlign: 'center', color: 'white'}}>
  //           {props.currentMessage.text}
  //         </Text>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // }}
  messages={recvMessages}
  renderUsernameOnMessage={true}
  onSend={onSend}
  user={{_id: au.currentUser.uid, name: "@"+au.currentUser.displayName, avatar: au.currentUser.photoURL || constants.PLACEHOLDER_IMAGE}}
/>

}

export default ChatComponent;