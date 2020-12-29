import React from 'react';
import {View, Text, TextInput} from 'react-native';
import ProgressHeader from 'App/components/ProgressHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const StartFlock = ({navigation, route}) => {
    const Tab = createMaterialTopTabNavigator();

    return <View><ProgressHeader
    nextRoute="Home"
    headerText="Start a Flock"
    goBack={true}
    navigation={navigation}
    index={2}
    number={4}
  />
    <Tab.Navigator>
    <Tab.Screen name="posts" component={Test1} />
    <Tab.Screen name="Liked" component={Test2} />
    </Tab.Navigator>
  </View>
}

const Test1 = () => {
    return <Text>Test 1</Text>
}

const Test2 = () => {
    return <Text>Test 1</Text>
}

export default StartFlock;