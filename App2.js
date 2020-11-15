/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, Text} from 'react-native';
import {firebase} from 'App/firebase/config';

const App = () => {
  firebase.firestore().collection('posts').get();
  return (
    <SafeAreaView>
      <Text>Hello world</Text>
    </SafeAreaView>
  );
};

export default App;
