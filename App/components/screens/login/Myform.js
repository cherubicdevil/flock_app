import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import {constants} from 'App/constants';

import {Input} from './Input';
import {emailChanged, passwordChanged} from 'App/redux/actions';
import {firebase} from 'App/firebase/config';
import LinearGradient from 'react-native-linear-gradient';

const Myform = ({registration, navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const retLogSign = () => {
    return registration ? 'Sign Up' : 'Login';
  }

  const onButtonPress = () => {
    if (!registration) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(() => {
          console.log("this login didn't work");
          setPassword("");
          setErrorMessage("This login didn't work");
        });
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((user) => {
          console.log(user);
          user.user.updateProfile({displayName: 'flocker_' + user.user.uid});
          firebase
            .firestore()
            .collection('users')
            .doc(user.user.uid)
            .set({likedVideos: [], chatGroups: {}, chatIds:[], customerId: "none", bio:""});
        })
        .catch(function (error) {
          // Handle Errors here.
          console.log('EERRRROR', error);
          console.log('This registration did not work');
          setPassword("");
          setErrorMessage("This signup didn't work!");
          // ...
        });
    }
  }
  const renderForget = () => {
    return registration ? null : (
      <Text style={styles.buttontext}>Forgot Password?</Text>
    );
  }
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 17, marginLeft: 10, color: 'white', fontFamily: constants.FONT}}>{registration?"Create an account":"Have an account? Login."}</Text>
        <Text style={{color: 'red', fontFamily: constants.FONT}}>{errorMessage}</Text>
        <Input
          label=""
          
          placeholder="email@gmail.com"
          onChangeText={(text) => {
            setEmail(text);
          }}
          value={email}
          style={styles.input}
        
        />
        <Input
          secureTextEntry
          label=""
          placeholder="password"
          onChangeText={(text)=>{
            setPassword(text);
          }}
          style={styles.input}
          value={password}
          
        />
        <TouchableOpacity style={styles.forgotcontainer}>
          {/* {renderForget()} */}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttoncontainer}
          onPress={onButtonPress}>
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
          <Text style={styles.submitButton}>{retLogSign()}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginTop: 10}}
          onPress={() => {
            navigation.navigate(registration?"Login":'Signup');
          }}>
          <Text style={styles.buttontext}>
            {registration?"Already a flocker? Login!":"Not yet a flocker? Sign up now!"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
  },
  input: {
    height: 40,
    // backgroundColor: '#fff',
    paddingLeft: 10,
    marginBottom: 10,
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

const mapStateToProps = (state) => {
  return {
    email: state.auth.email,
    password: state.auth.password,
  };
};

export default Myform;
