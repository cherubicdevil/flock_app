import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RGBADepthPacking } from 'three';

const NewTutorial = ({children, screenId}) => {
    const [visible, setVisible] = useState(true);

    useEffect(()=>{
        let used = false;
        getData().then((data)=>{
            if (!used) {
                setVisible(!data);
            }
        })

        return ()=>{
            used=true;
        }
    },[]);

    return <View style={{position: 'absolute', zIndex: 300, top: 0, height: visible?'100%':0, width: visible?'100%':0, backgroundColor: 'rgba(0,0,0,0.8)', overflow:'hidden'}}>
        <TouchableOpacity style={{height: '100%', width: '100%'}} onPress={()=>{
            setVisible(false);
        }}>
            <View style={{height:'100%', width: '80%', marginHorizontal: 20, justifyContent: 'center', color: 'white'}}>
            {children}
            </View>

        </TouchableOpacity>
    </View>
}

const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('@flock_screen_'+screenId, value)
    } catch (e) {
      // saving error
    }
  }

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('@flock_screen_'+screenId)
    return value;
  } catch(e) {
    // error reading value
  }
}

export default NewTutorial;