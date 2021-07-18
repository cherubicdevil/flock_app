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

import {constants} from 'App/constants';

const StripeCheckout = ({amount, completeFunc=()=>{}, setHook=()=>{}}) => {
    const [shipModal, setShipModal] = useState(false);
    const [shippingDone, setShippingDone] = useState(false);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const dispatch = useDispatch();
    const select = useSelector(state=>state.userInfo);



    const fetchPaymentSheetParams = async () => {
    const idIsNone = select.customerId === "none" || select.customerId === undefined;
    console.log('id is none?', idIsNone, select.customerId);
    const response = await fetch(`${constants.API_URL}/payment-sheet`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({custId: idIsNone?null:select?.customerId, amount: amount})
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();


    // update customer id
    dispatch({type:'UPDATE_DATA_UPLOAD', payload: ["customerId", null, null, customer]});

    return {
        paymentIntent,
        ephemeralKey,
        customer,
    };
    };

    const initializePaymentSheet = async () => {
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
    };

    const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet({ clientSecret });

        if (error) {
        // Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
        // Alert.alert('Success', 'Your order is confirmed!');
        completeFunc();
        }
    
    // see below
    };
    // console.log('reender stripehcekout')
    useEffect(() => {
    initializePaymentSheet();
    console.log('changing hook function');
    setHook(()=>()=>{openPaymentSheet()});
    // setHook([()=>console.log('fasdfasdfa;lfaskfdja;')])
    }, []);




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
    return <>
    
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