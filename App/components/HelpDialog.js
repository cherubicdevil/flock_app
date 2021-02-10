import React, {useState} from 'react';
import {auth, db, firebase} from 'App/firebase/config';
import {
  TouchableOpacity,
  View,
  TextInput
} from 'react-native';
import {constants} from 'App/constants';


import Icon from 'react-native-vector-icons/FontAwesome';
import Dialog from 'react-native-dialog';

const HelpDialog = ({context, text}) => {
const [sendDialog, openSendDialog] = useState(false);
const [message, setMessage] = useState("");

    return <><TouchableOpacity onPress={()=>{
        openSendDialog(true);
      }}>
      <View style={{padding: 5, borderRadius:35, width: 25, height: 25, backgroundColor: constants.DARKGREY, alignItems:'center'}}>
        <Icon  name="exclamation" size={15} color="white" />
        </View>
        </TouchableOpacity>
        <Dialog.Container visible={sendDialog}>
    <Dialog.Title>Report a Problem</Dialog.Title>
    <Dialog.Description>
      {text}
    </Dialog.Description>
    <TextInput value ={message} onChangeText={(text)=>{
        setMessage(text);
    }} multiline style={{width: '90%', height: 70, backgroundColor: 'white', borderWidth: 1, borderColor: constants.DARKGREY, borderRadius: 10, alignSelf:'center', marginBottom: 10, padding: 10}} />
    <Dialog.Button label="Cancel" onPress={()=>{
      openSendDialog(false);
    }}/>
    <Dialog.Button label="Report" onPress={()=>{
        // send the email
        console.log('context', context);
        fetch(constants.HEROKU +"send_admin_email/", {
          method: 'POST',
          body: {context: context, message: message},
          headers: { 'Content-Type': 'application/json' }
      }).catch(err=>{
        console.log(err)
      });
      openSendDialog(false);
      
    }}/>
  </Dialog.Container>
        </>;
}

export default HelpDialog;