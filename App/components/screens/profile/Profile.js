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
import {PaymentCardTextField} from 'tipsi-stripe';
import Icon from 'react-native-vector-icons/FontAwesome';
import AnimatedModal from 'App/components/AnimatedModal';
import ImagePicker from 'react-native-image-picker';
import {constants} from 'App/constants';
import LinearGradient from 'react-native-linear-gradient';
//import Input from 'App/components/common/Input';
import {firebase, auth, db} from 'App/firebase/config';
import OptionsModal from 'App/navigators/OptionsModal';
import {useDispatch} from 'react-redux';
// FLOCK_TODO: make this into an npm module so I don't have to put it here.
//import Base64 from 'base-64';

// global.atob = Base64.encode;

const ProfilePicture = ({setOpenModal}) => {

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
      <View
      borderRadius={60}
      resizeMode='cover'
        style={{
          // alignSelf: 'flex-start',
          marginLeft: 30,
          width: 120,
          height: 120,
          // borderRadius: 60,
          borderWidth:2,
          borderColor: constants.LAVENDER,
          overflow: 'hidden',
          borderRadius: 100,
          zIndex: 400,
          // justifyContent: 'center',
        }}>
        <Image
          style={{width: 120, height: 120, borderRadius: 60, }}
          source={avatar}
          defaultSource={constants.PLACEHOLDER_IMAGE}
        />
        {/* <View style={{position: 'absolute', bottom: 20, zIndex: -200, height: 20, backgroundColor: 'yellow', width: '100%', overflow: 'hidden'}}> */}

        {/* </View> */}
        <TouchableOpacity
        style={{position: 'absolute', height: 20, width: '100%', justifyContent: 'center', bottom: 0, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.4)'}}
          onPress={() => {
            setOpenModal(true);
            //ImagePicker.showImagePicker(options, getResponse);
          }}>
          <Text style={{textAlign: 'center', color: 'rgba(255,50,0,1)'}}>
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
  const [openModal, setOpenModal] = useState(false);
  const [billModal, setBillModal] = useState(false);
  const [shipModal, setShipModal] = useState(false);

  const [changed, setChanged] = useState(false);

  const [info, setInfo] = useState({
    // mandatory
    number: '4000000000000077',
    expMonth: 11,
    expYear: 23,
    cvc: '223',
    // optional
    name: 'Test User',
    currency: 'usd',
    addressLine1: '123 Test Street',
    addressLine2: 'Apt. 5',
    addressCity: 'Test City',
    addressState: 'Test State',
    addressCountry: 'Test Country',
    addressZip: '55555',
  });

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

  // const [modalOpen, setModalOpen] = useState(false);

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
    <>
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
    <SafeAreaView style={{flex: 1, paddingLeft: 30, paddingRight: 20, backgroundColor: constants.PINK_BACKGROUND}}>
      <ScrollView style={{paddingTop: 20}}>
        <Text style={{fontSize: 24, textAlign: 'center', marginBottom: 20}}>
          Edit Profile
        </Text>
        <View style={{flexDirection: 'row'}}>
        <ProfilePicture setOpenModal={setOpenModal} />

        <View style={{flex: 1, marginLeft: 20, justifyContent: 'flex-start'}}>
          {/* {renderFormBoxes()} */}
          {renderFormBox(0.5, "Username", "username", "username", username, setUserName)}
          {/* {renderFormBox(0.5, "email", "test", "test", email, setEmail)} */}
          {renderFormBox(0.5, "Bio", "bio", "bio", bio, setBio, 2)}
        </View>
        </View>
        <View style={{flex: 1, marginTop: 20,}} >
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
            <TouchableOpacity 
            style={{marginRight: 10,width: '100%', justifyContent: 'space-between', flexDirection:'row'}}
            onPress={()=>{
                setBillModal(true);
            }}><Text>Billing information</Text>
            <Icon name="chevron-right" size={20} />
            </TouchableOpacity>
        </View>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
            <TouchableOpacity 
            style={{marginRight: 10,width: '100%', justifyContent: 'space-between', flexDirection:'row'}}
            onPress={()=>{
                setBillModal(true);
            }}><Text>Shipping information</Text>
            <Icon name="chevron-right" size={20} />
            </TouchableOpacity>
        </View>
        </View>
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
              user.reload();
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
    <AnimatedModal colored={true} colors={[constants.ORANGE, constants.GREYORANGE]} visible={billModal} close={()=>setBillModal(false)} state={info} setState={setInfo} content={<BillingModal state={info} setState={setInfo} setChanged={setChanged} close={()=>setBillModal(false)}/>}/>
        <AnimatedModal colored={true} colors={[constants.ORANGE, constants.GREYORANGE]} visible={shipModal} close={()=>setShipModal(false)} state={info} setState={setInfo} content={<ShippingModal state={info} setState={setInfo} setChanged={setChanged} close={()=>setShipModal(false)}/>}/>
    </>
  );
};

const BillingModal = ({state, setState, close, setChanged}) => {
  const [localState, setLocalState] = useState(state);
  // const [cardNumber, setCardNumber] = useState('');
  // const [expMonth, setExpMonth] = useState('');
  // const [expYear, setExpYear] = useState('');
  // const [sec, setSec] = useState('');
  
  // const [name, setName] = useState('');
  const [valid, setValid] = useState(false);
  const [error, setError] = useState(false);

  const placeholderColor = localState.number === ''?'grey':'black';
  const numberPlaceholder= localState.number=== ''?'4242424242424242':localState.number;
  const expirationPlaceholder = localState.expMonth === ''?"MM/YY":localState.expMonth+"/"+localState.expYear;
  return <ScrollView style={{paddingLeft: 30, paddingRight: 30, borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor:'white', zIndex: 50}}>
         <Text style={{color: 'red', opacity: error?1:0}}>Please review your information for errors</Text>
         <Text style={{alignSelf: 'center',fontSize: 15, fontFamily: constants.FONT, fontWeight: 'bold'}}>Billing Information</Text>
          <Text style={{marginLeft: 10, marginTop: 10, marginBottom: 5}}>Card</Text>
          <PaymentCardTextField style={[styles.textbox,{marginTop: 0, }]} 
          onParamsChange={(valid, params) => {
              // setValid(valid);
              // setCardNumber(params.number);
              // setSec(params.cvc);
              // setExpMonth(params.expMonth);
              // setExpYear(params.expYear);
              if (valid) {
                  setValid(true);
                  setLocalState({
                      ...localState,
                      ...params
                  })
              } else {
                  setValid(false);
              }
          }}
          />
          <Text style={{marginLeft: 10, marginTop: 10, marginBottom: 5}}>Full Name</Text>
          <TextInput defaultValue={localState.name} onChangeText={(text)=> {
              localState.name = text;
          }} style={styles.textbox} />
          <TouchableOpacity style={{marginTop:30, borderRadius: 40, overflow: 'hidden',  height: 35, width: "100%", alignSelf:'center', backgroundColor:constants.ORANGE, justifyContent:'center', alignItems: 'center', borderRadius:30}} onPress={()=>{
               // if (!(validateCard(cardNumber(cardNumber)) && validateExp(expMonth, expYear)))
              // valid = true;
               if (!valid) {
                  setError(true);
                  console.log('error');
                  return;
              }
              setState(localState);
              setChanged(true);
              close();
              }}>
                  <LinearGradient style={{width: '100%', height: '100%',
                  justifyContent: 'center', alignItems: 'center',}}
                  colors={[constants.YELLOW, constants.ORANGE]}
                  start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
                  >
                  <Text style={{color: 'white'}}>confirm</Text>
                  </LinearGradient>
                  </TouchableOpacity>
              
          </ScrollView>
          
}

const ShippingModal = ({state, setState, close, setChanged}) => {
  const [localState, setLocalState] = useState(state);
  // const [cardNumber, setCardNumber] = useState('');
  // const [expMonth, setExpMonth] = useState('');
  // const [expYear, setExpYear] = useState('');
  // const [sec, setSec] = useState('');
  
  // const [name, setName] = useState('');
  var valid = false;
  const [error, setError] = useState(false);
  return <View style={{paddingLeft: 30, paddingRight: 30, borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor:'white', zIndex: 50}}>
          <Text style={{alignSelf: 'center',fontSize: 15, fontFamily: constants.FONT, fontWeight: 'bold'}}>Shipping Address</Text>
          <Text style={{color: 'red', opacity: error?1:0}}>Please review your information for errors</Text>
          <Text style={{marginLeft: 10, marginTop: 10, marginBottom: 5}}>Full Name</Text>
          <TextInput defaultValue={localState.name} onChangeText={(text)=> {
              localState.name = text;
          }} style={styles.textbox} />
          <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>Address</Text>
          <TextInput defaultValue={localState.addressLine1} onChangeText={(text)=> {
              localState.addressLine1 = text;
          }} style={styles.textbox} />

          <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
              <View style={{flex: 1, marginRight: 20}}>
          <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>City</Text>
          <TextInput defaultValue={localState.addressCity} onChangeText={(text)=> {
              localState.addressCity = text;
          }} style={styles.textbox} />
                      </View>
                      <View >
                      <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>State</Text>
          <TextInput defaultValue={localState.addressState} onChangeText={(text)=> {
              localState.addressState = text;
          }} style={styles.textbox} />
                      </View>
                      {/* <View>
                      <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>Country</Text>
          <TextInput defaultValue={localState.addressCountry} onChangeText={(text)=> {
              localState.addressCountry = text;
          }} style={styles.textbox} />
          </View> */}
          </View>            
          <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>Zip Code</Text>
          <TextInput defaultValue={localState.addressZip} onChangeText={(text)=> {
              localState.addressZip = text;
          }} style={styles.textbox} />

          <TouchableOpacity style={{marginTop:30, borderRadius: 40, overflow: 'hidden',  height: 35, width: "100%", alignSelf:'center', backgroundColor:constants.ORANGE, justifyContent:'center', alignItems: 'center', borderRadius:30}} onPress={()=>{
               // if (!(validateCard(cardNumber(cardNumber)) && validateExp(expMonth, expYear)))
              valid = true;
               if (!valid) {
                  setError(true);
                  console.log('error');
                  return;
              }
              setState(localState);
              setChanged(true);
              close();
              }}>
                  <LinearGradient style={{width: '100%', height: '100%',
                  justifyContent: 'center', alignItems: 'center',}}
                  colors={[constants.YELLOW, constants.ORANGE]}
                  start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
                  >
                  <Text style={{color: 'white'}}>confirm</Text>
                  </LinearGradient>
                  </TouchableOpacity>
              
          </View>
          
}

const styles = StyleSheet.create({
  inputStyle: {
    fontSize: 14,
    padding: 5,
    borderRadius: 3,
    borderWidth: 1,
  },
  textbox: {borderWidth: 1, borderColor: constants.DARKGREY, borderRadius: 30, padding: 10, paddingBottom: 10, paddingTop: 10, fontSize: 18},
  row: {width: '100%', marginLeft: 10, borderBottomWidth: 2, borderColor: constants.PINK_BACKGROUND,paddingHorizontal:20, paddingVertical:20},
});

export default Profile;
