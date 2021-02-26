import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RGBADepthPacking } from 'three';

const BirdTutorial = ({children, screenId, position}) => {
    const [visible, setVisible] = useState(true);
    const {x:x, y:y} = position;

    const storeData = async () => {
        console.log('storing');
        try {
          await AsyncStorage.setItem('@bird_tutorial_'+screenId, 'true')
          console.log('done storing');
        } catch (e) {
          console.log('error', e)
        }
      }
    
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('@bird_tutorial_'+screenId)
        return value;
      } catch(e) {
        console.log('error',e);
      }
    }

    useEffect(()=>{
        let used = false;
        getData().then((data)=>{
            console.log(data, "new player?");
            if (!used) {
                if (data !== null) {
                // setVisible(!data=='true');
                }
            }
        })

        return ()=>{
            used=true;
        }
    },[]);

    return <View style={{position: 'absolute', zIndex: 300, top: 0, height: visible?'100%':0, width: visible?'100%':0, backgroundColor: 'rgba(0,0,0,0.8)', overflow:'hidden'}}>
        <TouchableOpacity style={{height: '100%', width: '100%'}} onPress={()=>{
            storeData();
            setVisible(false);

        }}>
            <View style={{height:'100%', width: '100%',paddingHorizontal: 20, justifyContent: 'center', color: 'white'}}>
            {children}
            </View>

        </TouchableOpacity>
    </View>
}



export default BirdTutorial;