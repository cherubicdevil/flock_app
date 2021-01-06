import React from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Button } from 'react-native';

const Checkout = ({navigation, route}) => {
    
    return <View>
        <View>
            {route.params.extra}
        </View>
    </View>
};

export default Checkout;