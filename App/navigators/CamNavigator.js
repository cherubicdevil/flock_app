import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import CamScreenNew from 'App/components/screens/camera/CamScreenNew';
import CamScreenTwo from 'App/components/screens/camera/CamScreenTwo';
import CamScreen3 from 'App/components/screens/camera/CamScreen3';

const Stack = createStackNavigator();


const CamNavigator = ({route}) => {
  console.log('data', route.params.data);
  return (
    <Stack.Navigator
    initialRouteName="Add Video"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Add Video"
        component={CamScreenNew}
        initialParams={{data: route.params.data}}
        options={{animationEnabled: true}}
      />
      <Stack.Screen
        name="Search Product"
        component={CamScreenTwo}
        initialParams={{data: route.params.data}}
        options={{animationEnabled: true}}
      />
      <Stack.Screen
        name="Product Options"
        component={CamScreen3}
        initialParams={{data: route.params.data}}
        options={{animationEnabled: true}}
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
