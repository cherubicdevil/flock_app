//import {createStackNavigator} from 'react-navigation-stack';
import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Carousel from 'App/screens/Carousel';
import Home from 'App/screens/home/Home';
import CamNavigator from './CamNavigator';
import Chat from 'App/screens/Chat';
import Egg from 'App/screens/Egg';

import Profile from 'App/screens/profile/Profile';

import Products from 'App/screens/products/Products';
import Product from 'App/screens/products/Product1/Product';

import PaymentInfo from 'App/screens/PaymentInfo';
import Success from 'App/screens/Success';
import PayTest from 'App/screens/PayTest';
import ProfileMain from 'App/screens/profile/ProfileMain';

import CustomBar from 'App/navigators/CustomBar';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigator5 = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomBar {...props} />}
        initialRouteName="Carousel"
        screenOptions={{
          headerShown: false,
          animationEnabled: false,
        }}>
        <Tab.Screen
          name="Carousel"
          component={Carousel}
          options={{
            tabBarVisible: false,
            title: 'Carousel',
            cap: 'play',
            image: require('App/Assets/Images/Play.png'),
          }}
          initialParams={{vidVisible: true}}
        />
        <Tab.Screen
          name="VideoMasonry"
          component={Home}
          options={{
            title: 'VideoMasonry',
            cap: 'shop',
            image: require('App/Assets/Images/Happy_Shopping_Icon.png'),
          }}
          initialParams={{vidVisible: false}}
        />
        <Tab.Screen
          name="CamScreen"
          component={CamNavigator}
          initialParams={{vidVisible: false}}
          options={{
            title: 'CamScreen',
            cap: 'add',
            image: require('App/Assets/Images/Add_Icon.png'),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          initialParams={{vidVisible: false}}
        />
        <Tab.Screen
          name="ProfileMain"
          component={ProfileMain}
          initialParams={{vidVisible: false}}
        />
        <Tab.Screen
          name="Products"
          component={Products}
          initialParams={{vidVisible: false}}
        />
        <Tab.Screen
          name="Product"
          component={Product}
          initialParams={{vidVisible: false}}
        />
        <Tab.Screen
          name="PayTest"
          component={PayTest}
          initialParams={{vidVisible: false}}
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
            title: 'Chat',
            cap: 'flocks',
            image: require('App/Assets/Images/Group_Chat_Icon.png'),
          }}
        />
        <Tab.Screen
          name="Egg"
          component={Egg}
          options={{
            title: 'Egg',
            cap: 'save',
            image: require('App/Assets/Images/Goose_Egg_White.png'),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator5;
