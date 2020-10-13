import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Login from '../screens/login/Login';
import Signup from '../screens/login/Signup';
import ShareReceiver from '../screens/ShareReceiver';

const AuthNavigator = createStackNavigator(
	{
		Login: {screen: Login},
		Signup: {screen: Signup},
		ShareReceiver: {screen: ShareReceiver},
	},
	{
		initialRouteName: 'Login',
		defaultNavigationOptions: {},
		screenOptions: {},
		headerMode: 'none',
	},
);

export default createAppContainer(AuthNavigator);
