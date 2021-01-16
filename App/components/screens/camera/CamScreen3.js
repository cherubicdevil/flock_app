import React, {useRef, useState, createRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import BubbleInput from 'react-native-bubble-input';
import {constants} from 'App/constants';
import ProgressHeader from 'App/components/ProgressHeader';
import {firebase, db} from 'App/firebase/config';

import { CommonActions } from '@react-navigation/native';


const options = [];

const CamScreen3 = ({navigation, route}) => {
  const [dummyState, setDummyState] = useState(false);
  // var options = [
  // 	{label: 'test', ref: useRef(null), choices: ['choice1', 'choice2']},
  // ];
  route.params.data['hello3'] ='three';
  const OptionBox = () => {
    const [dummyState, setDummyState] = useState(false);

    return options.map((item) => {
      return (
        <View
          style={{
            //width: '100%',
            borderRadius: 20,
            paddingRight: 20,
            paddingBottom: 5,
            paddingLeft: 20,
            //height: 40,
            alignItems: 'flex-start',
            flexDirection: 'row',
            borderWidth: 1,
          }}>
          <TextInput
            autoFocus
            style={{flex: 1, marginTop: 9}}
            ref={item.labelRef}
            defaultValue={item.label}
            onBlur={(event) => {
              console.log('hello');
              item.label = event.nativeEvent.text;
            }}></TextInput>
          <View
            style={{
              flex: 3,
              flexDirection: 'row',
              paddingTop: 3,
              paddingBottom: 3,
              //backgroundColor: constants.LIGHTGREY,
            }}>
            <BubbleInput data={item.choices} />
            <TouchableOpacity
              style={{marginTop: 5}}
              onPress={() => {
                const index = options.indexOf(item);
                options.splice(index, 1);
                setDummyState(!dummyState);
              }}>
              <Text>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  };
  return (
    <View>
      <ProgressHeader
        nextRoute="Home"
        headerText="Product Options"
        canGoNext={true}
        number = {3}
        goBack={true}
        navigation={navigation}
        index={2}
        backRoute="Search Product"
        data={route.params.data}
        closeFunc={()=>{
          console.log('closing');
          console.log(route.params.data);
          db.collection("posts").add(route.params.data)
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { name: 'Home' },
            ],
          })
        );
        }}
      />
      <View style={{paddingLeft: 20, paddingRight: 20}}>
        <Text
          style={{
            marginTop: 10,
            fontFamily: 'Nunito-Light',
            color: constants.LIGHTGREY,
            textAlign: 'center',
            //width: '90%',
          }}>
          Add options such as size and color.
        </Text>
        <OptionBox />
        <Button
          title="Add"
          onPress={() => {
            options.push({
              label: 'label',
              labelRef: createRef(null),
              ref: createRef(null),
              choices: [],
            });
            //options[options.length - 1].labelRef.focus();
            setDummyState(!dummyState);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default CamScreen3;
