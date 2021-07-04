import React, {useState} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Button, Modal, TextInput} from 'react-native';

import AnimatedModal from 'App/components/AnimatedModal';
import {constants} from 'App/constants';

const Checkout = ({navigation, route,
    doneFunc = (token) => {
        const endpoint = constants.PAY_ENDPOINT + `?price=${price}&token=${token.tokenId}`;
        fetch(endpoint);
    },

}) => {

    const [shipModal, setShipModal] = useState(false);
    const [billModal, setBillModal] = useState(false);
    const [valid, setValid] = useState(false);

    const [info, setInfo] = useState({
        // mandatory
        number: '4000000000000077',
        expMonth: 11,
        expYear: 23,
        cvc: '223',
        // optional
        name: 'Test User',
        currency: 'usd',
        addressLine1: '123 Test Street',
        addressLine2: 'Apt. 5',
        addressCity: 'Test City',
        addressState: 'Test State',
        addressCountry: 'Test Country',
        addressZip: '55555',
      });
    
    return <SafeAreaView>
            <PaymentCardTextField style={{color: 'black', borderWidth: 1, borderRadius: 30}} 
            onParamsChange={(valid, params) => {
                // setValid(valid);
                // setCardNumber(params.number);
                // setSec(params.cvc);
                // setExpMonth(params.expMonth);
                // setExpYear(params.expYear);
                if (valid) {
                    setValid(true);
                    setInfo({
                        ...info,
                        ...params
                    })
                } else {
                    setValid(false);
                }
            }}
            />
            <Button title = "done" onPress={async ()=>{
                if (valid) {
                const token = await stripe.createTokenWithCard(info);
                doneFunc(token.tokenId);
                }
            }}/>
    </SafeAreaView>
};




export default Checkout;