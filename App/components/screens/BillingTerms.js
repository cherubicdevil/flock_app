import React from 'react';
import {View, TouchableOpacity, Button, Text} from 'react-native';

const BillingTerms = ({navigation}) => {
    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: '5%'}}>
        <Text>Flock uses Stripe to link your credit card</Text>

        <Text>Secure</Text>
        <Text>Encryption helps protect your personal financial data</Text>

        <Text>Private</Text>
        <Text>Your credentials will never be made accessible to Flock</Text>
        <View style={{position: 'absolute', bottom: '20%'}}>

            <Text style={{fontSize: 10}}>
                By pressing "Continue", you agree to the <Text>Stripe End User Privacy Policy</Text>
            </Text>
        <TouchableOpacity style={{marginTop: 30}} title="click me" onPress={()=>{
        navigation.goBack();
    }} >
        <Text>Continue</Text>
        </TouchableOpacity>
        </View>
        </View>
}

export default BillingTerms;