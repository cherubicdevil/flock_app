//import {createStackNavigator} from 'react-navigation-stack';
import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SearchPage from 'App/components/screens/SearchPage';
import Carousel from 'App/components/screens/videopage/Carousel';
import Home from 'App/components/screens/home/Home';
import CamNavigator from './CamNavigator';
import Chat from 'App/components/screens/chat/Chat';
import Egg from 'App/components/screens/Egg';

import Profile from 'App/components/screens/profile/Profile';

import Products from 'App/components/screens/products/Products';
import Product from 'App/components/screens/products/Product1/Product';

import PaymentInfo from 'App/components/screens/PaymentInfo';
import Success from 'App/components/screens/Success';
import PayTest from 'App/components/screens/PayTest';
import ProfileMain from 'App/components/screens/profile/ProfileMain';

import CustomBar from './CustomBar';
import StartFlock from 'App/components/screens/StartFlock';
import ChatInterface from 'App/components/screens/chat/ChatInterface';
import Info from 'App/components/screens/chat/info/Info';
import FlockChatComplete from 'App/components/screens/FlockChatComplete';
import FlockReserve from 'App/components/screens/FlockReserve';
import Checkout from 'App/components/screens/Checkout';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigator5 = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomBar {...props} />}
        initialRouteName="Carousel"
        //initialRouteName="ProfileMain"
        screenOptions={{
          headerShown: false,
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
            tabBarVisible: false,
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
            tabBarVisible: false,
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
          name="Product"
          component={Product}
          initialParams={{vidVisible: false}}
          options={{tabBarVisible: false}}
        />
        <Tab.Screen
          name="StartFlock"
          component={StartFlock}
          initialParams={{data: {}}}
          options={{tabBarVisible: false}}
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
          component={Chat}
          options={{
            tabBarVisible: false,
            title: 'Chat',
            cap: 'eggs',
            image: require('App/Assets/Images/Goose_Egg_White.png'),
          }}
        />
        <Tab.Screen
          name="ChatInterface"
          component={ChatInterface}
          options={{
            tabBarVisible: false,
          }}
        />
        <Tab.Screen
          name="FlockChatComplete"
          component={FlockChatComplete}
          options={{
            tabBarVisible: false,
          }}
        />
        <Tab.Screen
          name="FlockReserve"
          component={FlockReserve}
          options={{
            tabBarVisible: false,
          }}
        />
          <Tab.Screen
          name="Checkout"
          component={Checkout}
          options={{
            tabBarVisible: false,
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
          name="Egg"
          component={ProfileMain}
          options={{
            title: 'ProfileMain',
            cap: 'you',
            image: require('App/Assets/Images/cute_duck_silhouette.png'),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator5;
