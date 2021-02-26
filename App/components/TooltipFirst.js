import React, {useState, useRef, useEffect} from 'react';
// import {Text} from 'react-native';
import { Tooltip, Text} from 'react-native-elements';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (screenId) => {
    console.log('storing');
    try {
      await AsyncStorage.setItem('@flock_tooltip_'+screenId, 'true')
      console.log('done storing');
    } catch (e) {
      console.log('error', e)
    }
  }

const getData = async (screenId) => {
  try {
    const value = await AsyncStorage.getItem('@flock_tooltip_'+screenId)
    return value;
  } catch(e) {
    console.log('error',e);
  }
}

const TooltipFirst = ({children, tooltipId, info}) => {
    const toolRef= useRef();

    useEffect(()=>{
        let used = false;
        getData(tooltipId).then((data)=>{
            console.log(data, "new player?");
            if (!used) {
                if (data !== null) {
                // setVisible(!data=='true');
                // if (!data === 'true') {
                //     toolRef.current.toggleTooltip();
                // }
                }
            }
        })
        toolRef.current.toggleTooltip();
        return ()=>{
            used=true;
        }
    },[]);

    return <Tooltip 
    style={{flex:1}}
    toggleAction="onLongPress"
    onClose={()=>{
        storeData(tooltipId);
    }}
    ref = {toolRef} popover={<Text>{info}</Text>}>
    {children}
  </Tooltip>



}

export default TooltipFirst;