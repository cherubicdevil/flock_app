import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RGBADepthPacking } from 'three';
import {Portal} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';

const NewTutorial = ({children, screenId, absolutePosition={left: 0, top: 0, right: 0, bottom: 0}}) => {
  const dispatch = useDispatch();
    const [visible, setVisible] = useState(true);
    const [showGif, setShowGif] = useState(false);

    const storeData = async () => {
        console.log('storing');
        try {
          await AsyncStorage.setItem('@flock_screen_'+screenId, 'true')
          console.log('done storing');
        } catch (e) {
          console.log('error', e)
        }
      }
    
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('@flock_screen_'+screenId)
        return value;
      } catch(e) {
        console.log('error',e);
      }
    }

    useFocusEffect(()=>{
        let used = false;
        getData().then((data)=>{
            console.log(data, "new player?");
            if (!used) {
                if (data !== null) {
                setVisible(!data==='true');
                }
            }
        })

        return ()=>{
            used=true;
        }
    },[]);

    return <View style={{position: 'absolute', zIndex: 3000, top: 0, height: visible?'100%':0, width: visible?'100%':0, backgroundColor: 'rgba(0,0,0,0.8)', overflow:'hidden'}}>
        <TouchableOpacity style={{height: '100%', width: '100%'}} onPress={()=>{
            storeData();
            setShowGif(true);
            setTimeout(()=>{
              setVisible(false);
              console.log('showGif', showGif);
            },3000);
            dispatch({type:'getEggs', payload: 10});


        }}>
            <View style={{height:'100%', width: '100%',paddingHorizontal: 20, justifyContent: 'center', color: 'white'}}>
            {children}
            </View>

        </TouchableOpacity>
        <Portal>
          <Image source={require('App/Assets/Images/egg-anim-proto.gif')} style={{width:visible && showGif?'120%':0, position: 'absolute', bottom: 30, right: "-32%"}} />
        </Portal>
    </View>
}



export default NewTutorial;