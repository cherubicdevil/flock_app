import React, {useState, useEffect} from 'react';
import {View, Alert, Text} from 'react-native';
import AnimatedSplash from 'react-native-animated-splash-screen';
import {firebase, au} from 'App/firebase/config';
import {Provider, useDispatch} from 'react-redux';
import {createStore} from 'redux';

import AppNavigator from 'App/navigators/AppNavigator';
import AuthNavigator from 'App/navigators/AuthNavigator';
import reducers from 'App/redux/reducers';
import {fetchUserData} from './App/utils';
import {useSelector} from 'react-redux';

import {Portal} from 'react-native-paper';
import {Provider as PortalProvider} from "react-native-paper";

const WrapperApp = () => {
  return <Provider store={createStore(reducers)}>
    <App></App>
  </Provider>
}

const App = () => {
  const [state, setState] = useState({isLoaded: false, loggedIn: null, userData: null});

  // const [isLoaded, setIsLoaded] = useState(false);
  // const [loggedIn, setLoggedIn] = useState(null);
  // const [userData, setUserData] = useState(null);


  const select = useSelector(state=>state);
  const dispatch = useDispatch();
  useEffect(()=>{
    //firebase.firestore().collection('post').get();
    // setIsLoaded(true)
    setState({isLoaded: true});
    au.onAuthStateChanged((user) => {
      
      if (user) {
        fetchUserData(user).then((userdat) => {
          // setUserData(userdat || {eggCoins: 0, likedVideos: [], customerId: 'none'});
          // setLoggedIn(true);
          setState({loggedIn: true, userData: userdat || {eggCoins: 0, likedVideos: [], customerId: 'none'}});
        }).catch();
        
      } else {
        // setLoggedIn(false);
        setState({loggedIn: false});
      }
    });
  }, []);

  const renderContent = ()  => {
    switch (state.loggedIn || select.auth.guest) {
      case true:
        dispatch({type: 'SET_USER_INFO', payload: state.userData})
        return (
              <PortalProvider>
              <Portal.Host>
                {/* <Text style={{position: 'absolute', zIndex: 500, top: 200,}}>Hello word</Text> */}
            <AppNavigator />
            </Portal.Host>
            </PortalProvider>
        );
      case false:
        return (
            <View style={{flex: 1}}>
              <AuthNavigator />
            </View>
        );
      default:
        return <View style={{height: '70%', justifyContent: 'center'}}></View>;
    }
  }

    return (
      // <AnimatedSplash
      //   translucent={true}
      //   isLoaded={this.state.isLoaded}
      //   logoImage={require('App/Assets/Images/flockicon3.png')}
      //   backgroundColor={'#262626'}
      //   logoHeight={150}
      //   logoWidth={150}>
        <View style={{flex: 1}}>{renderContent()}</View>
      // </AnimatedSplash>
    );
  
}

export default WrapperApp;
