import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Login from 'App/components/screens/login/Login';
import Signup from 'App/components/screens/login/Signup';

const AuthNavigator = createStackNavigator(
  {
    Login: {screen: Login},
    Signup: {screen: Signup},
  },
  {
    initialRouteName: 'Signup',
    defaultNavigationOptions: {},
    screenOptions: {},
    headerMode: 'none',
  },
);

export default createAppContainer(AuthNavigator);
