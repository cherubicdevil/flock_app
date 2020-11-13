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

const Stack = createStackNavigator();

const AppNavigator5 = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animationEnabled: false,
        }}>
        <Stack.Screen
          name="Home"
          component={Home}
          initialParams={{vidVisible: true}}
        />
        <Stack.Screen
          name="VideoMasonry"
          component={Home}
          initialParams={{vidVisible: false}}
        />
        <Stack.Screen
          name="CamScreen"
          component={CamNavigator}
          initialParams={{vidVisible: false}}
          option={{animationEnabled: false}}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          initialParams={{vidVisible: false}}
        />
        <Stack.Screen
          name="ProfileMain"
          component={ProfileMain}
          initialParams={{vidVisible: false}}
        />
        <Stack.Screen
          name="Products"
          component={Products}
          initialParams={{vidVisible: false}}
        />
        <Stack.Screen
          name="Product"
          component={Product}
          initialParams={{vidVisible: false}}
        />
        <Stack.Screen
          name="PayTest"
          component={PayTest}
          initialParams={{vidVisible: false}}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentInfo}
          initialParams={{vidVisible: false}}
        />
        <Stack.Screen
          name="Success"
          component={Success}
          initialParams={{vidVisible: false}}
        />
        <Stack.Screen name="Egg" component={Egg} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// const AppNavigator = createStackNavigator(
// 	{
// 		Home: {screen: Home},
// 		VideoMasonry: {screen: Home},
// 		Profile: {screen: Profile},
// 		CamScreen: {screen: CamNavigator},
// 		Products: {screen: Products},
// 		Product: {screen: Product},
// 		Egg: {screen: Egg},
// 		Payment: {screen: PaymentInfo},
// 		Success: {screen: Success},
// 		PayTest: {screen: PayTest},
// 	},
// 	{
// 		initialRouteName: 'Home',
// 		defaultNavigationOptions: {vidVisible: true},
// 		screenOptions: {vidVisible: true},
// 		headerMode: 'none',
// 	},
// );

export default AppNavigator5;
//export default createAppContainer(AppNavigator);
