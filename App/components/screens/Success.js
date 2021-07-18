import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {constants} from 'App/constants';
import {useSelector, useDispatch} from 'react-redux';

const Success = ({route, navigation}) => {
  const select = useSelector(state=>state.userInfo);
  const dispatch = useDispatch()
  console.log('route email', route.params.email);
  useEffect(()=>{
    if (select.email == null) {
      console.log('email null');
      // dispatch({type: "UPDATE_DATA_UPLOAD", payload: ['email',null, null,'test@test233.com']});
    }
  }, [select.email])

  return (
    <View style={{flex: 1, justifyContent: 'center',  backgroundColor: constants.PINK_BACKGROUND_OPAQUE}}>
      <View style={{borderWidth:1, borderColor: constants.LAVENDER,marginHorizontal: 20, paddingVertical: 20, borderRadius: 30}}>
      <Image
        source={require('App/Assets/Images/checkmark.png')}
        style={{width: 50, height: 50, alignSelf: 'center'}}
      />
            <Text style={{textAlign: 'center'}}>
        Payment processed.
      </Text>
      <View style={{paddingLeft: 20, marginTop: 20}}>

      <Text>
        Period: {route.params.period}
      </Text>
      <Text>
        Amount: {route.params.amount}
      </Text>


      <Text style={{marginTop: 20}}>
        Receipt sent to: {route.params.email || select.email}
      </Text>
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Success;
