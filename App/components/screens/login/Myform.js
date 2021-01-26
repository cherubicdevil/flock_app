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

const Myform = ({registration}) => {
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
        <Text style={{fontSize: 17, color: 'white', fontFamily: constants.FONT}}>{retLogSign()}</Text>
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
          value={password}
          style={styles.input}
        />
        <TouchableOpacity style={styles.forgotcontainer}>
          {/* {renderForget()} */}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttoncontainer}
          onPress={onButtonPress}>
          <Text style={styles.buttontext}>{retLogSign()}</Text>
        </TouchableOpacity>
      </View>
    );
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    backgroundColor: '#fff',
    paddingLeft: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttoncontainer: {
    backgroundColor: '#459ff3',
    paddingVertical: 15,
    borderRadius: 5,
  },
  forgotcontainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  buttontext: {
    fontFamily: constants.FONT,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 'bold',
  },
});

const mapStateToProps = (state) => {
  return {
    email: state.auth.email,
    password: state.auth.password,
  };
};

export default Myform;
