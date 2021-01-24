import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import CamScreenNew from 'App/components/screens/camera/CamScreenNew';
import CamScreenTwo from 'App/components/screens/camera/CamScreenTwo';
import CamScreen3 from 'App/components/screens/camera/CamScreen3';

const Stack = createStackNavigator();

const CamNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {/* <Stack.Screen
        name="Add Video"
        component={CamScreenNew}
        options={{animationEnabled: false}}
      /> */}
      <Stack.Screen
        name="Search Product"
        component={CamScreenTwo}
        options={{animationEnabled: false}}
      />
      <Stack.Screen
        name="Product Options"
        component={CamScreen3}
        options={{animationEnabled: false}}
      />
    </Stack.Navigator>
  );
};

// 	{
// 		Select: {screen: SelectedPicture},
// 		Gallery: {screen: CamScreen},
// 	},
// 	{
// 		initialRouteName: 'Gallery',
// 		defaultNavigationOptions: {},
// 		screenOptions: {},
// 		headerMode: 'none',
// 	},
// );

export default CamNavigator;
