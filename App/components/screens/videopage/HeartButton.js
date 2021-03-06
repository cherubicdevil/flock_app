import React, {useState, useEffect, } from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {firebase, db} from 'App/firebase/config';
import {useSelector, useDispatch} from 'react-redux';
import {constants} from 'App/constants';
import { useFocusEffect } from '@react-navigation/native';

const HeartIcon = ({data, ICON_SIZE=37, navigation}) => {
  const dispatch = useDispatch();
  const guest = useSelector(state=>state?.auth?.guest);
  
  var likes = data.likes || 0;
    const selector = useSelector((state) => state);
    //var liked = selector.userInfo.likedVideos.includes(data);
    var liked = selector.userInfo.likedVideos.some(
      (item) => item.title === data.title,
    );
    const [heartColor, setHeartColor] = useState(liked);
    useFocusEffect(() => {
      var original = liked;
      // dataRef = firebase
      //   .database()
      //   .ref('users')
      //   .child(firebase.auth().currentUser.uid)
      //   .child('likedPosts')
      //   .child(data.id)
      //   .once('value')
      //   .then(function (snapshot) {
      //     //console.log('snapshot val', snapshot.val());
      //     if (snapshot.val()) {
      //       setHeartColor(true);
      //     }
      //   });

      return () => {
        if (original == heartColor) return;
        if (heartColor) {
          dispatch({
            type: 'LIKED_VIDEO',
            payload:
              // send doc id
              data,
          });
          db.collection('chatGroups').doc(data.id).update({
            likes: firebase.firestore.FieldValue.increment(1)
        });
        } else {
          dispatch({
            type: 'DISLIKED_VIDEO',
            payload: data,
          });
          db.collection('chatGroups').doc(data.id).update({
            likes: firebase.firestore.FieldValue.increment(-1)
        });
        }



      };
    }, [heartColor]);

    return (
      <View style={{zIndex: 900}}>
        <TouchableOpacity
        hitSlop={{top: 30, bottom: 10, left: 30, right: 30}}
          onPress={() => {
            if (guest) {
              navigation.navigate('Login');
              return;
            }
            //var likes = data.likes || 0;
            var change = 1;
            if (heartColor) {
              change = -1;
            }
            likes = likes + change;

            data.likes += change;
            setHeartColor(!heartColor);
            
          }}>
          <Image
            style={{
              height: ICON_SIZE,
              width: ICON_SIZE,
              tintColor: heartColor ? constants.RED : '#fff',
              
            }}
            source={require('App/Assets/Images/Heart_Icon_White.png')}
          />
          <Text style={[styles.buttonText,{position: 'absolute',bottom: ICON_SIZE/2-10, color: heartColor?'white':'black', zIndex: 200, alignSelf: 'center'}]}>{data.likes>0?data.likes:""}</Text>
        </TouchableOpacity>
        
      </View>
    );
  };

  const styles = {
    buttonText: {
      fontFamily: 'Nunito-Light',
      textAlign: 'center',
      color: '#fff',
    },
  
    centeredView: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    modalView: {
      marginTop: 'auto',
      marginBottom: 0,
      height: '70%',
      width: '100%',
      backgroundColor: 'rgb(250,250,250)',
      borderRadius: 20,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      paddingTop: 30,
      paddingLeft: 0,
      //paddingLeft: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    openButton: {
      backgroundColor: '#999',
      marginRight: 4,
      borderRadius: 20,
      padding: 5,
      paddingTop: 3,
      paddingBottom: 3,
  
      elevation: 2,
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginTop: -20,
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
    },
    textBold: {
      fontWeight: 'bold',
      fontSize: 10,
      color: '#777',
    },
  };

  export default HeartIcon;