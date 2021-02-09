import React, {Component, useState} from 'react';
import {
  ScrollView,
  Button,
  TouchableOpacity,
  TextInput,
  View,
  Text,
  Image,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Keyboard,
} from 'react-native';
import {constants} from 'App/constants';
import LottieView from 'lottie-react-native';
import Myform from './Myform';
import Social from './Social';
import { TouchableWithoutFeedback } from 'react-native';
import {firebase, auth, db} from 'App/firebase/config';
import LoginCommon from './LoginCommon';


const ForgotPassword = ({navigation}) => {
    const [email, setEmail] = useState("");
    return <LoginCommon>
        <View style={{flex: 1, justifyContent: 'center', alignSelf: 'center', marginLeft: 20, marginRight: 20, width: '80%'}}>
            <Text style={{fontSize: 22, color: 'white'}}>Password Reset</Text>
            <Text style={{marginVertical: 5, color: 'white'}}>Enter your flock email to receive a password reset link.</Text>
            <TextInput placeholder = "youremail@email.com" style={{color: 'white', padding:15, backgroundColor:'rgba(255,255,255,0.15)', borderRadius: 40, width: '100%'}} value={email} onChangeText={(text)=>{
                setEmail(text.toLowerCase());
            }} />
        <TouchableOpacity style={{marginTop: 10, alignSelf: 'center', backgroundColor: constants.LAVENDER, paddingHorizontal: 20, paddingVertical: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 40, width: 100}} onPress={()=>{
auth.sendPasswordResetEmail(email).then().catch(err=>{
    console.log(err);
})
        }}>
            <Text style={{fontWeight: 'bold', color: 'white'}}>Send</Text>
        </TouchableOpacity>
    <TouchableOpacity onPress={()=>{
    navigation.goBack();
}}><Text style={{fontFamily: constants.FONT, color: 'white'}}>Return to login</Text>
</TouchableOpacity>
        </View>

    </LoginCommon>
}

export default ForgotPassword;