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
 * AnimatedModal.js
 *
 * This file contains code for the AnimatedModal that is currently used on
 *  the Checkout page and FlockReserve page.
 *
 * It is the more general version of OptionsModal.
 *
 *
 */

import {constants} from 'App/constants';
import {View, Modal, Text, Animated, TouchableOpacity, Dimensions} from 'react-native';
import React, {useRef} from 'react';
import MaskedViewIOS from '@react-native-community/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { AnimationObjectGroup } from 'three';

const AnimatedModal = ({
  visible,
  close,
  navigation,
  content,
  upPercent="55%",
  colored=false,
  colors=['transparent', 'transparent'],
  bgcolor="white",
  fade=true,
  fadeOpacity=0.8,
  curve = true,
  behind=false,
  viewParams={bottom: 0, height: Dimensions.get('window').height, width:Dimensions.get('window').width, left: 0},
  contentTop=<></>
}) => {
  const animation = useRef(new Animated.Value(0));
  const startAnimation = () => {
    Animated.timing(animation.current, {
      useNativeDriver: false,
      toValue: fadeOpacity,
      delay: 0,
      duration: 700,
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
  if (visible) {
    startAnimation();
  }
  return (
    <View style={{zIndex: 800}}>
      <Animated.View
        style={{
          height: visible ? viewParams.height : 0,
          width: visible ? viewParams.width: 0,
          position: 'absolute',
          zIndex: 500,
          bottom: viewParams.bottom,
          left: viewParams.left,
        //   bottom: -1000,
        alignSelf: 'center', 
          //right: Dimensions.get('window').width/2,
          backgroundColor: (colored || !fade)?'transparent':'rgb(0,0,0)',
          opacity: animation.current,
          //backgroundColor: modalVisible ? 'rgba(0,0,0,0.7)' : 'transparent',
        }}
      >
    {colored?<LinearGradient style={{height: '100%'}} colors={colors} />:<></>}

      </Animated.View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        style={{
            
          position: 'absolute',
          width: '100%',
          justifyContent: 'flex-end',
          //backgroundColor: '#aea',
        }}>
          <TouchableOpacity onPress={()=>{
            close();
            resetAnimation();
              }} style={{position: 'absolute', top:0, height: '100%', width: '100%', zIndex: -30}} />
            
            {behind?<View style={{position: 'absolute', bottom: 15, height: upPercent, width: '88%', backgroundColor: bgcolor, opacity: 0.5, alignSelf: 'center', borderRadius: curve?90:0,}} />:<></>}
            {behind?<View style={{position: 'absolute', bottom: 8, height: upPercent, width: '90%', backgroundColor: bgcolor, opacity: 0.5, alignSelf: 'center', borderRadius: curve?80:0,}} />:<></>}
            <View style={{zIndex: -40, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, width: '100%', height: (100-parseInt(upPercent.replace("%",""))) + "%", backgroundColor:"rgba(255,255,255,0)"}}>
              {contentTop}
            </View>
            <View style={{position: 'absolute', bottom: 0, width: '100%', height: upPercent, borderRadius: curve?100:0, borderBottomRightRadius: 0, borderBottomLeftRadius: 0, backgroundColor: bgcolor, paddingTop: 40, overflow: 'hidden'}}>
              
              {content}
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

export default AnimatedModal;
