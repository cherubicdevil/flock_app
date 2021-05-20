import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const InitialScreen = ({navigation}) => {
    return <View style={{marginTop: 50, flex: 1}}>
        <Text>
            This is the initial screen.
        </Text>
        <TouchableOpacity onPress={()=>{
            navigation.navigate('Login')
        }}>
            <Text>next</Text>
        </TouchableOpacity>
        <SwipeNavigator navigation = {navigation}>

        </SwipeNavigator>
        <Text>Hello</Text>
    </View>;
}

const SwipeNavigator = ({navigation}) => {
    var navigator = 
  <Tab.Navigator
  swipeEnabled={true}
  >
    <Tab.Screen name="screen1" component = {Screen1}/>
    <Tab.Screen name="screen2" component = {Screen2}/>
</Tab.Navigator>;


return <>
{navigator}
</>;
}

const Screen1 = () => {
    return <View style={{backgroundColor:'black', flex: 1, height: 100}}>
        <Text>This is the first screen.</Text>
    </View>
}

const Screen2 = () => {
    return <View>
        <Text>This is the second screen.</Text>
    </View>
}

export default InitialScreen;