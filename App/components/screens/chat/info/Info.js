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
// import {
//   DrawerContentScrollView,
//   DrawerItemList,
//   DrawerItem,
//   createDrawerNavigator,
//   useIsDrawerOpen,
// } from '@react-navigation/drawer';
import {firebase, db} from 'App/firebase/config';
import {useDispatch} from 'react-redux';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import BuyInfo from './BuyInfo';
import {generateUserObject} from 'App/utils';

const systemMessages = [];
const user = firebase.auth().currentUser;

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

  var partOf = false;
  const user = firebase.auth().currentUser;
  console.log("MEMBERS", route.params.data.members);
  for (const member of route.params.data.members) {
    if (user.uid === member.uid) {
      partOf = true;
      break;
    }
  }
  const dispatch = useDispatch();
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
      {partOf?<Button style={{zIndex:100, position: 'absolute', top: 200,}} title="leave" onPress={() =>{
        console.log('left');
        // FLOCK_BUG this code is repeated a lot throughout codebase
        console.log(route.params.data);
        db.collection('users').doc(firebase.auth().currentUser.uid).update({
          chatIds: firebase.firestore.FieldValue.arrayRemove(route.params.data.id)
        });
        if (route.params.data.members.length === 1) {
          db.collection('chatGroups').doc(route.params.data.id).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
        } else {
          db.collection('chatGroups').doc(route.params.data.id).update({
            chatIds: firebase.firestore.FieldValue.arrayRemove(generateUserObject(firebase.auth().currentUser.displayName, firebase.auth().currentUser.uid))
          });
        }
              dispatch({type: "UPDATE_DATA", payload: ["chatIds", "remove", "array", route.params.data.id]});
              dispatch({type: "UPDATE_DATA", payload: ["chatGroups", "remove", "array", route.params.data]});
              navigation.navigate('Carousel');
      }} />:<View style={{position: 'absolute', bottom: 0, width: '100%', height: 100, backgroundColor: 'white'}}><View style={{height: '100%', backgroundColor: constants.PINK_BACKGROUND }}><TouchableOpacity style={{width: '90%', height: 50, backgroundColor: constants.ORANGE, alignSelf: 'center', borderRadius: 30, justifyContent: 'center'}} onPress={()=>{}}><Text style={{color: 'white', alignSelf: 'center', fontWeight: 'bold'}}>JOIN</Text></TouchableOpacity></View></View>}
    </SafeAreaView>
  );
};

export default Info;
