import React from 'react';
import {View, TouchableOpacity, Button, Text, Linking, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const BillingTerms = ({navigation, route}) => {
    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: '10%'}}>
        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
            <Image source= {require('App/Assets/Images/stripe_lock.png')} style={{flex: 1, maxHeight: '80%', alignSelf: 'flex-start', resizeMode: 'contain'}} />
        </View>
        <View style={{flex: 3}}>
        <Text style={{fontSize: 24, textAlign:'center'}}>Flock uses <Text style={{fontWeight: 'bold'}}>Stripe</Text> to link your credit card</Text>

        <View style={{marginTop: 20, marginHorizontal: '0%'}}>
        
        <View>
        <View style={{flexDirection: 'row', alignItems:'flex-start'}}>
            <Icon name="check-circle" size={20} />
        <View>
    
        <Text style={{marginLeft: 5, fontWeight: 'bold'}}>Secure</Text>
        <Text style={{marginLeft: 5}}>Encryption helps protect your personal financial data</Text>
        </View></View>
        </View>

        <View style={{marginTop: 15}}>
        <View style={{flexDirection: 'row', alignItems:'flex-start'}}>
            <Icon name="check-circle" size={20} />
        <View>
    
        <Text style={{marginLeft: 5, fontWeight: 'bold'}}>Private</Text>
        <Text style={{marginLeft: 5}}>Your credentials will never be made acessible to Flock</Text>
        </View></View>
        </View>
        </View>
        </View>
        
        <View style={{flex: 1}}>

            <Text style={{fontSize: 12, textAlign: 'center'}}>
                By pressing "Continue", you agree to the <TouchableOpacity onPress={()=>{
                    Linking.openURL("https://stripe.com/privacy")
                }}><Text style={{fontSize: 12, textDecorationLine: 'underline',}}>Stripe End User Privacy Policy</Text></TouchableOpacity>
            </Text>
        <TouchableOpacity style={{marginTop: 30}} title="click me" onPress={()=>{
        navigation.goBack();
        if (route?.params?.after) {
        route.params.after();
        }
    }} >
        <View style={{backgroundColor: 'black', padding: '5%', borderRadius: 5, alignItems: 'center'}}>
        <Text style={{color: 'white'}}>Continue</Text>
        </View>
        </TouchableOpacity>
        </View>
        </View>
}

export default BillingTerms;