import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {constants} from 'App/constants';

const Success = ({route, navigation}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', backgroundColor: constants.PINK_BACKGROUND_OPAQUE}}>
      <Image
        source={require('App/Assets/Images/checkmark.png')}
        style={{width: 50, height: 50, alignSelf: 'center'}}
      />
      <Text style={{alignSelf: 'center'}}>
        Payment processed. Item successfully reserved.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Success;
