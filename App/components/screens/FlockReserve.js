import React, {useState, useRef, useEffect} from 'react';
import {View, Text, SafeAreaView, Image, Modal, Button, TouchableOpacity} from 'react-native';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import {firebase, db, auth} from 'App/firebase/config';
var seedrandom = require('seedrandom');
import AnimatedModal from 'App/components/AnimatedModal';
import {constants} from 'App/constants';
import LinearGradient from 'react-native-linear-gradient';
import { rentPrice } from '../../utils';
import Icon from 'react-native-vector-icons/FontAwesome';
import HeaderGradient from '../HeaderGradient';


const FlockReserve = ({navigation, route}) => {
  const percent = '75%';
    
    const [othersMarkedDates, setOthersMarkedDates] = useState({});
    const [myMarkedDates, setMyMarkedDates] = useState({});

      useEffect(()=> {
        console.log(route.params.data.id, "DATA ID");
        db.collection("chatGroups").doc(route.params.data.id)
    .onSnapshot(function(doc) {
        // console.log("Current dates: ", doc.data().markedDates);

        const dates = doc.data().markedDates || {};
        for (var el in dates) {
          if (dates[el].user !== auth.currentUser.uid){
            dates[el] = {...dates[el], color: 'red', type: 'otherReserved', tentative: false}
          } else {
            dates[el] = {...dates[el], color:  'green', type: 'meReserved', tentative: false}
          }
          
        }
        setOthersMarkedDates(dates);
    });
      },[route.params.data.id]);


    const [modalOpen, setModalOpen] = useState(false);
    
    console.log(route.params);
    const subtotal = requestTypeIsRent?rentPrice(route.params.data.product.price):"0.00"
    const requestTypeIsRent = route.params.data.memberIds.includes(auth.currentUser.uid);
    console.log(requestTypeIsRent,'rent?');;
    const colors = (requestTypeIsRent)?[constants.LAVENDER, constants.PURPINK]:['#ff4d00', constants.PEACH];
    return <SafeAreaView style={{flex: 1, backgroundColor: constants.PINK_BACKGROUND}}>
      {/* <Text>{requestTypeIsRent?"Borrow":"Flock"}</Text> */}
        {/* <Button title="back" onPress={()=>navigation.goBack()} style={{position: 'absolute', top: '10'}}/> */}
        {/* <View style={{height: 100, width: '100%', position: 'absolute', top: 0, zIndex: 400, backgroundColor: constants.TRANSLUCENT, borderBottomRightRadius: 30, borderBottomLeftRadius: 30}}> */}
        <HeaderGradient navigation={navigation} absolute={true} />
        {/* </View> */}
        <View style={{backgroundColor: 'white', borderBottomLeftRadius: 60, borderBottomRightRadius: 60, overflow: 'hidden'}}>
        <View style={{width: '100%', height: percent, borderBottomRightRadius: 60, borderBottomLeftRadius: 60, overflow: 'hidden'}}>
        <Image blurRadius={5} style = {{position: 'absolute', width: '100%', height: '100%', zIndex: -20}} source = {{uri: route.params.data.product.image}} />
        <Image style = {{width: '100%', height: '100%', resizeMode: 'contain'}} source = {{uri: route.params.data.product.image}} />
        
        </View>
         <View style={{paddingHorizontal: 20, paddingVertical:10, backgroundColor: 'white'}}>
        <Text style={{fontFamily: constants.FONT, fontWeight: 'bold'}}>{route.params.data.product.title}</Text>
        <Text>Price: ${route.params.data.product.price}</Text>
    {requestTypeIsRent?<Text>Rent Price: ${subtotal}</Text>:<Text>Price for Flocker: ${subtotal} + shipping</Text>}
    {requestTypeIsRent?<></>:<View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20,}}><Text>You are in this flock.</Text><TouchableOpacity style={{padding: 10, backgroundColor: constants.ORANGE, borderRadius: 30, marginLeft:10}} onPress={()=>{
      navigation.navigate("FlockChatComplete",{data:route.params.data})
    }} >
      <Text style={{color: 'white'}}>Go to chat</Text>
      </TouchableOpacity></View>}
        </View>
        </View>
        
        <View style={{position: 'absolute', bottom: 30,width: '100%', flexDirection: 'row', marginBottom: 0, justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20, alignItems: 'center', }}>

            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
{/* <Image source={constants.PLACEHOLDER_IMAGE } style={{width: 30, aspectRatio:1, marginRight: 10,}}/> */}

<View style={{justifyContent: 'center', alignItems: 'center', marginRight: 10,}}><Image source = {require('App/Assets/Images/heart.png')} style={{width: 35, height: 35,  shadowOpacity: 0.2, shadowOffset: {height:1 , width: 0}}} />
<Text style={{position: 'absolute', top: 10,fontSize: 16}}>34</Text>
</View>

<TouchableOpacity  onPress={()=>{
  navigation.navigate('ShareSocial', {product:route.params.data.product, data:{}, flockId: route.params.data.id})
}}>
<Image 
style={{shadowOpacity: 0.4, shadowOffset:{height:2, width:0},  width: 40, height: 40, aspectRatio:1}}
source={require('App/Assets/Images/Share_Icon_White_Earn.png') } />
</TouchableOpacity>

</View>
        <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', width: 150, height: 50, backgroundColor: constants.ORANGE, borderRadius: 40, overflow: 'hidden'}} onPress={()=>{
          setModalOpen(true);
        }}>
          <LinearGradient style={{width: '100%', padding: 15, height: '100%', justifyContent: 'center'}} colors={[constants.ORANGE, constants.YELLOW]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} >
          <Text style={{fontWeight: 'bold', color: 'white', fontSize: 14, fontFamily: constants.FONT}}>Check Availability</Text>
        </LinearGradient>
        </TouchableOpacity>
        </View>
        <AnimatedModal colored={true} colors={colors} visible={modalOpen} behind={true} close={()=>setModalOpen(false)} content={<ReserveCalendar navigation = {navigation} close={()=>{setModalOpen(false)}} route={route} myMarkedDates={myMarkedDates} setMyMarkedDates={setMyMarkedDates} othersMarkedDates={othersMarkedDates} subtotal={subtotal} />} />
        </SafeAreaView>;
}

const ReserveCalendar = ({navigation, route, close, myMarkedDates, othersMarkedDates, setMyMarkedDates, subtotal}) => {
  const [picked, setPicked] = useState(false);
  const markPeriod = (start, duration=4, options) => {
    const marked = {};
    marked[start.dateString] = {
      startingDay: true,...options,
      tentative: true,
    };
    console.log(start);
    marked[moment(start.dateString).add(duration-1, 'days').format('YYYY-MM-DD')] = {endingDay: true, ...options, tentative: true};
  for (var i = 1; i < duration - 1; i++) {
      marked[moment(start.dateString).add(i, 'days').format('YYYY-MM-DD')] = options;
  }

    setMyMarkedDates(marked);
} 

const requestTypeIsRent = route.params.data.members.includes({name: auth.currentUser.displayName, uid: auth.currentUser.uid});
const numDays = requestTypeIsRent?4:8;

const handleDayPress = (day) => {
  // if (markedDates[day.dateString]) {
  //     markPeriod(4, {});
  //     console.log(markedDates);
  //     return;
  // }
  if (reserved(othersMarkedDates, auth.currentUser.uid, numDays, day.dateString) || !inRange(day.dateString)) {
    setPicked(false);
  } else {
    setPicked(true);
  }
  markPeriod(start=day, duration=numDays, options={type: 'meReserved', color: 'rgba(100,255,50,0.5)', user: auth.currentUser.uid});
  console.log(myMarkedDates);
  
}

  return <View style={{paddingBottom: 20, backgroundColor: 'white'}}>
            <Text style={{alignSelf: 'center'}}>You can {requestTypeIsRent?"borrow":"flock"} the item for {numDays} days</Text>
            <Text style={{alignSelf: 'center'}}>Choose a start date 2 days before you intend to use it.</Text>
            <Calendar
            minDate={moment(new Date()).format("YYYY-MM-DD")}
            // hideExtraDays={true}
            style={{ width: '87%', alignSelf: 'center'}}
      markedDates={{...myMarkedDates, ...othersMarkedDates }}
      markingType={'period'}
      onDayPress={handleDayPress}
      dayComponent={({date, state, marking}) => {
        var startOrEnd = marking['startingDay'] || marking['endingDay'];
        console.log(date);
        var color = requestTypeIsRent?constants.PURPLE:constants.ORANGE;
        var fadedColor = "rgba(255, 221, 214, 1)";
        var isAfter = inRange(date.dateString); // moment(date.dateString).isAfter(moment(new Date()));
        // add two months/four months is also disqualified...
        var disqualified = Object.entries(marking).length === 0 || !isAfter;
        var other = marking['type'] === 'otherReserved';
        var me = marking['type'] === 'meReserved';
        var isTentative = marking['tentative'];
        // console.log(moment(date.dateString), moment(new Date()));

        const circleStyle = {
          // height: '100%',
          // width: '75%',
          borderRadius: 120,
          zIndex: 100,
          position: 'absolute',
          alignSelf: 'center' , 
          height: '100%',
          aspectRatio: 1,
          overflow: 'hidden',
          borderWidth: 4,
          borderColor: fadedColor,
          backgroundColor: isTentative?'white':color,

        };
        var textStyle = {
          position: 'absolute',
          zIndex: 300,
          textAlign: 'center',
           textDecorationLine: isAfter?null:'line-through', color: state === 'disabled' ? 'grey' : 'black', 
        };
        var markStyle = {
          backgroundColor: 'transparent',
          width: '150%',
          height: '75%',
          alignItems: 'center',
          justifyContent: 'center',
        };
        if (disqualified) {
          markStyle.backgroundColor = 'transparent';
        } else {
          if (marking['type'] === 'meReserved') {
            markStyle.backgroundColor = fadedColor;

          if (marking['startingDay'] || marking['endingDay']) {
            markStyle={...markStyle,
              // height: '100%',
              width: '50%',
              overflow: 'hidden',
            }
            textStyle['color'] = isTentative?'black':'white';
          }
          console.log('day of week', moment(date.dateString).day());
          if (!marking['endingDay'] && moment(date.dateString).day() == 6) {
            markStyle['alignSelf'] = "flex-start";
            markStyle['marginLeft'] = "-25%";
            markStyle['paddingLeft'] = "40%";
            markStyle['paddingRight'] = "200%";

            markStyle['width'] = '300%';
          }

          if (!marking['startingDay'] && moment(date.dateString).day() == 0) {
            markStyle['alignSelf'] = "flex-end";
            markStyle['marginRight'] = "-25%";
            markStyle['paddingRight'] = "40%";
            markStyle['paddingLeft'] = "200%";

            markStyle['width'] = '300%';
          }
          if (marking['endingDay'] && moment(date.dateString).day() == 0) {
            markStyle['alignSelf'] = "flex-end";
            markStyle['marginRight'] = "50%";
            markStyle['width'] = '300%';
          }
          if (marking['startingDay'] && moment(date.dateString).day() == 6) {
            markStyle['alignSelf'] = "flex-start";
            markStyle['marginLeft'] = "50%";
            markStyle['width'] = '300%';
          }
        } else if (marking['type'] === 'otherReserved') {
          textStyle['textDecorationLine'] = 'line-through';
          textStyle['textDecorationLineColor'] = fadedColor;
          textStyle['color'] = fadedColor;
          // markStyle['backgroundColor'] = fadedColor;
        }
        }



        return (
          <TouchableOpacity style={{width: '100%', alignItems: 'center', height: 30, marginVertical: -5,justifyContent: 'center'}} onPress={()=>{
            handleDayPress(date);
          }}>
            {startOrEnd && !disqualified && (!other || isTentative)?<View style={circleStyle} />:<></>}
            <View style={markStyle}>
            

          </View>
          <Text style={textStyle}>
              {date.day}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
    {picked===false?<Text style={{alignSelf: 'center', color: 'red', marginTop: 5}}>Choose a valid date.</Text>:<><Text style={{marginTop: 5}}> </Text></>}
    <View style={{paddingHorizontal: 80, flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
      {/* <TouchableOpacity style={{height: 40, backgroundColor: constants.BGGREY, justifyContent: 'center', alignItems: 'center', borderRadius: 40, paddingHorizontal: 15}} onPress={()=>{setModalOpen(false)}} >
        <Text>close</Text>
      </TouchableOpacity> */}
      
    <TouchableOpacity style={{backgroundColor: picked?(requestTypeIsRent?constants.PURPLE:constants.ORANGE):constants.GREY,height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 40, paddingHorizontal: 15}} title="rent" onPress={()=>{
      // db.collection("chatGroups").doc(route.params.data.id).update({[`markedDates.${auth.currentUser.uid}`]: markedDates});
      console.log('HELLOOOOOO');
      const dates = Object.keys(myMarkedDates);
      const start = dates[0];
      const end = dates[1];
      // db.collection("chatGroups").doc(route.params.data.id).update({'markedDates': {...othersMarkedDates, ...myMarkedDates}});
      navigation.navigate('Checkout', {doneFunc: (customerId)=> {
        db.collection("chatGroups").doc(route.params.data.id).update({'markedDates': {...othersMarkedDates, ...myMarkedDates}});
        const myDates = Object.entries({...othersMarkedDates, ...myMarkedDates});
    //     let postData = {
    //       ...route.params.data,
    //       customerId: customerId,
    //       chatId: route.params.data.id,
    //       userId: auth.currentUser.uid,
    //       dates: myDates[0] + "-" + myDates[myDates.length - 1],
    //     }
    //     fetch(constants.CHARGE_FLOCK_COMPLETE_ENDPOINT, {
    //     method: 'POST',
    //     body: JSON.stringify(postData),
    //     headers: { 'Content-Type': 'application/json' }
    // }).then(res => res.json())
    //   .then(json => console.log(json));
    //     console.log('payment done!');
      }, start: start, end:end, subtotal: parseFloat(subtotal)}, );
      close();
    }} >
      
      <Text style={{color: 'white'}}>
        next
      </Text>
    </TouchableOpacity>

</View>
        {/* <Button title="close" onPress={()=>{setModalOpen(!modalOpen)}} /> */}
        </View>
}

const inRange = (day) => {
  return moment(day).isAfter(moment(new Date()));
}

const reserved = (markedDates, userId, duration, day) => {
  var truth = false;
  for (var i = 0; i < duration; i++) {
    const value = markedDates[moment(day).add(i, 'days').format('YYYY-MM-DD')];
    if (value === undefined || value === null) { // if unoccupied
      continue;
    }
    if (value.user !== userId) { // if occupied and not occupied by you
      return true;
    }
    if (value.user === userId) { // if occupied previously by you, can't change. if still figuring out, can change.
    // also, might want to have a reschedule or cancel option if click.
      return true;
    }
  }
}

export default FlockReserve;