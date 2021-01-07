import React, {useState} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Button, Modal, TextInput} from 'react-native';
import stripe from 'tipsi-stripe';
import {PaymentCardTextField} from 'tipsi-stripe';

const Checkout = ({navigation, route}) => {
    const [shipModal, setShipModal] = useState(false);
    const [billModal, setBillModal] = useState(false);

    const [info, setInfo] = useState({
        // mandatory
        number: '4242424242424242',
        expMonth: 11,
        expYear: 17,
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
        <View>
            {route.params.extra}
        </View>
        <View>
            <TouchableOpacity onPress={()=>{
                setShipModal(true);
            }}><Text>Shipping information</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{
                setBillModal(true);
            }}><Text>Billing information</Text></TouchableOpacity>
        </View>
        <Modal visible={shipModal} ><TouchableOpacity style={{width: '100%', height: 100, backgroundColor: 'black'}} onPress={()=>{setShipModal(false)}}></TouchableOpacity></Modal>
        <BillingModal visible={billModal} close={()=>setBillModal(false)} state={info} setState={setInfo} />
        
        <Button title="done" onPress={async ()=>{
            // route.params.doneFunc();
            const token = await stripe.createTokenWithCard({
                number: '4242424242424242',
                expMonth: 11,
                expYear: 23,
                cvc: '223',
            });
            console.log(token);
            console.log('done');
        }} />
        <Button title="back" onPress = {()=>{navigation.goBack()}}/>
    </SafeAreaView>
};

const validateCard = (cardNumber) => {
    
    // Drop the last digit from the number. The last digit is what we want to check against
    // Reverse the numbers
    // Multiply the digits in odd positions (1, 3, 5, etc.) by 2 and subtract 9 to all any result higher than 9
    // Add all the numbers together
    // The check digit (the last number of the card) is the amount that you would need to add to get a multiple of 10 (Modulo 10)
    
    const length = cardNumber.length;
    const last = cardNumber[length-1];

    var sum = 0;
    const ar = [];
    for (var i = length - 1; i >= 0; i--) {
        ar.push(cardNumber[i]);
    }
    for (var i = 0; i < length; i++) {
        if (i % 2 == 0) {
            var inter = 2 * cardNumber[i];
            if (inter > 9) inter -= 9;
            sum += inter;
        } else {
            sum += cardNumber[i];
        }
    }
    const result = sum % 10;
    return result == last;
}

const BillingModal = ({visible, close, state, setState}) => {
    const [cardNumber, setCardNumber] = useState('');
    const [exp, setExp] = useState('');
    const [sec, setSec] = useState('');
    return <>
    <TouchableOpacity onPress={()=>close()} style={{position: 'absolute', top:0, height: visible?1000:0, width: '100%', backgroundColor: 'black', opacity: 0.4, zIndex: 30}} />
    <Modal style={{position: 'absolute', bottom: 0, zIndex: 20}} animationType="slide" transparent={true} visible={visible} >
        
    <TouchableOpacity onPress={()=>close()} style={{position: 'absolute', top:0, height: visible?1000:0, width: '100%', zIndex: 30}} />
        <View style={{position: 'absolute', bottom: 0, width: '100%', height: '50%', paddingLeft: 30, paddingRight: 30, borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor:'white', zIndex: 50}}>
            <Text style={{marginLeft: 10}}>Card</Text>
            <PaymentCardTextField style={{color: 'black', borderWidth: 1, borderRadius: 30}} />
            <Text style={{marginLeft: 10}}>Full Name</Text>
            <TextInput style={{borderWidth: 1, borderRadius: 30, padding: 10, paddingBottom: 10, paddingTop: 10, fontSize: 18}} />
            <TouchableOpacity style={{width: '100%', height: 100, }} onPress={()=>{
                 // if (!(validateCard(cardNumber(cardNumber)) && validateExp(expMonth, expYear)))
                setState({...state, number: cardNumber, expMonth: '6', expYear: '23', cvc: '223'});
                close();
                }}><Text>close</Text></TouchableOpacity>
            </View>
            </Modal>
            </>
}


export default Checkout;