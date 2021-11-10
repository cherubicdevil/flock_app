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

import {useSelector, useDispatch} from 'react-redux';
import {confirmPaymentSheetPayment, useStripe} from '@stripe/stripe-react-native';
import {throttle, debounce} from 'lodash';

import {constants} from 'App/constants';

const StripeCheckout = ({amount, completeFunc=()=>{}, setHook=()=>{}, hookDependency = [], delayedCharge=false}) => {
    const [shipModal, setShipModal] = useState(false);
    const [shippingDone, setShippingDone] = useState(false);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [paymentIntentId, setPaymentId] = useState("");
    const dispatch = useDispatch();
    const select = useSelector(state=>state.userInfo);

    const [debounceStack, setDebounceStack] = useState([])

    const fetchPaymentSheetParams = async () => {
    const idIsNone = select.customerId === "none" || select.customerId === undefined;
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
        Alert.alert("Please check your connection.");
        console.log('something went wrong fetching payment')
        console.log(err)
    }
    const { paymentId, paymentIntent, ephemeralKey, customer, error } = await response.json();
    if (error && error !== {} && constants.DEBUG) {
        Alert.alert("Sorry. Something went wrong.");
        console.log("stripe server issue: ", error);
    }


    // update customer id
    dispatch({type:'UPDATE_DATA_UPLOAD', payload: ["customerId", null, null, customer]});

    return {
        paymentId,
        paymentIntent,
        ephemeralKey,
        customer,
    };
    };

    const initializePaymentSheet = debounce(async () => {
        console.log('initializing payment sheet')
        
    const {
        paymentId,
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
        console.log('setting payment id', paymentId)
        setPaymentId(paymentId);
        // setLoading(true);
    }
    }, 1000);

    const openPaymentSheet = async (context={}) => {
        if (amount < 0.50) {
            Alert.alert("Transaction must exceed $0.50");
            return;
        } else {
            console.log("wrong amount is", amount)
        }

        if (paymentIntentId == "") {
            Alert.alert("Something went wrong. Try again.");
            return;
        }
    const { error, paymentOption } = await presentPaymentSheet({ clientSecret });
    console.log('payment option', paymentOption);
        if (error) {
            console.log('something went wrong')
        Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
        // Alert.alert('Success', 'Your order is confirmed!');

        context['paymentIntentId']=paymentIntentId;
        completeFunc(context);
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

    if (amount != 0) {    
    initializePaymentSheet();
    debounceStack.push("j")
    }
    setTimeout(()=> {
        if (debounceStack.length == 0) {
            initializePaymentSheet.flush();
        }
    }, 1000);

})();



    return () => {
        // on unmount get rid of all the queued up actions
        while (debounceStack.length > 0) {
            initializePaymentSheet.cancel();
            debounceStack.shift();
        }
        }

    }, [amount]);

    useEffect(()=>{
        // changes hook function depending on necessary changes
        // unsure if hookDependency should be in the above useEffect or this one.
        console.log('pay', paymentIntentId)
        setHook(()=>(context = {})=>{
            openPaymentSheet(context)
        });
    }, [...hookDependency, paymentIntentId])


    return <>
            </>
}


export default StripeCheckout;