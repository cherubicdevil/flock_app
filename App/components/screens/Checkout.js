import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Button, Modal, TextInput} from 'react-native';
import stripe from 'tipsi-stripe';
import {PaymentCardTextField} from 'tipsi-stripe';
import AnimatedModal from 'App/components/AnimatedModal';
import {constants} from 'App/constants';
import HeaderGradient from '../HeaderGradient';
import {useStore, useDispatch, useSelector} from 'react-redux';
import {firebase, auth, db} from 'App/firebase/config';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

const fetchCustomerInfo = (customerId) =>{
    return new Promise((resolve) => {
        fetch(constants.RETR_CUST+`?id=${customerId}`).then((resp)=> {
        resp.json().then((res) =>{
                resolve(res);
        })
    })
});
};
const Checkout = ({navigation, route}) => {
    const [shipModal, setShipModal] = useState(false);
    const [billModal, setBillModal] = useState(false);
    const [changed, setChanged] = useState(false);

    // const store = useStore();
    const select = useSelector(state=>state.userInfo);
    const dispatch = useDispatch();
    // const customerId = store.getState().userInfo.customerId;
    const customerId = select.customerId;
    var hasId = customerId !== undefined && customerId !== null && customerId !== "none"
    useEffect(()=>{
        if (hasId) {
            fetchCustomerInfo(customerId).then((customerInfo) =>{
                setInfo({...info, ...customerInfo});
            });
        }
    },[]);



    console.log(customerId);
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

        <View style={{flex: 1, backgroundColor: constants.PINK_BACKGROUND,}}>

        <View style={{height: '100%', marginTop: 10, }}>
            <View style={{backgroundColor: 'white', paddingVertical: 10, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, alignItems: "flex-end"}}>
            <View style={styles.row}>
            <Text style={{marginVertical: 15}}>
    {<Text style={{fontWeight: 'bold'}}>Period: </Text>}{route.params.extra}
        </Text>
        </View>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
            <TouchableOpacity
            style={{marginRight: 10, width: '100%', justifyContent: 'space-between', flexDirection:'row'}}
            onPress={()=>{
                setShipModal(true);
            }}><Text>Shipping information</Text>
            <Icon name="chevron-right" size={20} />
            </TouchableOpacity>
            
        </View>
        <Text></Text>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
            <TouchableOpacity 
            style={{marginRight: 10,width: '100%', justifyContent: 'space-between', flexDirection:'row'}}
            onPress={()=>{
                setBillModal(true);
            }}><Text>Billing information</Text>
            <Icon name="chevron-right" size={20} />
            </TouchableOpacity>
            
        </View>
                <Button title="done" onPress={async ()=>{
            // route.params.doneFunc();
            const token = await stripe.createTokenWithCard(info);
            console.log("token", token);
            // const endpoint = constants.PAY_ENDPOINT + `?price=${100}&token=${token.tokenId}`;
            // fetch(endpoint);

            //create customer if no customerid
            var createCustomerEndpoint = constants.CUSTOMER_ENDPOINT + "?token=" + token.tokenId;
            if (!hasId) {
                console.log('credit card make');;
            var cId;
            fetch(createCustomerEndpoint).then(resp=>{
                resp.json().then((cid)=>{
                    console.log("CUSTOMERID", cid.id);
                    dispatch({type: "UPDATE_DATA", payload: ['customerId',null, null,res.id]})
                    db.collection('users').doc(auth.currentUser.uid).update({customerId: cid.id}).catch(err=>{
                        console.log(err);
                    });
                    var chargeCustomerEndpoint = constants.CHARGE_CUSTOMER + "?id="+cid.id+"&amount="+ 500;
                    fetch(chargeCustomerEndpoint).then(()=>{
                        console.log('done');
                    }).catch(err=>{
                        console.log(err);
                    });
                })
            });
            
            } else {
                console.log('already had');
                console.log(customerId);
                if (changed) {
                await fetch(constants.UPDATE_CUST, {
                    method: 'POST',
                    body: JSON.stringify({info: info, id: customerId}),
                    headers: { 'Content-Type': 'application/json' }
                });
            }
                var chargeCustomerEndpoint = constants.CHARGE_CUSTOMER + "?id="+customerId+"&amount="+ 450;
            await fetch(chargeCustomerEndpoint);
            }

            // charge customer
            console.log(token);
            if (route.params.doneFunc) {
                route.params.doneFunc();
            }
            console.log('done');
            navigation.navigate('Success');
        }} />
        </View>
        
        
        </View>

</View>

    </SafeAreaView>
    <AnimatedModal colored={true} colors={[constants.ORANGE, constants.GREYORANGE]} visible={billModal} close={()=>setBillModal(false)} state={info} setState={setInfo} content={<BillingModal state={info} setState={setInfo} setChanged={setChanged} close={()=>setBillModal(false)}/>}/>
        <AnimatedModal colored={true} colors={[constants.ORANGE, constants.GREYORANGE]} visible={shipModal} close={()=>setShipModal(false)} state={info} setState={setInfo} content={<ShippingModal state={info} setState={setInfo} setChanged={setChanged} close={()=>setShipModal(false)}/>}/>
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

const BillingModal = ({state, setState, close, setChanged}) => {
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
    return <View style={{paddingLeft: 30, paddingRight: 30, borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor:'white', zIndex: 50}}>
           <Text style={{color: 'red', opacity: error?1:0}}>Please review your information for errors</Text>
           <Text style={{alignSelf: 'center',fontSize: 15, fontFamily: constants.FONT, fontWeight: 'bold'}}>Billing Information</Text>
            <Text style={{marginLeft: 10, marginTop: 10, marginBottom: 5}}>Card</Text>
            <PaymentCardTextField style={[styles.textbox,{marginTop: 0, }]} 
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
            <Text style={{marginLeft: 10, marginTop: 10, marginBottom: 5}}>Full Name</Text>
            <TextInput defaultValue={localState.name} onChangeText={(text)=> {
                localState.name = text;
            }} style={styles.textbox} />
            <TouchableOpacity style={{marginTop:30, borderRadius: 40, overflow: 'hidden',  height: 35, width: "100%", alignSelf:'center', backgroundColor:constants.ORANGE, justifyContent:'center', alignItems: 'center', borderRadius:30}} onPress={()=>{
                 // if (!(validateCard(cardNumber(cardNumber)) && validateExp(expMonth, expYear)))
                valid = true;
                 if (!valid) {
                    setError(true);
                    console.log('error');
                    return;
                }
                setState(localState);
                setChanged(true);
                close();
                }}>
                    <LinearGradient style={{width: '100%', height: '100%',
                    justifyContent: 'center', alignItems: 'center',}}
                    colors={[constants.YELLOW, constants.ORANGE]}
                    start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
                    >
                    <Text style={{color: 'white'}}>confirm</Text>
                    </LinearGradient>
                    </TouchableOpacity>
                
            </View>
            
}

const ShippingModal = ({state, setState, close, setChanged}) => {
    const [localState, setLocalState] = useState(state);
    // const [cardNumber, setCardNumber] = useState('');
    // const [expMonth, setExpMonth] = useState('');
    // const [expYear, setExpYear] = useState('');
    // const [sec, setSec] = useState('');
    
    // const [name, setName] = useState('');
    var valid = false;
    const [error, setError] = useState(false);
    return <View style={{paddingLeft: 30, paddingRight: 30, borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor:'white', zIndex: 50}}>
            <Text style={{alignSelf: 'center',fontSize: 15, fontFamily: constants.FONT, fontWeight: 'bold'}}>Shipping Address</Text>
            <Text style={{color: 'red', opacity: error?1:0}}>Please review your information for errors</Text>
            <Text style={{marginLeft: 10, marginTop: 10, marginBottom: 5}}>Full Name</Text>
            <TextInput defaultValue={localState.name} onChangeText={(text)=> {
                localState.name = text;
            }} style={styles.textbox} />
            <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>Address</Text>
            <TextInput defaultValue={localState.addressLine1} onChangeText={(text)=> {
                localState.addressLine1 = text;
            }} style={styles.textbox} />

            <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                <View style={{flex: 1, marginRight: 20}}>
            <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>City</Text>
            <TextInput defaultValue={localState.addressCity} onChangeText={(text)=> {
                localState.addressCity = text;
            }} style={styles.textbox} />
                        </View>
                        <View >
                        <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>State</Text>
            <TextInput defaultValue={localState.addressState} onChangeText={(text)=> {
                localState.addressState = text;
            }} style={styles.textbox} />
                        </View>
                        {/* <View>
                        <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>Country</Text>
            <TextInput defaultValue={localState.addressCountry} onChangeText={(text)=> {
                localState.addressCountry = text;
            }} style={styles.textbox} />
            </View> */}
            </View>            
            <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>Zip Code</Text>
            <TextInput defaultValue={localState.addressZip} onChangeText={(text)=> {
                localState.addressZip = text;
            }} style={styles.textbox} />

            <TouchableOpacity style={{marginTop:30, borderRadius: 40, overflow: 'hidden',  height: 35, width: "100%", alignSelf:'center', backgroundColor:constants.ORANGE, justifyContent:'center', alignItems: 'center', borderRadius:30}} onPress={()=>{
                 // if (!(validateCard(cardNumber(cardNumber)) && validateExp(expMonth, expYear)))
                valid = true;
                 if (!valid) {
                    setError(true);
                    console.log('error');
                    return;
                }
                setState(localState);
                setChanged(true);
                close();
                }}>
                    <LinearGradient style={{width: '100%', height: '100%',
                    justifyContent: 'center', alignItems: 'center',}}
                    colors={[constants.YELLOW, constants.ORANGE]}
                    start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
                    >
                    <Text style={{color: 'white'}}>confirm</Text>
                    </LinearGradient>
                    </TouchableOpacity>
                
            </View>
            
}

const styles = {
    textbox: {borderWidth: 1, borderColor: constants.DARKGREY, borderRadius: 30, padding: 10, paddingBottom: 10, paddingTop: 10, fontSize: 18},
    row: {width: '100%', borderBottomWidth: 2, borderColor: constants.PINK_BACKGROUND,paddingHorizontal:20, flexDirection: 'row', paddingVertical:20},
}

export default Checkout;