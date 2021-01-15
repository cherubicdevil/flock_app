/* 
* Made by Kevin Gao, for Flock Shopping.
* All rights reserved.
* Flock © 2020
*
*
			 _______  ___        ______    ______   __   ___  
			/"     "||"  |      /    " \  /" _  "\ |/"| /  ") 
			(: ______)||  |     // ____  \(: ( \___)(: |/   /  
			\/    |  |:  |    /  /    ) :)\/ \     |    __/   
			// ___)   \  |___(: (____/ // //  \ _  (// _  \   
			(:  (     ( \_|:  \\        / (:   _) \ |: | \  \  
			\__/      \_______)\"_____/   \_______)(__|  \__)
*
*/
/*
 * OptionsModal.js
 *
 * This file contains code for the OptionsModal that is currently used on
 *  the AppNavigator tab navigation bar to show the Add slide up modal.
 *
 * Is general enough to use for general purpose.
 * To use, set a State that allows modal to be on or off. Connect this state
 *  to modalOpen prop.
 *
 *
 */

import {constants} from 'App/constants';
import {View, Modal, Text, Animated, TouchableOpacity} from 'react-native';
import React, {useRef} from 'react';

const OptionsModal = ({
  modalVisible,
  toggleFunc,
  navigation,
  text1,
  text2,
  func1,
  func2,
}) => {
  const animation = useRef(new Animated.Value(0));
  const startAnimation = () => {
    Animated.timing(animation.current, {
      useNativeDriver: false,
      toValue: 0.5,
      delay: 0,
      duration: 500,
    }).start();
  };

  const resetAnimation = () => {
    Animated.timing(animation.current, {
      useNativeDriver: false,
      toValue: 0,
      delay: 0,
      duration: 1,
    }).start();
  };
  if (modalVisible) {
    startAnimation();
  }
  return (
    <View style={{zIndex: 800}}>
      <Animated.View
        style={{
          height: modalVisible ? 2000 : 0,
          width: modalVisible ? 2200 : 0,
          position: 'absolute',
          left: -500,
          bottom: -1000,
          right: 0,
          backgroundColor: 'rgb(0,0,0)',
          opacity: animation.current,
          //backgroundColor: modalVisible ? 'rgba(0,0,0,0.7)' : 'transparent',
        }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        style={{
          position: 'absolute',
          width: '100%',
          justifyContent: 'flex-end',
          backgroundColor: '#aea',
        }}>
          <TouchableOpacity onPress={()=>{
            toggleFunc();
            resetAnimation();
              }} style={{position: 'absolute', top:0, height: '100%', width: '100%', zIndex: 30}} />
        <View
          style={{
            backgroundColor: 'transparent',
            //backgroundColor: 'rgba(0,0,0,0.5)',
            margin: 0,
            flex: 1,
            paddingBottom: 40,
            height: 280,
            bottom: 0,
            alignSelf: 'center',
            alignItems: 'center',
            width: '100%',
            position: 'absolute',
            elevation: 2,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}>
          <View
            style={{
              flex: 2,
              width: '90%',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginBottom: 20,
              borderRadius: 20,
              //borderWidth: 5,
              overflow: 'hidden',
            }}>
            <TouchableOpacity
              style={styles.innerButton}
              onPress={() => {
                func1();
                toggleFunc();
                resetAnimation();
              }}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: 'center',
                  fontFamily: 'Nunito-Light',
                  color: constants.PURPLE,
                }}>
                {text1}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.innerButton}
              onPress={() => {
                //navigation.navigate('CamScreen');
                func2();
                console.log('hello');
                toggleFunc();
                resetAnimation();
              }}>
              <Text
                style={{
                  fontSize: 20,
                  textAlign: 'center',
                  fontFamily: 'Nunito-Light',
                  color: constants.PURPLE,
                }}>
                {text2}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              console.log('cancel');
              toggleFunc();
              resetAnimation();
            }}
            style={styles.longButton}>
            <Text
              style={{
                fontSize: 20,
                textAlign: 'center',
                fontFamily: 'Nunito-Light',
                color: constants.RED,
              }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = {
  innerButton: {
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(245,245,245,1)',
    borderTopWidth: 1,
    borderColor: '#aaa',
    fontFamily: 'Nunito-Light',
  },
  longButton: {
    justifyContent: 'center',
    flex: 1,

    backgroundColor: 'rgba(225,225,225,1)',
    width: '90%',
    marginTop: 10,
    borderRadius: 40,
  },
};

export default OptionsModal;
