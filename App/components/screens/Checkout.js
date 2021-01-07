import React, {useState} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Button, Modal } from 'react-native';

const Checkout = ({navigation, route}) => {
    const [shipModal, setShipModal] = useState(false);
    const [billModal, setBillModal] = useState(false);
    
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
        <Modal visible={shipModal} ><TouchableOpacity style={{width: '100%', height: '100%'}} onPress={()=>{setShipModal(false)}}></TouchableOpacity></Modal>
        <Modal visible={billModal} ><TouchableOpacity style={{width: '100%', height: '100%'}} onPress={()=>{setBillModal(false)}}></TouchableOpacity></Modal>
    </SafeAreaView>
};

export default Checkout;