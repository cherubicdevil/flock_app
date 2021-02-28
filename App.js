import React from 'react';
import {View, Alert, Text} from 'react-native';
import AnimatedSplash from 'react-native-animated-splash-screen';
import {firebase, au} from 'App/firebase/config';
import {Provider} from 'react-redux';
import {createStore} from 'redux';

import AppNavigator from 'App/navigators/AppNavigator';
import AuthNavigator from 'App/navigators/AuthNavigator';
import reducers from 'App/redux/reducers';
import {fetchUserData} from './App/utils';

import {Portal} from 'react-native-paper';
import {Provider as PortalProvider} from "react-native-paper";

class App extends React.Component {
  state = {
    isLoaded: false,
    loggedIn: null,
    userData: null,
  };

  componentDidMount() {
    //firebase.firestore().collection('post').get();
    this.setState({isLoaded: true});
    au.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user).then((user) => {
          this.setState({loggedIn: true, userData: user || {eggCoins: 300, likedVideos: [], customerId: 'none'}});
        });
        
      } else {
        this.setState({loggedIn: false});
      }
    });
  }

  renderContent() {
    switch (this.state.loggedIn) {
      case true:
        return (
          <Provider
            store={createStore(reducers, {userInfo: this.state.userData})}>
              <PortalProvider>
              <Portal.Host>
                {/* <Text style={{position: 'absolute', zIndex: 500, top: 200,}}>Hello word</Text> */}
            <AppNavigator />
            </Portal.Host>
            </PortalProvider>
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
        return <View style={{height: '70%', justifyContent: 'center'}}></View>;
    }
  }
  render() {
    return (
      // <AnimatedSplash
      //   translucent={true}
      //   isLoaded={this.state.isLoaded}
      //   logoImage={require('App/Assets/Images/flockicon3.png')}
      //   backgroundColor={'#262626'}
      //   logoHeight={150}
      //   logoWidth={150}>
        <View style={{flex: 1}}>{this.renderContent()}</View>
      // </AnimatedSplash>
    );
  }
}

export default App;
