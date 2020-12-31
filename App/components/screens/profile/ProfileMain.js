import React, {useState, useRef, useEffect, createRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  FlatList,
  ImageBackground,
  Dimensions,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import {constants} from 'App/constants';
//import Input from 'App/components/common/Input';
import {firebase} from 'App/firebase/config';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {getIndexOfData} from '../../../utils';
//import Base64 from 'base-64';

// global.atob = Base64.encode;

const userInfo = {
  username: 'Qrowsaki',
  bio: 'Hi I like pie. I also like pi. I am a user of flock, a flocker.',
  age: '20',
  gender: 'Male',
};

const ProfilePicture = () => {
  const user = firebase.auth().currentUser;

  const [avatar, setAvatar] = useState({
    //user.photoUrl,
    uri: '',
  });

  //ImagePicker.launchImageLibrary(options, getResponse);
  return (
    <View
      style={{
        backgroundColor: '#ddd',
        //alignSelf: 'center',
        width: 120,
        height: 120,
        borderRadius: 60,
      }}>
      <Image
        style={{width: 120, height: 120, borderRadius: 60}}
        source={avatar}
      />
    </View>
  );
};
const ProfileMain = ({navigation}) => {
  const selector = useSelector((state) => state);
  //const user = firebase.auth().currentUser;
  const Test1 = () => {
    return (
      <View
        style={{marginTop: 30, alignSelf: 'center', justifyContent: 'center'}}>
        <Image source={constants.PLACEHOLDER_IMAGE} />
        <Text
          style={{
            fontFamily: constants.FONT,
            marginTop: 10,
            width: 120,
            textAlign: 'center',
            flexWrap: 'wrap',
          }}>
          You don't have any posted clucks yet!
        </Text>
      </View>
    );
  };

  const Test2 = () => {
    var data = selector.userInfo.likedVideos;
    return (
      <>
        <FlatList
          //contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}
          numColumns={3}
          data={data}
          keyExtractor={(el) => {
            console.log(el.title);
            return el.title;
          }}
          renderItem={(el) => {
            //console.log(el.item);
            // fetchStreamableSource(el.item).then((resp) => {
            //   console.log('HELLOOOO');
            //   setResp(resp);
            //   console.log(resp);
            // });
            console.log('POSTER', el.item.poster);
            return (
              <TouchableOpacity
                onPress={() => {
                  console.log(data);
                  navigation.navigate('Carousel', {
                    scrollIndex: getIndexOfData(data, el.item),
                    array: data,
                  });
                }}>
                <Image
                  defaultSource={{uri: el.item.poster}}
                  source={{uri: el.item.poster}}
                  style={{
                    //backgroundColor: constants.LIGHTGREY,
                    borderRadius: 200,
                    borderWidth: 3,
                    borderColor: 'rgba(10,10,10,.2)',
                    margin: 5,
                    width: Dimensions.get('window').width / 3 - 10,
                    height: 200,
                  }}
                />
              </TouchableOpacity>
            );
          }}
        />
      </>
    );
  };

  useEffect(() => {}, []);
  const Tab = createMaterialTopTabNavigator();
  return (
    <View style={{flex: 1}}>
      <View style={{position: 'absolute', right: 10, top: 50, zIndex: 400}}>
        <Button
          title="back"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Button
          title="changeProfile"
          onPress={() => {
            navigation.navigate('Profile');
          }}
        />
        <Button
          title="logout"
          onPress={() => {
            firebase.auth().signOut();
            console.log('logout');
          }}
        />
      </View>
      <ImageBackground
        source={require('App/Assets/Images/Orange_Gradient_Small.png')}
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: 20,
            alignItems: 'flex-start',
            paddingLeft: 40,
          }}>
          <Text
            style={{
              paddingLeft: 25,
              fontSize: 24,
              textAlign: 'center',

              fontFamily: 'Nunito-Light',
              color: 'white',
            }}>
            Profile
          </Text>
          
          <View style={{flexDirection: 'row'}}>
            <ProfilePicture />
            <View style={{flex: 1, marginLeft: 10}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    marginRight: 10,
                    color: 'white',
                    fontFamily: 'Nunito',
                  }}>
                  {userInfo.username}
                </Text>
                <Text
                  style={{
                    marginRight: 10,
                    color: 'white',
                    fontFamily: 'Nunito',
                  }}>
                  {userInfo.age}
                </Text>
                <Text style={{color: 'white', fontFamily: 'Nunito'}}>
                  {userInfo.gender}
                </Text>
              </View>
              <Text
                style={{
                  marginTop: 10,
                  color: 'white',
                  fontFamily: 'Nunito',
                }}>
                {userInfo.bio}
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
      <View style={{flex: 2}}>
        <Tab.Navigator>
          <Tab.Screen name="posts" component={Test1} />
          <Tab.Screen name="Liked" component={Test2} />
        </Tab.Navigator>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    fontSize: 14,
    padding: 5,
    borderRadius: 3,
    borderWidth: 1,
  },
});

export default ProfileMain;
