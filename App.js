import React, {useEffect, useState} from 'react';
import {View, Alert} from 'react-native';
import AnimatedSplash from 'react-native-animated-splash-screen';
import {firebase, auth} from 'App/firebase/config';
import {Provider} from 'react-redux';
import {createStore} from 'redux';

import AppNavigator from 'App/navigators/AppNavigator';
import AuthNavigator from 'App/navigators/AuthNavigator';
import reducers from 'App/redux/reducers';
import {fetchUserData} from './App/utils';

const App = () => {
  // state = {
  //   isLoaded: false,
  //   loggedIn: null,
  //   userData: null,
  // };

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userData, setUserData] = useState(null);

  // componentDidMount() {
  //   //firebase.firestore().collection('post').get();
  //   this.setState({isLoaded: true});
  //   firebase.auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       fetchUserData(user).then((user) => {
  //         this.setState({loggedIn: true, userData: user});
  //       });
        
  //     } else {
  //       this.setState({loggedIn: false});
  //     }
  //   });
  // }

  useEffect(()=> {
    setIsLoaded(true);
    auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user).then((user) => {
          setIsLoggedIn(true);
          setUserData(user);
        });
        
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  const renderContent = () => {
    switch (isLoggedIn) {
      case true:
        return (
          <Provider
            store={createStore(reducers, {userInfo: userData})}>
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
        return <View style={{height: '70%', justifyContent: 'center'}}></View>;
    }
  }

    return (
      <AnimatedSplash
        translucent={true}
        isLoaded={isLoaded}
        logoImage={require('App/Assets/Images/flockicon3.png')}
        backgroundColor={'#262626'}
        logoHeight={150}
        logoWidth={150}>
        <View style={{flex: 1}}>{renderContent()}</View>
      </AnimatedSplash>
    );
  }


export default App;
