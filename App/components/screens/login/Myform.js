import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';

import {Input} from './Input';
import {emailChanged, passwordChanged} from 'App/redux/actions';
import {firebase} from 'App/firebase/config';

class Myform extends Component {
  retLogSign() {
    return this.props.registration ? 'Sign Up' : 'Login';
  }
  onEmailChange(text) {
    this.props.emailChanged(text);
    console.log(this.props.email);
  }
  onPasswordChange(text) {
    this.props.passwordChanged(text);
    console.log(this.props.password);
  }

  onButtonPress() {
    const email = this.props.email;
    const password = this.props.password;
    //this.setState({ error: '', loading: true })
    if (!this.props.registration) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch(() => {
          console.log("this login didn't work");
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
            .set({likedVideos: [], chatGroups: {}, chatIds:[], customerId: "none"});
        })
        .catch(function (error) {
          // Handle Errors here.
          console.log('EERRRROR', error);
          console.log('This registration did not work');
          // ...
        });
    }
  }
  renderForget() {
    return this.props.registration ? null : (
      <Text style={styles.buttontext}>Forgot Password?</Text>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Input
          label=""
          placeholder="email@gmail.com"
          onChangeText={this.onEmailChange.bind(this)}
          value={this.props.email}
          style={styles.input}
        />
        <Input
          secureTextEntry
          label=""
          placeholder="password"
          onChangeText={this.onPasswordChange.bind(this)}
          value={this.props.password}
          style={styles.input}
        />
        <TouchableOpacity style={styles.forgotcontainer}>
          {this.renderForget()}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttoncontainer}
          onPress={this.onButtonPress.bind(this)}>
          <Text style={styles.buttontext}>{this.retLogSign()}</Text>
        </TouchableOpacity>
      </View>
    );
  }
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

export default connect(mapStateToProps, {emailChanged, passwordChanged})(
  Myform,
);
