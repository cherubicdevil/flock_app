//import {createStackNavigator} from 'react-navigation-stack';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {createAppContainer} from 'react-navigation';
import Home from 'App/screens/home/Home';
import Profile from 'App/screens/profile/Profile';
import CamRoot from 'App/screens/camera/CamRoot';
import CamNavigator from './CamNavigator';
import Products from 'App/screens/products/Products';
import Product from 'App/screens/products/Product1/Product';
import Egg from 'App/screens/Egg';
import VideoPage from 'App/screens/VideoPage';
import PaymentInfo from 'App/screens/PaymentInfo';
import Success from 'App/screens/Success';
import PayTest from 'App/screens/PayTest';
import ProfileMain from 'App/screens/profile/ProfileMain';
import Carousel from 'App/screens/Carousel';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigator5 = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Carousel"
        screenOptions={{
          headerShown: false,
          animationEnabled: false,
        }}>
        <Tab.Screen
          name="Carousel"
          component={Carousel}
          options={{tabBarVisible: false}}
          initialParams={{vidVisible: true}}
        />
        <Tab.Screen
          name="VideoMasonry"
          component={Home}
          initialParams={{vidVisible: false}}
        />
        <Tab.Screen
          name="Home"
          component={Home}
          initialParams={{vidVisible: false}}
        />
        <Tab.Screen
          name="CamScreen"
          component={CamNavigator}
          initialParams={{vidVisible: false}}
          option={{animationEnabled: false}}
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
        <Tab.Screen name="Egg" component={Egg} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator5;
//export default createAppContainer(AppNavigator);
