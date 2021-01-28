import React, {useState, useRef, useEffect} from 'react';
import {View, Text, SafeAreaView, Image, Modal, Button} from 'react-native';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import {firebase, db, auth} from 'App/firebase/config';
var seedrandom = require('seedrandom');
import AnimatedModal from 'App/components/AnimatedModal';
import {constants} from 'App/constants';


const FlockReserve = ({navigation, route}) => {
    
    const [othersMarkedDates, setOthersMarkedDates] = useState({});
    const [myMarkedDates, setMyMarkedDates] = useState({});

      useEffect(()=> {
        console.log(route.params.data.id, "DATA ID");
        db.collection("chatGroups").doc(route.params.data.id)
    .onSnapshot(function(doc) {
        console.log("Current dates: ", doc.data().markedDates);
        const dates = doc.data().markedDates;
        for (var el in dates) {
          if (dates[el].user !== auth.currentUser.uid){
            dates[el] = {...dates[el], color: 'red'}
          } else {
            dates[el] = {...dates[el], color: 'green'}
          }
          
        }
        setOthersMarkedDates(dates);
    });
      },[]);


    const [modalOpen, setModalOpen] = useState(false);
    console.log(route.params);
    const requestTypeIsRent = route.params.data.members.includes({name: auth.currentUser.displayName, uid: auth.currentUser.uid});
    const colors = (requestTypeIsRent)?[constants.PURPLE, constants.RED]:['#ff4d00', constants.PEACH];
    return <SafeAreaView>
      <Text>{requestTypeIsRent?"Borrow":"Flock"}</Text>
        <Button title="back" onPress={()=>navigation.goBack()} style={{position: 'absolute', top: '10'}}/>
        <Image style = {{width: '100%', height: '80%', resizeMode: 'contain'}} source = {{uri: route.params.data.product.image}} />
        <Text>{route.params.data.product.title}</Text>
        <Button title="reserve" onPress={()=>{
          setModalOpen(!modalOpen);
          }}/>
        <AnimatedModal colored={true} colors={colors} visible={modalOpen} close={()=>setModalOpen(false)} content={<ReserveCalendar navigation = {navigation} close={()=>{setModalOpen(false)}} route={route} myMarkedDates={myMarkedDates} setMyMarkedDates={setMyMarkedDates} othersMarkedDates={othersMarkedDates} />} />
        </SafeAreaView>;
}

const ReserveCalendar = ({navigation, route, close, myMarkedDates, othersMarkedDates, setMyMarkedDates}) => {
  const [picked, setPicked] = useState(false);
  const markPeriod = (start, duration=4, options) => {
    const marked = {};
  for (var i = 1; i < duration - 1; i++) {
      marked[moment(start.dateString).add(i, 'days').format('YYYY-MM-DD')] = options;
  }
    marked[start.dateString] = {
      startingDay: true,...options
    };
    console.log(start);
    marked[moment(start.dateString).add(duration-1, 'days').format('YYYY-MM-DD')] = {endingDay: true, ...options};
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
  if (reserved(othersMarkedDates, auth.currentUser.uid, numDays, day.dateString)) {
    return;
  }
  setPicked(true);
  markPeriod(start=day, duration=numDays, options={color: 'rgba(100,255,50,0.5)', user: auth.currentUser.uid});
  console.log(myMarkedDates);
  
}

  return <View style={{paddingBottom: 20, backgroundColor: 'white'}}>
            <Text style={{alignSelf: 'center'}}>You can {requestTypeIsRent?"borrow":"flock"} the item for {numDays} days</Text>
            <Text style={{alignSelf: 'center'}}>Choose a start date 2 days before you intend to use it.</Text>
            <Calendar
            style={{ width: '90%', alignSelf: 'center'}}
      markedDates={{...myMarkedDates, ...othersMarkedDates }}
      markingType={'period'}
      onDayPress={handleDayPress}
    />
    <Button style={{color: picked?'blue':'grey'}} title="rent" onPress={()=>{
      // db.collection("chatGroups").doc(route.params.data.id).update({[`markedDates.${auth.currentUser.uid}`]: markedDates});
      console.log('HELLOOOOOO');
      const dates = Object.keys(myMarkedDates);
      const start = dates[0];
      const end = dates[1];
      // db.collection("chatGroups").doc(route.params.data.id).update({'markedDates': {...othersMarkedDates, ...myMarkedDates}});
      navigation.navigate('Checkout', {doneFunc: (customerId)=> {
        db.collection("chatGroups").doc(route.params.data.id).update({'markedDates': {...othersMarkedDates, ...myMarkedDates}});
        const myDates = Object.entries({...othersMarkedDates, ...myMarkedDates});
        let postData = {
          ...route.params.data,
          customerId: customerId,
          chatId: route.params.data.id,
          userId: auth.currentUser.uid,
          dates: myDates[0] + "-" + myDates[myDates.length - 1],
        }
        fetch(constants.CHARGE_FLOCK_COMPLETE_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(json => console.log(json));
        console.log('payment done!');
      }, extra: <Text>{start} to {end}</Text>}, );
      close();
    }} />
        {/* <Button title="close" onPress={()=>{setModalOpen(!modalOpen)}} /> */}
        </View>
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