import React, {useState, useEffect} from 'react';
import {View, Text, } from 'react-native';


const Countdown = ({dateObj}) => {
    const [now, setNow] = useState(Math.round(Date.now()/1000));
    var diff = dateObj - now + 3600*24*7;
    useEffect(()=> {
      setInterval(()=> setNow(Math.round(Date.now()/1000)), 1000);
    }, []);
  
    const days = Math.round(diff / (3600*24));
    var remainder = diff % (3600*24);
    const hours = Math.floor(remainder / 3600);
    remainder %= (3600);
    const minutes = Math.floor(remainder / 60);
    remainder %= 60;
    const seconds = Math.floor(remainder);
  
    return <><View style={{flexDirection: 'row', justifyContent:'space-between'}}><View style={{ flex: 1, alignSelf: 'stretch' }}><Text style={{textAlign:'center'}}>{days<10?0:''}{days}</Text></View><Text>:</Text><View style={{ flex: 1, alignSelf: 'stretch' }}><Text style={{textAlign: 'center'}}>{hours<10?0:''}{hours}</Text></View><Text>:</Text><Text style={{ flex: 1, alignSelf: 'stretch', textAlign: 'center' }}>{minutes<10?0:''}{minutes}</Text><Text>:</Text><Text style={{ flex: 1, alignSelf: 'stretch', textAlign: 'center'}}>{seconds<10?0:''}{seconds}</Text></View>
    <View style={{flexDirection: 'row', justifyContent:'space-between', fontSize: 10}}><Text style={{fontSize:10, alignSelf: 'stretch'}}>days</Text><Text style={{fontSize:10, alignSelf: 'stretch'}}>hrs</Text><Text style={{fontSize:10, alignSelf: 'stretch'}}>min</Text><Text style={{fontSize:10, alignSelf: 'stretch'}}>left</Text></View></>
  }

  export default Countdown;