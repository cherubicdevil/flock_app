import React, {useState} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Button, Modal, TextInput} from 'react-native';
import stripe from 'tipsi-stripe';

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
    </SafeAreaView>
};

const BillingModal = ({visible, close, state, setState}) => {
    const [cardNumber, setCardNumber] = useState('');
    const [exp, setExp] = useState('');
    const [sec, setSec] = useState('');
    return <>
    <Modal style={{position: 'absolute', bottom: 0, zIndex: 20}} animationType="slide" transparent visible={visible} >
        <View style={{position: 'absolute', bottom: 0, width: '100%', height: '50%',}}>
            <View><TextInput value={cardNumber} onChangeText={(text)=>{setCardNumber(text)}}/><Text>Card</Text></View>
            <View><TextInput value={exp} onChangeText={(text)=>{setExp(text)}}/><Text>exp</Text></View>
            <View><TextInput value={sec} onChangeText={(text)=>{setSec(text)}}/><Text>SEC</Text></View>
        <TouchableOpacity style={{width: '100%', height: 100, backgroundColor: 'red'}} onPress={async ()=>{

        }}></TouchableOpacity>
            <TouchableOpacity style={{width: '100%', height: 100, }} onPress={close}><Text>close</Text></TouchableOpacity>
            </View>
            </Modal></>
}


export default Checkout;