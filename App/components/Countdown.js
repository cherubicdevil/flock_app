import React, {useState, useEffect} from 'react';
import {View, Text, } from 'react-native';


const Countdown = ({dateObj, fontSize = 12, showLabels = true}) => {
    const [now, setNow] = useState(Math.round(Date.now()/1000));
    var diff = dateObj - now + 3600*24*7;
    useEffect(()=> {
      var interval = setInterval(()=> setNow(Math.round(Date.now()/1000)), 1000);
      return ()=>{
        clearInterval(interval);
      }
    }, []);
  
    const days = Math.round(diff / (3600*24));
    var remainder = diff % (3600*24);
    const hours = Math.floor(remainder / 3600);
    remainder %= (3600);
    const minutes = Math.floor(remainder / 60);
    remainder %= 60;
    const seconds = Math.floor(remainder);
  
    return <View style={{width: 90, height: 30, justifyContent: 'center'}}><View style={{flexDirection: 'row', justifyContent:'space-between',paddingBottom: -5, alignItems: 'center'}}><View style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'center'}}><Text style={{textAlign:'center', fontSize: fontSize}}>{days<10?0:''}{days}</Text></View><Text style={{fontSize: fontSize}}>:</Text><View style={{ flex: 1, alignSelf: 'stretch',justifyContent: 'center' }}><Text style={{textAlign: 'center',fontSize: fontSize}}>{hours<10?0:''}{hours}</Text></View><Text style={{fontSize: fontSize}}>:</Text><View style={{flex: 1, alignSelf: 'stretch', justifyContent: 'center'}}><Text style={{ flex: 1, alignSelf: 'stretch', textAlign: 'center',fontSize: fontSize}}>{minutes<10?0:''}{minutes}</Text></View><Text style={{fontSize: fontSize}}>:</Text><Text style={{ flex: 1, alignSelf: 'stretch', textAlign: 'center',fontSize: fontSize}}>{seconds<10?0:''}{seconds}</Text></View>
    <View style={{paddingTop: -20,flexDirection: 'row', justifyContent:'space-evenly', fontSize: fontSize-3}}><Text style={{fontSize:fontSize-3, alignSelf: 'stretch'}}>days</Text><Text style={{fontSize:fontSize-3, alignSelf: 'stretch'}}>hrs</Text><Text style={{fontSize:fontSize-3, alignSelf: 'stretch'}}>min</Text><Text style={{fontSize:fontSize-3, alignSelf: 'stretch'}}>secs</Text></View>
    </View>
  }

  export default Countdown;