import React, {useState, useEffect} from 'react';
import {View, Alert, Text} from 'react-native';
import AnimatedSplash from 'react-native-animated-splash-screen';
import {firebase, au} from 'App/firebase/config';
import {Provider, useDispatch} from 'react-redux';
import {createStore} from 'redux';
import { StripeProvider } from '@stripe/stripe-react-native';

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
  const [aggState, setState] = useState({isLoaded: false, loggedIn: null, userData: null});
  const [stopLoop, setStopLoop] = useState(false)
  // const [isLoaded, setIsLoaded] = useState(false);
  // const [loggedIn, setLoggedIn] = useState(null);
  // const [userData, setUserData] = useState(null);


  const select = useSelector(state=>state);
  console.log(select.auth.guest)
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
          console.log('MY USER DAT', userdat)
          setState({loggedIn: true, userData: userdat || {eggCoins: 0, likedVideos: [], customerId: 'none'}});
        }).catch();
        dispatch({type: 'guest_off'})
        
      } else {
        // setLoggedIn(false);
        setState({loggedIn: false});
        // dispatch({type: 'guest'});
      }
    });
  }, []);

  const renderContent = ()  => {
    switch (aggState.loggedIn
       || select.auth.guest
       ) {
      case true:
        console.log('IM IN')
        // if (!select.auth.guest & !aggState.loggedIn) {
          if (!select.auth.guest && !stopLoop) {
          console.log('setting USER INFO')
        dispatch({type: 'SET_USER_INFO', payload: aggState.userData});
        setStopLoop(true);
        }
        return (
          <StripeProvider
      publishableKey="pk_live_51HRYtCBCefwmKQic3Ydh5x9XYz2Ipv4Uam6O0KURXH9Db9270ZaiIaFxxk4MaudBer7ApMKmA3q2SgHaisdVMDZn00jUe8KTQo"
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
    >
              <PortalProvider>
              <Portal.Host>
                {/* <Text style={{position: 'absolute', zIndex: 500, top: 200,}}>Hello word</Text> */}
            <AppNavigator />
            </Portal.Host>
            </PortalProvider>
            </StripeProvider>
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
