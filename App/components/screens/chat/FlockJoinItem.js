import React, {useState} from 'react';
import {View, Text, TouchableWithoutFeedback, Image} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {constants} from 'App/constants';
import {firebase} from 'App/firebase/config';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';

const FlockJoinItem = ({data}) => {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(true);
  return (
    <View
      style={{
        borderRadius: 5,
        //width: '100%',
        marginTop: 7,
        // marginBottom: 7,
        // marginLeft: 15,
        // marginRight: 15,
        padding: 10,
        paddingLeft: 25,

        //backgroundColor: 'white',
        // shadowColor: '#000',
        // shadowOffset: {width: 0, height: 1},
        // shadowOpacity: 0.1,
        // shadowRadius: 2,
        borderBottomWidth: 0.5,
        borderBottomColor: '#999',
      }}>
      <View
        style={{
          height: 30,
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{flex: 1}}>
          <TouchableWithoutFeedback
            style={{flex: 1}}
            onPress={() => {
              setCollapsed(!collapsed);
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: 17,
                  fontFamily: constants.FONT,
                }}>
                {data.name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  marginLeft: 5,
                  marginTop: 2,
                  fontFamily: constants.FONT,
                }}>
                {data.members.length} members
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              console.log('press join');
              const db = firebase.firestore();
              const docId = db.collection('users').doc(firebase.auth().currentUser.uid).update({
                chatIds: firebase.firestore.FieldValue.arrayUnion(data.id)
              });
             dispatch({type: "UPDATE_DATA", payload: ["chatIds", "add", "array", data.id]});
             dispatch({type: "UPDATE_DATA", payload: ["chatGroups", "add", "array", data]});
            }}
            style={{
              alignSelf: 'flex-end',
              //backgroundColor: constants.BRIGHT_BLUE,
              borderWidth: 1,
              borderColor: constants.BRIGHT_BLUE,
              padding: 5,
              paddingLeft: 10,
              paddingRight: 10,
              //marginLeft: 10,
              borderRadius: 5,
            }}>
            <Text
              style={{
                fontFamily: constants.FONT_BOLD,
                color: constants.BRIGHT_BLUE,
              }}>
              Join
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Collapsible collapsed={collapsed}>
        <View style={{width: '80%'}}>
          <Text style={{fontFamily: constants.FONT}}>{data.description}</Text>
          <View style={{backgroundColor: '#ccc', padding: 5}}>
            <Text>Recent Flock Buys</Text>
            <View
              style={{flexDirection: 'row', backgroundColor: constants.GREY}}>
              <Image
                source={{uri: data.purchases[0].image}}
                style={{resizeMode: 'contain', height: 75, width: 75}}
              />
              <Text>{data.purchases[0].title}</Text>
            </View>
          </View>
        </View>
      </Collapsible>
    </View>
  );
};

export default FlockJoinItem;
