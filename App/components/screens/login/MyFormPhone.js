import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import {connect} from 'react-redux';
import {constants} from 'App/constants';
import Icon from 'react-native-vector-icons/FontAwesome';

import {Input} from './Input';
import {emailChanged, passwordChanged} from 'App/redux/actions';
import {firebase} from 'App/firebase/config';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';


const MyFormPhone = ({registration, navigation, instructions}) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [confirm, setConfirm] = useState(null);

  const [code, setCode] = useState('');
  const [loadState, setLoadState] = useState(false);
  // const [loading, setLoading] = useState(false);

  // useEffect(()=>{
  //   setLoading(false);
  // }, []);
  var submitText;
  if (confirm) {
    console.log('confirm', code.length)
    submitText = "resend code";
    if (code.length == 6) {
      console.log('six');
      submitText = "enter";
    }
  } else {
    submitText = "get entry code";
  }
  var loading = loadState;
  var instructions;
  if (confirm) {
    instructions = "Enter the code you received via text";
  }
  //  else {
  //   instructions = "Enter your phone number to receive a code to signin";
  // }
  // Handle the button press
  async function signInWithPhoneNumber() {
    auth().signInWithPhoneNumber("+1"+phone.replace("-","")).then((confirmation)=>{
      setConfirm(confirmation);
      setErrorMessage("");
      setLoadState(false);
      Keyboard.dismiss();
    }).catch((err)=>{
      if (err.code === "auth/too-many-requests") {
        setErrorMessage("Unusual login activity. Try again in a few minutes.");
      } else {
        console.log(err);
        setErrorMessage("Something went wrong.");
        setLoadState(false);
      }
    });
    setLoadState(true);
  }


  var submitFunc;

  async function confirmCode() {
    // try {
    //   await confirm.confirm(code);
    // } catch (error) {
    //   console.log('Invalid code.');
    // }
    confirm.confirm(code).then(()=>{
    }).catch(err=>{
      console.log(err);
      setErrorMessage('Invalid code.');
      setLoadState(false);
    });
    setLoadState(true);
    // console.log('confirmming');
  }

//   const onButtonPress = () => {
//     if (!registration) {
//       firebase
//         .auth()
//         .signInWithEmailAndPassword(email, password)
//         .catch((err) => {
//           console.log("this login didn't work");
//           setPassword("");
//           console.log(err);
//           if (err.code === "auth/invalid-email") {
//             setErrorMessage("Invalid email.")
//           } else if (err.code === "auth/user-not-found") {
//           setErrorMessage("No user linked to that email.");
//           } else if (err.message) {
//             setErrorMessage(err.message);
//             } else {
//             setErrorMessage("This signup didn't work!");
//             }
//         });
//     } else {
//       firebase
//         .auth()
//         .createUserWithEmailAndPassword(email, password)
//         .then((user) => {
//           console.log(user);
//           user.user.updateProfile({displayName: 'flocker_' + user.user.uid});
//           firebase
//             .firestore()
//             .collection('users')
//             .doc(user.user.uid)
//             .set({likedVideos: [], chatGroups: {}, chatIds:[], customerId: "none", bio:"", eggCoins: 300});
//         })
//         .catch(function (error) {
//           // Handle Errors here.
//           console.log('EERRRROR', error);
//           console.log(error.code, error.message);
//           console.log('This registration did not work');
//           setPassword("");
//           if (error.code === "auth/email-already-in-use"){
//             setErrorMessage("Email already in use. Log in instead.")
//           } else if (error.code === "auth/weak-password") {
//             setErrorMessage("Password must be at least 6 characters long.")
//           } else if (error.code === "auth/invalid-email") {
//             setErrorMessage("Invalid email.")
//           } else if (error.message) {
//           setErrorMessage(error.message);
//           } else {
//             setErrorMessage("This signup didn't work!");
//             }
//           // ...
//         });
//     }
//   }

//   const renderForget = () => {
//     return registration ? null : (
//       <TouchableOpacity onPress={()=> {
//         navigation.navigate("ForgotPassword");
//       }}>
//       <Text style={styles.buttontext}>Forgot Password?</Text>
//       </TouchableOpacity>
//     );
//   }
if (code.length == 6) {
  submitFunc = confirmCode;
} else {
  submitFunc = signInWithPhoneNumber;
}

// console.log('test', confirm);
// if (code.length == 6 && !loadState && confirm && errorMessage !== "Invalid code.") {
//     confirmCode();
//     var decrease = false;
// }
    return (
      <View style={styles.container}>

        <Text style={{color: 'white', marginLeft: 10, fontFamily: constants.FONT}}>{instructions}</Text>
        {/* <Text style={{fontSize: 17, marginLeft: 10, color: 'white', fontFamily: constants.FONT}}>{registration?"Create an account.":"Have an account? Login."}</Text> */}
        <Text style={{color: 'red', marginLeft: 10, fontFamily: constants.FONT}}>{errorMessage}</Text>
        {!confirm?
        <View style={[styles.input, {flexDirection: 'row', alignItems: 'center', paddingVertical:0,}]}>
            {phone.length>0?<Text style={{fontSize: 14, marginRight: 5, color: 'white'}}>+1</Text>:<></>}
        <TextInput
          label=""
          maxLength={12}
          keyboardType="numeric"
          placeholder="Enter phone number"
          onKeyPress={(event) => {
            if (event.nativeEvent.key ==="Backspace") {
              decrease = true;
            } else {
              decrease = false;
            }
          }}
          onChangeText={(text) => {
            if (text.length == 3) {
              console.log('decrease', decrease);
              if (decrease) {
                setPhone(text.substring(0,2));
              } else {
                setPhone(text+"-");
              }
            } else if (text.length == 7) {
              console.log('decrease', decrease);
              if (decrease) {
                setPhone(text.substring(0,6));
              } else {
                setPhone(text+"-");
              }
            } else {
              setPhone(text);
            }
          }}
          value={phone}
          style={{flex:1, color: 'white'}}
        />
        </View>:
        <EnterCode setCode={setCode} />
        }
        {/* <Input
          secureTextEntry
          label=""
          placeholder="password"
          onChangeText={(text)=>{
            setPassword(text);
          }}
          style={styles.input}
          value={password}
          
        /> */}

        <TouchableOpacity
          style={styles.buttoncontainer}
          onPress={submitFunc
          }>
            <LinearGradient
          colors={[registration?"#ff6009":"#728cb1", registration?constants.ORANGE:"#8a86aa"]}
          start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 30,
            zIndex: 40,
            // height: '100%',
            width: '100%',
            paddingVertical: 10,
          }}>
          <Text style={styles.submitButton}>{submitText}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <ActivityIndicator animating={loading} color="white" style={{marginTop: 10}} />
        {confirm?<TouchableOpacity onPress={()=>{
          setConfirm(null);
          setErrorMessage("");
          }}><View style={{flexDirection: 'row', alignItems: 'center'}}><Icon name="chevron-left" color="white" size={25} /><Text style={{color: 'white', marginLeft: 10}}>{phone}</Text></View></TouchableOpacity>:<></>}

        {/* <Text style={{textAlign:'center', color: constants.RED}}>{errorMessage}</Text> */}
        {/* <TouchableOpacity
          style={styles.buttoncontainer}
          onPress={confirmCode}>
            <LinearGradient
          colors={[registration?"#ff6009":"#728cb1", registration?constants.ORANGE:"#8a86aa"]}
          start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 30,
            zIndex: 40,
            // height: '100%',
            width: '100%',
            paddingVertical: 15,
          }}>
          <Text style={styles.submitButton}>confirm code</Text>
          </LinearGradient>
        </TouchableOpacity> */}
        
        <TouchableOpacity
          style={{marginTop: 10}}
          onPress={() => {
            navigation.navigate(registration?"Login":'Signup');
          }}>
          {/* <Text style={styles.buttontext}>
            {registration?"Already a flocker? Login!":"Not yet a flocker? Sign up now!"}
          </Text> */}
        </TouchableOpacity>
      </View>
    );
  }

const EnterCode = ({setCode}) =>{
    const box1 = useRef();
    const box2 = useRef();
    const box3 = useRef();
    const box4 = useRef();
    const box5 = useRef();
    const box6 = useRef();

    const [v1, setV1] = useState("");
    const [v2, setV2] = useState("");
    const [v3, setV3] = useState("");
    const [v4, setV4] = useState("");
    const [v5, setV5] = useState("");
    const [v6, setV6] = useState("");

    return <View style={{flexDirection: 'row',  justifyContent: 'space-between'}}>
        <TextInput multiline={false} numberOfLines={1} keyboardType="numeric" style={styles.smsbox} ref={box1} value={v1} maxLength={6}
        onKeyPress={(event) => {
            if (event.nativeEvent.key === "Backspace") {
                setV1("");
                
            } else {
                if (v1.length == 1) {
                    box2.current.focus();
                    setV2(event.nativeEvent.key);
                }
            }
        }}
        
        onChangeText={(text)=>{
          console.log('initial change');
          if (text.length == 6) {
            console.log('inside 6')
            const [n1,n2,n3,n4,n5,n6] = text.split("");
            console.log(n1,n2,n3,n4,n5,n6);
            setV1(n1);
            setV2(n2);
            setV3(n3);
            setV4(n4);
            setV5(n5);
            setV6(n6);
            // box1.current.blur();
            box6.current.focus();
            setCode(text)
          } else if (text.length == 2) {
            setV1(text.charAt(0));
          } else {
            setV1(text);
            setCode(text+v2+v3+v4+v5+v6);
            if (text.length == 0) {

            } else if (text.length == 1) {
                box2.current.focus();
            }
          }
        }} />
                <TextInput  keyboardType="numeric" style={styles.smsbox} ref={box2} value={v2} maxLength={1}
                        onKeyPress={(event) => {
                            if (event.nativeEvent.key === "Backspace") {
                                setV2("");
                                box1.current.focus();
                            } else {
                                if (v2.length == 1) {
                                    box3.current.focus();
                                    setV3(event.nativeEvent.key);
                                }
                            }
                        }}
                onChangeText={(text)=>{
            setV2(text);
            setCode(v1+text+v3+v4+v5+v6);
            if (text.length == 0) {
                box1.current.focus();
            } else if (text.length == 1) {
                box3.current.focus();

            }
        }} />
                <TextInput keyboardType="numeric" style={styles.smsbox} ref={box3} value={v3} maxLength={1}
                onKeyPress={(event) => {
                    if (event.nativeEvent.key === "Backspace") {
                        setV3("");
                        box2.current.focus();
                    } else {
                        if (v3.length == 1) {
                            box4.current.focus();
                            setV4(event.nativeEvent.key);
                        }
                    }
                }}
                
                onChangeText={(text)=>{
            setV3(text);
            setCode(v1+v2+text+v4+v5+v6);
            if (text.length == 0) {
                box2.current.focus();
            } else if (text.length == 1) {
                box4.current.focus();
            }
        }} />
                <TextInput keyboardType="numeric" style={styles.smsbox} ref={box4} value={v4} maxLength={1}
                onKeyPress={(event) => {
                    if (event.nativeEvent.key === "Backspace") {
                        setV4("");
                        box3.current.focus();
                    } else {
                        if (v4.length == 1) {
                            box5.current.focus();
                            setV5(event.nativeEvent.key);
                        }
                    }
                }}
                onChangeText={(text)=>{
            setV4(text);
            setCode(v1+v2+v3+text+v5+v6);
            if (text.length == 0) {
                box3.current.focus();
            } else if (text.length == 1) {
                box5.current.focus();
            }
        }} />
                <TextInput keyboardType="numeric" style={styles.smsbox} ref={box5} value={v5} maxLength={1}
                onKeyPress={(event) => {
                    if (event.nativeEvent.key === "Backspace") {
                        setV5("");
                        box4.current.focus();
                    } else {
                        if (v5.length == 1) {
                            box6.current.focus();
                            setV6(event.nativeEvent.key);
                            box6.current.blur();
                        }
                    }
                }}
                onChangeText={(text)=>{
            setV5(text);
            setCode(v1+v2+v3+v4+text+v6);
            if (text.length == 0) {
                box4.current.focus();
            } else if (text.length == 1) {
                box6.current.focus();
            }
        }} />
                <TextInput keyboardType="numeric" style={styles.smsbox} ref={box6} value={v6} maxLength={1}
                onKeyPress={(event) => {
                    if (event.nativeEvent.key === "Backspace") {
                        
                        box5.current.focus();
                        setV6("");
                        
                    }
                }}
                onBlur={()=>{
                  setCode(v1+v2+v3+v4+v5+v6);
                }}
                onChangeText={(text)=>{
            setV6(text);
            setCode(v1+v2+v3+v4+v5+text);
            console.log('changing 6');
            if (text.length == 0) {
                box5.current.focus();
            } else if (text.length == 1) {
                box6.current.blur();
            }
        }} />
    </View>
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
  },
  smsbox: {
    borderWidth:1, 
    textAlign: 'center',
    fontSize: 24,
    color: 'white',
    fontFamily: constants.FONT,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: constants.LAVENDER,
    borderRadius: 20,
    width: 50, height: 80,
    paddingVertical: 20,
    paddingHorizontal: 10,
    justifyContent: 'center', 
    alignItems: 'center'
  },
  input: {
    height: 40,
    // backgroundColor: '#fff',
    paddingLeft: 10,
    marginBottom: 10,
    backgroundColor:'rgba(255,255,255,0.2)',
  borderRadius: 35,
  },
  buttoncontainer: {
    // backgroundColor: '#ff7009',
    // paddingVertical: 15,
    borderRadius: 45,
    marginTop: 10,
  },
  forgotcontainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  submitButton: {
    fontFamily: constants.FONT,
    textAlign: 'center',
    fontSize: 17,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 'bold',
  },
  buttontext: {
    fontFamily: constants.FONT,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.9)',
    // fontWeight: 'bold',
  },
});



export default MyFormPhone;
