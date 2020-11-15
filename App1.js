import React, {Component, useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
//import firebase from 'firebase'
import {firebase} from 'App/firebase/config';
import reducers from 'App/reducers';
import {Button, CardSection, Spinner} from 'App/components/common';
import AppNavigator from 'App/navigators/AppNavigator';
import AuthNavigator from 'App/navigators/AuthNavigator';

class App extends Component {
  state = {loggedIn: null};

  componentDidMount() {
    firebase.firestore().collection('posts').get();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({loggedIn: true});
      } else {
        this.setState({loggedIn: false});
      }
    });
  }

  renderContent() {
    switch (this.state.loggedIn) {
      case true:
        return (
          <Provider store={createStore(reducers, applyMiddleware(thunk))}>
            <AppNavigator />
          </Provider>
        );
      case false:
        return (
          <Provider store={createStore(reducers)}>
            <View style={{flex: 1}}>
              <AuthNavigator />
            </View>
          </Provider>
        );
      default:
        return (
          <View style={{height: '70%', justifyContent: 'center'}}>
            <Spinner />
          </View>
        );
    }
  }

  render() {
    return <View style={{flex: 1}}>{/*this.renderContent()*/}</View>;
  }
}

export default App;
