/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default class Myform extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TextInput
        placeholder="Phone Number, Username, or Email"
        style={styles.input}
        />
        <TextInput
        placeholder="Password"
        style={styles.input}
        />
        <TouchableOpacity style={styles.buttoncontainer}>
          <Text style={styles.buttontext} >Sign Up</Text>
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
    backgroundColor: '#ffff',
    paddingLeft: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttoncontainer: {
    backgroundColor: '#459ff3',
    paddingVertical: 15,
    borderRadius: 5,
  },
  buttontext: {
    textAlign: 'center',
    color: '#ffff',
    fontWeight: 'bold',
  },
});
