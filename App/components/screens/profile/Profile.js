import React, {useState, useRef, useEffect} from 'react';
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
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {constants} from 'App/constants';
//import Input from 'App/components/common/Input';
import {firebase, auth, db} from 'App/firebase/config';
import OptionsModal from 'App/navigators/OptionsModal';
import {useDispatch} from 'react-redux';
// FLOCK_TODO: make this into an npm module so I don't have to put it here.
//import Base64 from 'base-64';

// global.atob = Base64.encode;

const ProfilePicture = () => {

  const user = firebase.auth().currentUser;
  const options = {
    //customButtons: [{name: 'fb', title: 'Choose Photo From Facebook'}],
    maxWidth: 512,
    maxHeight: 512,
  };
  const [avatar, setAvatar] = useState({
    //user.photoUrl,
    uri: user.photoURL || '',
  });
  const [openModal, setOpenModal] = useState(false);

  const getResponse = (response) => {
    //console.log('Response = ', response);

    console.log('launchgin before');
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      console.log('launching inside');
      console.log(response.uri);
      uploadImage(response);

      setAvatar({uri: response.uri});
    }
  };
  //ImagePicker.launchImageLibrary(options, getResponse);
  return (
    <View style={{zIndex: 300}}>
      <OptionsModal
        style={{zIndex: 300}}
        text1="Take Photo"
        text2="Choose from Library"
        func1={() => {
          ImagePicker.launchCamera(options, getResponse);
        }}
        func2={() => {
          console.log('launcghin');
          ImagePicker.launchImageLibrary(options, getResponse);
        }}
        toggleFunc={() => {
          setOpenModal(false);
        }}
        modalVisible={openModal}
      />
      <View
        style={{
          // alignSelf: 'flex-start',
          marginLeft: 30,
          width: 120,
          height: 120,
          borderRadius: 60,
        }}>
        <Image
          style={{width: 120, height: 120, borderRadius: 60}}
          source={avatar}
        />
        <TouchableOpacity
          onPress={() => {
            setOpenModal(true);
            //ImagePicker.showImagePicker(options, getResponse);
          }}>
          <Text style={{textAlign: 'center', color: constants.RED}}>
            Change
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
function urlToBlob(url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onerror = reject;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve(xhr.response);
      }
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob'; // convert type
    xhr.send();
  });
}

const uploadImage = async ({data, filename, uri}) => {
  const user = firebase.auth().currentUser;
  if (typeof global.atob === 'undefined') {
    global.atob = (a) => Buffer.from(a, 'base64').toString('binary');
  }

  const metadata = {
    contentType: 'image/jpeg',
  };
  const ext = uri.split('.').pop();
  const name = uri.split('/').pop();
  const path = `${user.uid}_${name}`;
  const storageRef = firebase.storage().ref(`profiles/${path}`);

  // var url = 'data:image/jpeg;base64,' + data;
  // var blob = Base64.decode(data, 0);
  // console.log(blob);
  // storageRef.put(blob, metadata);
  // fetch(url)
  // 	.then((res) => {
  // 		//console.log(res);
  // 		const blob = res.blob();
  // 		console.log(blob);
  // 		// for (i = 0; i < 10; i++) {
  // 		// 	console.log(blob[i]);
  // 		// }
  // 		const blob
  // 		storageRef.put(blob.__data);
  // 	})
  // 	.then(console.log);
  //console.log(data.substring(0, 20));
  const dataURL = 'data:image/jpeg;base64,' + data;
  urlToBlob(dataURL).then((blob) => {
    storageRef
      .put(blob)
      .then(function (snapshot) {
        const downloadURL = snapshot.ref.getDownloadURL().then((link) => {
          console.log('link: ', link);
          user.updateProfile({photoURL: link});
        });
      })
      .then(() => console.log('SUCESS'));
  });

  // storageRef
  // 	.putString(data.trim(), 'base64', metadata)
  // 	.then(function (snapshot) {
  // 		const downloadURL = snapshot.ref.getDownloadURL().then((link) => {
  // 			console.log('link: ', link);
  // 			user.updateProfile({photoURL: link});
  // 		});

  // 		//

  // 		console.log('SUCCESSSSS');
  // 	});
};

const Profile = ({navigation}) => {
  const dispatch = useDispatch();
  const user = firebase.auth().currentUser;
  const settings = {
    username: {
      placeholder: 'Username',
      label: 'I want to be known as @',
      ref: useRef(user.displayName),
      state: useState(user.displayName),
      defaultValue: user.displayName,
      flex: 1,
    },

    bio: {
      placeholder: 'Bio',
      label: 'About me',
      ref: useRef(null),
      defaultValue: null,
      flex: 0.26,
    },
    age: {
      placeholder: 'Age',
      label: 'My age is',
      ref: useRef(null),
      defaultValue: null,
      flex: 0.25,
    },
    gender: {
      placeholder: 'Gender',
      label: 'I identify as',
      ref: useRef(null),
      defaultValue: null,
      flex: 0.3,
    },
  };
  const bioRef = useRef(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [username, setUserName] = useState(user.displayName || '');
  const [email, setEmail] = useState(user.email || '');
  const [bio, setBio] = useState("")
  //settings.username.ref.current = user.displayName;
  console.log('my ref', settings.username.ref.current);
  //console.log('photoURL', user.photoURL);
  const renderFormBox = (flex, label, defaultValue, placeholder, state, setState, numberOfLines=1) => {
    return (
      <View
        style={{
          //borderBottomWidth: 1,
          marginRight: 20,
          borderColor: constants.GREY,
          alignItems: 'center',
          // height: 80,
          // flexDirection: 'row',
          // backgroundColor: constants.BGGREY,
        }}>
        <Text
          style={{
            //fontVariant: ['tabular-nums'],
            fontFamily: 'Nunito-Light',
            alignSelf: 'flex-start',
            marginLeft: 10,
            marginTop: 10,
            flex: flex,
          }}>
          {label}
        </Text>
        <TextInput
        numberOfLines={numberOfLines}
          defaultValue={defaultValue}
          placeholder={placeholder}
          value = {state}
          onChangeText={(text) => {
            setState(text);
          }}
          style={{
            //margin: 10,
            width: '100%',
            paddingTop: 8,
            paddingBottom: 8,
            flex: 1,
            paddingLeft: 10,
            borderRadius: 40,
            backgroundColor: 'white',
          }}
        />
      </View>
    );
  }
  const renderFormBoxes = () => {
    return Object.entries(settings).map(([key, item]) => {
      return (
        <View
          style={{
            //borderBottomWidth: 1,
            borderColor: constants.GREY,
            alignItems: 'center',
            height: 40,
            flexDirection: 'row',
            backgroundColor: constants.BGGREY,
          }}>
          <Text
            style={{
              //fontVariant: ['tabular-nums'],
              fontFamily: 'Nunito-Light',

              flex: item.flex,
            }}>
            {item.label}
          </Text>
          <TextInput
            defaultValue={item.defaultValue}
            placeholder={item.placeholder}
            style={{
              //margin: 10,
              paddingTop: 8,
              paddingBottom: 8,
              flex: 1,
              paddingLeft: 10,
              borderRadius: 10,
              backgroundColor: constants.GREY,
            }}
            onBlur={(event)=>{
              setevent.nativeEvent.text
            }}
            ref={item.ref}
          />
        </View>
      );
    });
  };
  useEffect(() => {}, []);
  return (
    <SafeAreaView style={{flex: 1, paddingLeft: 30, paddingRight: 20, backgroundColor: constants.PINK_BACKGROUND}}>
      <ScrollView style={{paddingTop: 20}}>
        <Text style={{fontSize: 24, textAlign: 'center', marginBottom: 20}}>
          Edit Profile
        </Text>
        <View style={{flexDirection: 'row'}}>
        <ProfilePicture />

        <View style={{flex: 1, marginLeft: 20, justifyContent: 'flex-start'}}>
          {/* {renderFormBoxes()} */}
          {renderFormBox(0.5, "Username", "username", "username", username, setUserName)}
          {/* {renderFormBox(0.5, "email", "test", "test", email, setEmail)} */}
          {renderFormBox(0.5, "Bio", "bio", "bio", bio, setBio, 2)}
        </View>
        </View>
        <View style={{flex: 1}} />
        <View style={{justifyContent: 'center', flexDirection: 'row', marginTop: 50}}>
          <TouchableOpacity
            style={{
              width: 80,
              margin: 10,
              borderRadius: 20,

              padding: 5,
              // borderWidth: 2,
              paddingTop: 3,
              // borderColor: '#aaa',
              backgroundColor: '#d8d8d8',
            }}
            onPress={() => navigation.goBack()}
            title="logout">
            <Text
              style={{
                color: '#000',
                textAlign: 'center',
                fontFamily: 'Nunito-Bold',
              }}>
              Done
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            title="update"
            style={{
              width: 80,
              margin: 10,
              borderRadius: 20,
              //borderWidth: 2,
              padding: 5,
              borderColor: 'white',
              backgroundColor: constants.ORANGE,
            }}
            onPress={() => {
              user.updateProfile({displayName: username});
              user.updateEmail(email);
              // update bio
              dispatch({type:'UPDATE_DATA', payload: ["bio", null, null, bio]});
              db.collection('users').doc(auth.currentUser.uid).update({
                bio: bio,
              });
              console.log("updated", username, email)
            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontFamily: 'Nunito-Bold',
              }}>
              Update
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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

export default Profile;
