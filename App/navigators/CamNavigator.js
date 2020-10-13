import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import CamScreen from 'App/screens/camera/CamScreen';
import ViewPictures from 'App/screens/camera/ViewPictures';
import SelectedPicture from 'App/screens/camera/SelectedPicture';

const Stack = createStackNavigator();

const CamNavigator = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Gallery" component={CamScreen} />
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
