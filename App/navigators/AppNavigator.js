//import {createStackNavigator} from 'react-navigation-stack';
import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator,CardStyleInterpolators,} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SearchPage from 'App/components/screens/SearchPage';
import Carousel from 'App/components/screens/videopage/Carousel';
import Home from 'App/components/screens/home/Home';
import CamNavigator from './CamNavigator';
import Egg from 'App/components/screens/Egg';
import Login2 from 'App/components/screens/login/Login2';
import Terms from 'App/components/screens/login/Terms';
import BillingTerms from 'App/components/screens/BillingTerms';

import Privacy from 'App/components/screens/login/Privacy';

import ShareScreen from 'App/components/screens/videopage/ShareScreen';

import Profile from 'App/components/screens/profile/Profile';

import Products from 'App/components/screens/products/Products';
import Product from 'App/components/screens/products/Product1/Product';

import PaymentInfo from 'App/components/screens/PaymentInfo';
import Success from 'App/components/screens/Success';
import PayTest from 'App/components/screens/PayTest';
import ProfileMain from 'App/components/screens/profile/ProfileMain';

import CustomBar from './CustomBar';
import StartFlock from 'App/components/screens/StartFlock';
import StartFlockNavigator from 'App/components/screens/StartFlockNavigator';
import Group from 'App/code/core/flawk/Group';
import Info from 'App/components/screens/chat/info/Info';
import FlockChatComplete from 'App/components/screens/FlockChatComplete';
import FlockReserve from 'App/components/screens/FlockReserve';
import Checkout from 'App/components/screens/Checkout';
import FlockSuccess from '../components/screens/FlockSuccess';
import {useSelector} from 'react-redux';
import { ErrorScreen } from 'App/components/screens/ErrorScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Tabs = () => {
  const select = useSelector(state => state.auth);
  return <Tab.Navigator
  tabBar={(props) => <CustomBar {...props} />}
  initialRouteName="Carousel"
  swipeEnabled={true}
  //initialRouteName="ProfileMain"
  screenOptions={{
    headerShown: false,
    // swipeEnabled:true
    // unmountOnBlur: true,
    //animationEnabled: false,
  }}>
  <Tab.Screen
    name="Carousel"
    component={Home}
    options={{
      tabBarVisible: true,
      title: 'Carousel',
      cap: 'home',
      image: require('App/Assets/Images/Home_Icon.png'),
    }}
    initialParams={{vidVisible: true, scrollIndex: 0}}
    // FLOCK_BUG when click carousel nav bar, doesn't play automatically
  />

  <Tab.Screen
    name="Home"
    component={SearchPage}
    options={{
      title: 'VideoMasonry',
      cap: 'search',
      image: require('App/Assets/Images/Magnifying_Glass.png'),
    }}
    initialParams={{vidVisible: false}}
  />
          {/* <Tab.Screen
    name="VideoMasonry"
    component={Home}
    options={{
      title: 'VideoMasonry',
      cap: 'shop',
      image: require('App/Assets/Images/Happy_Shopping_Icon.png'),
    }}
    initialParams={{vidVisible: false}}
  /> */}
  <Tab.Screen
    name="CamScreen"
    component={CamNavigator}
    initialParams={{vidVisible: false}}
    
    options={{
      unmountOnBlur:true,
      tabBarVisible: true,
      title: 'CamScreen',
      cap: 'add',
      image: require('App/Assets/Images/Add_Icon.png'),
    }}
  />
  <Tab.Screen
    name="Profile"
    component={Profile}
    initialParams={{vidVisible: false}}
    options={{
      tabBarVisible: true,
      unmountOnBlur:true,
    }}
  />
    <Tab.Screen
    name="FlockSuccess"
    component={FlockSuccess}
    initialParams={{vidVisible: false}}
    options={{
      tabBarVisible: true,

    }}
  />

  <Tab.Screen
    name="ProfileMain"
    component={ProfileMain}
    initialParams={{vidVisible: false}}
  />

  <Tab.Screen
    name="Products"
    component={Products}
    options={{animationEnabled: true, gestureEnabled: true}}
    initialParams={{vidVisible: false}}
  />


  <Tab.Screen
    name="PayTest"
    component={PayTest}
    initialParams={{vidVisible: false, index: 1}}
  />
  <Tab.Screen
    name="Payment"
    component={PaymentInfo}
    initialParams={{vidVisible: false}}
  />
  <Tab.Screen
    name="Success"
    component={Success}
    initialParams={{vidVisible: false}}
  />
  <Tab.Screen
    name="Chat"
    component={Group}
    options={{
      tabBarVisible: false,
      title: 'Chat',
      cap: 'earn',
      image: require('App/Assets/Images/Goose_Egg_White.png'),
    }}
  />


  <Tab.Screen
    name="Info"
    component={Info}
    options={{
      tabBarVisible: false,
    }}
  />
  <Tab.Screen
    name="Login2"
    component={Login2}
    options={{
      tabBarVisible: false,
      swipeEnabled: false,
      title:select.guest?'Login':undefined,
      cap: 'you',
      unmountOnBlur: true,
      image: require('App/Assets/Images/cute_duck_silhouette.png'),
    }}
    initialParams={{vidVisible: true, scrollIndex: 0}}
    // FLOCK_BUG when click carousel nav bar, doesn't play automatically
  />
  <Tab.Screen
    name="Egg"
    component={ProfileMain}
    options={{
      title: select.guest?undefined:'ProfileMain',
      cap: 'you',
      unmountOnBlur: true,
      image: require('App/Assets/Images/cute_duck_silhouette.png'),
    }}
  />
</Tab.Navigator>
}

const AppNavigator5 = () => {

  const select = useSelector(state => state.auth);
  return (
    <NavigationContainer
    screenOptions={{
      headerShown: false
    }}
    >
      <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
>
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{
            unmountOnBlur: true,
            tabBarVisible: true,
          }}
        />
        <Stack.Screen
          name="ChatInterface"
          component={Group}
          options={{
            unmountOnBlur: true,
            tabBarVisible: true,
          }}
        />
        <Stack.Screen
          name="FlockChatComplete"
          component={Group}
          options={{
            tabBarVisible: true,
          }}
        />
  <Stack.Screen
    name="ShareSocial"
    component={ShareScreen}
    // initialParams={{vidVisible: false}}
  />
      <Stack.Screen
          name="Terms"
          component={Terms}
          options={{
            tabBarVisible: true,
          }}
        />

      <Stack.Screen
          name="Privacy"
          component={Privacy}
          options={{
            tabBarVisible: true,
          }}
        />
          <Stack.Screen
    name="Product"
    component={Product}
    initialParams={{vidVisible: false}}
    options={{tabBarVisible: false,
      unmountOnBlur:true
    }}
  />
    <Stack.Screen
    name="StartFlock"
    component={StartFlockNavigator}
    
    initialParams={{data: {}}}
    options={{tabBarVisible: true,unmountOnBlur: true,}}
  />
        <Stack.Screen
          name="FlockReserve"
          component={FlockReserve}
          options={{
            tabBarVisible: false,
          }}
        />
 
        <Stack.Screen
          name="Login"
          component={Login2}
          options={{
            tabBarVisible: false,
            swipeEnabled: false,
            title:select.guest?'Login':undefined,
            cap: 'you',
            unmountOnBlur: true,
            image: require('App/Assets/Images/cute_duck_silhouette.png'),
          }}
          initialParams={{vidVisible: true, scrollIndex: 0}}
          // FLOCK_BUG when click carousel nav bar, doesn't play automatically
        />
        <Stack.Screen
        name="Disclaimer"
        component={BillingTerms}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid,
        }} />

        <Stack.Screen
        name="Error"
        component={ErrorScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid,
        }} />

<Stack.Screen
    name="Checkout"
    component={Checkout}
    options={{
      tabBarVisible: true,
      unmountOnBlur: true,
    }}
  />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator5;
