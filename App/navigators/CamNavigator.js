import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import CamScreenNew from 'App/screens/camera/CamScreenNew';
import CamScreenTwo from 'App/screens/camera/CamScreenTwo';
import CamScreen3 from 'App/screens/camera/CamScreen3';

import ViewPictures from 'App/screens/camera/ViewPictures';
import SelectedPicture from 'App/screens/camera/SelectedPicture';

const Stack = createStackNavigator();

const CamNavigator = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}>
			<Stack.Screen
				name="Add Video"
				component={CamScreenNew}
				options={{animationEnabled: false}}
			/>
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
			<Stack.Screen name="Select" component={SelectedPicture} />
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
