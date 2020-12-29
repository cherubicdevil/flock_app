import React from 'react';
import {View, Text, TextInput} from 'react-native';
import ProgressHeader from 'App/components/ProgressHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const StartFlock = ({navigation, route}) => {
    const Tab = createMaterialTopTabNavigator();
    console.log('start flock index is', route.params);
    var ar = [<PageOne />, <PageTwo />, <PageThree />, <PageFour />];
    return <View><ProgressHeader
    nextRoute="StartFlock"
    headerText="Start a Flock"
    goBack={true}
    navigation={navigation}
    index={route.params.index}
    number={4}
  />
    {ar[route.params.index]}
  </View>
}

const PageOne = () => {
    return <View style={{width:'100%', height: '100%', backgroundColor: 'black'}}><Text>Test 1</Text></View>;
}

const PageTwo = () => {
    return <Text>Test 2</Text>
}

const PageThree = () => {
    return <Text>Test 3</Text>
}

const PageFour = () => {
    return <Text>Test 4</Text>
}

export default StartFlock;