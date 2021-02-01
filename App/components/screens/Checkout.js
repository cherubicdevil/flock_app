import React, {useState} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Button, Modal, TextInput} from 'react-native';
import stripe from 'tipsi-stripe';
import {PaymentCardTextField} from 'tipsi-stripe';
import AnimatedModal from 'App/components/AnimatedModal';
import {constants} from 'App/constants';
import HeaderGradient from '../HeaderGradient';

const Checkout = ({navigation, route}) => {
    const [shipModal, setShipModal] = useState(false);
    const [billModal, setBillModal] = useState(false);

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
    
    return <>
    <SafeAreaView style={{flex: 1,backgroundColor: constants.TRANSLUCENT}}>
        <HeaderGradient navigation={navigation} absolute={false} />

        <View style={{flex: 1, backgroundColor: constants.PINK_BACKGROUND, padding: 30,}}>
        <View>
            {route.params.extra}
        </View>
        <View style={{height: '100%', marginTop: 20}}>
            <TouchableOpacity onPress={()=>{
                setShipModal(true);
            }}><Text>Shipping information</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{
                setBillModal(true);
            }}><Text>Billing information</Text></TouchableOpacity>
                <Button title="done" onPress={async ()=>{
            // route.params.doneFunc();
            const token = await stripe.createTokenWithCard(info);
            console.log("token", token);
            const endpoint = constants.PAY_ENDPOINT + `?price=${100}&token=${token.tokenId}`;
            fetch(endpoint);
            console.log(token);
            if (route.params.doneFunc) {
                route.params.doneFunc();
            }
            console.log('done');
            navigation.navigate('Success');
        }} />
        <Button title="back" onPress = {()=>{navigation.goBack()}}/>
        
        </View>

</View>

    </SafeAreaView>
    <AnimatedModal visible={billModal} close={()=>setBillModal(false)} state={info} setState={setInfo} content={<BillingModal state={info} setState={setInfo} close={()=>setBillModal(false)}/>}/>
        <AnimatedModal visible={shipModal} close={()=>setShipModal(false)} state={info} setState={setInfo} content={<ShippingModal state={info} setState={setInfo} close={()=>setShipModal(false)}/>}/>
    </>
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

const BillingModal = ({state, setState, close}) => {
    const [localState, setLocalState] = useState(state);
    // const [cardNumber, setCardNumber] = useState('');
    // const [expMonth, setExpMonth] = useState('');
    // const [expYear, setExpYear] = useState('');
    // const [sec, setSec] = useState('');
    
    // const [name, setName] = useState('');
    const [valid, setValid] = useState(false);
    const [error, setError] = useState(false);

    const placeholderColor = localState.number === ''?'grey':'black';
    const numberPlaceholder= localState.number=== ''?'4242424242424242':localState.number;
    const expirationPlaceholder = localState.expMonth === ''?"MM/YY":localState.expMonth+"/"+localState.expYear;
    return <View style={{position: 'absolute', top: 0, width: '100%', height: '50%', paddingLeft: 30, paddingRight: 30, borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor:'white', zIndex: 50}}>
           <Text style={{color: 'red', opacity: error?1:0}}>Please review your information for errors</Text>
            <Text style={{marginLeft: 10}}>Card</Text>
            <PaymentCardTextField style={{color: 'black', borderWidth: 1, borderRadius: 30}} 
            onParamsChange={(valid, params) => {
                // setValid(valid);
                // setCardNumber(params.number);
                // setSec(params.cvc);
                // setExpMonth(params.expMonth);
                // setExpYear(params.expYear);
                if (valid) {
                    setValid(true);
                    setLocalState({
                        ...localState,
                        ...params
                    })
                } else {
                    setValid(false);
                }
            }}
            />
            <Text style={{marginLeft: 10}}>Full Name</Text>
            <TextInput defaultValue={localState.name} onChangeText={(text)=> {
                localState.name = text;
            }} style={{borderWidth: 1, borderRadius: 30, padding: 10, paddingBottom: 10, paddingTop: 10, fontSize: 18}} />
            <TouchableOpacity style={{width: '100%', height: 100, }} onPress={()=>{
                 // if (!(validateCard(cardNumber(cardNumber)) && validateExp(expMonth, expYear)))
                if (!valid || localState.name === '') {
                    setError(true);
                    return;
                }
                setState(localState);
                close();
                }}><Text>done</Text></TouchableOpacity>
                
            </View>
            
}

const ShippingModal = ({state, setState, close}) => {
    const [localState, setLocalState] = useState(state);
    // const [cardNumber, setCardNumber] = useState('');
    // const [expMonth, setExpMonth] = useState('');
    // const [expYear, setExpYear] = useState('');
    // const [sec, setSec] = useState('');
    
    // const [name, setName] = useState('');
    var valid = false;
    const [error, setError] = useState(false);
    return <View style={{position: 'absolute', top: 0, width: '100%', height: '50%', paddingLeft: 30, paddingRight: 30, borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor:'white', zIndex: 50}}>
            <Text style={{color: 'red', opacity: error?1:0}}>Please review your information for errors</Text>
            <Text style={{marginLeft: 10}}>Full Name</Text>
            <TextInput defaultValue={localState.name} onChangeText={(text)=> {
                localState.name = text;
            }} style={{borderWidth: 1, borderRadius: 30, padding: 10, paddingBottom: 10, paddingTop: 10, fontSize: 18}} />
            <Text style={{marginLeft: 10}}>Address</Text>
            <TextInput defaultValue={localState.addressLine1} onChangeText={(text)=> {
                localState.addressLine1 = text;
            }} style={{borderWidth: 1, borderRadius: 30, padding: 10, paddingBottom: 10, paddingTop: 10, fontSize: 18}} />

            <View style={{flexDirection: 'row'}}>
                <View>
            <Text style={{marginLeft: 10}}>City</Text>
            <TextInput defaultValue={localState.addressCity} onChangeText={(text)=> {
                localState.addressCity = text;
            }} style={{borderWidth: 1, borderRadius: 30, padding: 10, paddingBottom: 10, paddingTop: 10, fontSize: 18}} />
                        </View>
                        <View>
                        <Text style={{marginLeft: 10}}>State</Text>
            <TextInput defaultValue={localState.addressState} onChangeText={(text)=> {
                localState.addressState = text;
            }} style={{borderWidth: 1, borderRadius: 30, padding: 10, paddingBottom: 10, paddingTop: 10, fontSize: 18}} />
                        </View>
                        <View>
                        <Text style={{marginLeft: 10}}>Country</Text>
            <TextInput defaultValue={localState.addressCountry} onChangeText={(text)=> {
                localState.addressCountry = text;
            }} style={{borderWidth: 1, borderRadius: 30, padding: 10, paddingBottom: 10, paddingTop: 10, fontSize: 18}} />
            </View>
            </View>            
            <Text style={{marginLeft: 10}}>Zip Code</Text>
            <TextInput defaultValue={localState.addressZip} onChangeText={(text)=> {
                localState.addressZip = text;
            }} style={{borderWidth: 1, borderRadius: 30, padding: 10, paddingBottom: 10, paddingTop: 10, fontSize: 18}} />

            <TouchableOpacity style={{width: '100%', height: 100, }} onPress={()=>{
                 // if (!(validateCard(cardNumber(cardNumber)) && validateExp(expMonth, expYear)))
                valid = true;
                 if (!valid) {
                    setError(true);
                    console.log('error');
                    return;
                }
                setState(localState);
                close();
                }}><Text>done</Text></TouchableOpacity>
                
            </View>
            
}


export default Checkout;