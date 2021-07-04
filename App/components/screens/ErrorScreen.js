import React from 'react';
import {View, Text} from 'react-native';

export const ErrorScreen = ({navigation}) => {
    return <View>
        <Text>Something went wrong.</Text>

        <Button onPress={()=> {

            navigation.goBack();
        }}>
            Confirm
        </Button>
    </View>
}