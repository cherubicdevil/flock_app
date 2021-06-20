import React from 'react';
// import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from 'App/components/screens/login/Login';
import Signup from 'App/components/screens/login/Signup';
import ForgotPassword from 'App/components/screens/login/ForgotPassword';
import InitialScreen from 'App/components/screens/tutorials/InitialScreen';
import Terms from 'App/components/screens/login/Terms';
import Privacy from 'App/components/screens/login/Privacy';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return <><NavigationContainer>
    <Stack.Navigator screenOptions={{
          headerShown: false,
          // swipeEnabled:true
          // unmountOnBlur: true,
          //animationEnabled: false,
        }}>
      <Stack.Screen name="Tutorial"
          component={InitialScreen} />
      <Stack.Screen name="Login"
          component={Login} />
      <Stack.Screen name="Signup"
          component={Signup} />
      <Stack.Screen name="ForgotPassword"
          component={ForgotPassword} />
                <Stack.Screen
          name="Terms"
          component={Terms}
          options={{
            tabBarVisible: true,
          }}
        />
                <Stack.Screen
          name="Privacy"
          component={Privacy}
          options={{
            tabBarVisible: true,
          }}
        />
    </Stack.Navigator>
  </NavigationContainer>
  </>
}

// createStackNavigator(
//   {
//     Tutorial: {screen: InitialScreen},
//     Login: {screen: Login},
//     Signup: {screen: Signup},
//     ForgotPassword: {screen: ForgotPassword}
//   },
//   {
//     initialRouteName: 'Tutorial',
//     defaultNavigationOptions: {},
//     screenOptions: {},
//     headerMode: 'none',
//   },
// );

export default AuthNavigator;
// export default createAppContainer(AuthNavigator);
