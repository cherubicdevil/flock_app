import React, {useState, useRef, useEffect} from 'react';
import {Image} from 'react-native';
import { Tooltip, Text} from 'react-native-elements';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Portal} from 'react-native-paper';
import {useDispatch} from 'react-redux';

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

const TooltipFirst = ({children, tooltipId, info, style, component, width=150, height=50}) => {
    const toolRef= useRef();
    const [showGif, setShowGif] = useState(false);

    const renderText = ()=>{
      if (component) {
        return component;
      }
      return <Text style={{color: 'white', fontFamily:'Noteworthy-Bold'}}>{info}</Text>;
    };

    useEffect(()=>{
        let used = false;
        getData(tooltipId).then((data)=>{
            console.log(data, "new player?");
            if (!used) {
                if (data !== null) {
                // setVisible(!data=='true');
                if (!data === 'true') {
                    toolRef.current.toggleTooltip();
                }
                }
            }
        })

        
        // toolRef.current.toggleTooltip();
        return ()=>{
            used=true;
        }
    },[]);

    const dispatch = useDispatch();
    return <>
    <Tooltip 
    // pointerColor="transparent"
    width={width}
    height={height}
    toggleOnPress={false}
    backgroundColor="transparent"
    overlayColor='rgba(0, 0, 0, 0.7)'
    style={{flex:1}}
    toggleAction="onLongPress"
    highlightColor="white"
    // containerStyle={{borderColor: 'white', borderWidth:1, overflow: 'visible'}}
    pointerStyle={{borderColor:'white', borderWidth:1}}
    onClose={()=>{
      setShowGif(true);
        storeData(tooltipId);

        setTimeout(()=>{
          setShowGif(false);
        }, 1200);
        dispatch({type:'getEggs', payload: 10});
    }}
    ref = {toolRef} popover={renderText()}>
      <View style={[{shadowColor:'transparent', shadowOpacity:1, shadowOffset:{height:0, width:0}, shadowRadius: 10, borderRadius: 40},
      style]
      }>
    {children}
    </View>
  </Tooltip>
        <Portal>
        <Image source={require('App/Assets/Images/egg-anim-proto.gif')} style={{width:showGif?'120%':0, position: 'absolute', zIndex: 400, bottom: 30, right: "-32%"}} />
      </Portal>
      </>


}

export default TooltipFirst;