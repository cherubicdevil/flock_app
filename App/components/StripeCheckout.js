import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import AnimatedModal from 'App/components/AnimatedModal';
import ShippingModal from 'App/components/ShippingModal';
import {useSelector, useDispatch} from 'react-redux';
import {confirmPaymentSheetPayment, useStripe} from '@stripe/stripe-react-native';
import {throttle, debounce} from 'lodash';
import {constants} from 'App/constants';

const StripeCheckout = ({amount, children, completeFunc=()=>{}, setHook=()=>{}, hookDependency = [], delayedCharge=false}) => {
    const [shipModal, setShipModal] = useState(false);
    const [shippingDone, setShippingDone] = useState(false);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const dispatch = useDispatch();
    const select = useSelector(state=>state.userInfo);

    const [debounceStack, setDebounceStack] = useState([])

    console.log('amount', amount)

    const fetchPaymentSheetParams = async () => {
    const idIsNone = select.customerId === "none" || select.customerId === undefined;
    console.log('id is none?', idIsNone, select.customerId);
    const bodyData = {custId: idIsNone?null:select?.customerId, amount: amount, captureMethod: delayedCharge?"manual":"automatic"};

    var response;
    try {
        response = await fetch(`${constants.API_URL}/payment-sheet`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData)
        });
    }  catch (err) {
        Alert.alert("Something went wrong")
    }
    const { paymentIntent, ephemeralKey, customer } = await response.json();


    // update customer id
    dispatch({type:'UPDATE_DATA_UPLOAD', payload: ["customerId", null, null, customer]});

    return {
        paymentIntent,
        ephemeralKey,
        customer,
    };
    };

    const initializePaymentSheet = debounce(async () => {
        console.log('initializing payment sheet')
    const {
        paymentIntent,
        ephemeralKey,
        customer,
    } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
    });
    if (!error) {
        setClientSecret(paymentIntent);
        // setLoading(true);
    }
    }, 1000);

    const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet({ clientSecret });
        if (error) {
            console.log('something went wrong')
        Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
        // Alert.alert('Success', 'Your order is confirmed!');
        console.log("PAYMENT SHEET");
        completeFunc();
        }
    
    // see below
    };

 
    // console.log('reender stripehcekout')
    useEffect(() => {
        while (debounceStack.length > 0) {
            initializePaymentSheet.cancel();
            console.log('cancelling');
            debounceStack.shift();
        }
        (async ()=>{

    
    initializePaymentSheet();
    debounceStack.push("j")
    setTimeout(()=> {
        if (debounceStack.length == 0) {
            initializePaymentSheet.flush();
        }
    }, 1000);

})();



    return () => {
        console.log("unmounting");
        while (debounceStack.length > 0) {
            initializePaymentSheet.cancel();
            console.log('cancelling');
            debounceStack.shift();
        }
        }
    
    
    // setHook([()=>console.log('fasdfasdfa;lfaskfdja;')])
    }, [amount]);

    useEffect(()=>{
        console.log('changing hook function');
        setHook(()=>()=>{
            console.log('opening payment sheet')
            openPaymentSheet()
        });
    }, hookDependency)




    const getShippingInfo = () => {
        const hasShipping = select.shipping !== null && select.shipping !== "none";
        if (!hasShipping) {
            return <>
            <Text>Looks like we don't have your Shipping Information. Please input it so we can get you your purchase.</Text>
            <Button title="shipping" onPress={()=>{
                setShipModal(true);
            }}/>
            </>
        }
    }
    return <>{children}
    
    {/* <Button
    variant="primary"
    // disabled={!loading}
    title="test stripe ui"
    // onPress={()=>{openPaymentSheet()}}
    onPress={()=>{
        setShipModal(true)
    }}
  />
  <AnimatedModal upPercent="55%"  nested = {false} keyboard={true} colored={false} visible={shipModal} close={()=>setShipModal(false)} content={
                <ShippingModal close={()=>setShipModal(false)} 
                completeFunc={()=>{
                    // setTimeout(()=>{
                    //     setShippingDone(true)
                    // }, 500)
                    // setLoading(!loading);
                    openPaymentSheet();
                }}
                />
                }/>
                {getShippingInfo()}
 */}

            </>
}


export default StripeCheckout;