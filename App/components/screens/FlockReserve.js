import React, {useState, useRef, useEffect} from 'react';
import {View, Text, SafeAreaView, Image, Modal, Button} from 'react-native';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import {firebase, db, auth} from 'App/firebase/config';
var seedrandom = require('seedrandom');


const FlockReserve = ({navigation, route}) => {
    const [picked, setPicked] = useState(false);
    const [othersMarkedDates, setOthersMarkedDates] = useState({});
    const [myMarkedDates, setMyMarkedDates] = useState({});

      useEffect(()=> {
        db.collection("chatGroups").doc(route.params.data.id)
    .onSnapshot(function(doc) {
        console.log("Current dates: ", doc.data().markedDates);
        setOthersMarkedDates(doc.data().markedDates);
    });
      },[]);

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


    const handleDayPress = (day) => {
        // if (markedDates[day.dateString]) {
        //     markPeriod(4, {});
        //     console.log(markedDates);
        //     return;
        // }
        if (reserved(othersMarkedDates, auth.currentUser.uid, 4, day.dateString)) {
          return;
        }
        setPicked(true);
        markPeriod(start=day, duration=4, options={color: 'blue', user: auth.currentUser.uid});
        console.log(myMarkedDates);
        
      }
    const [modalOpen, setModalOpen] = useState(false);
    console.log(route.params);
    return <SafeAreaView>
        <Button title="back" onPress={()=>navigation.goBack()} style={{position: 'absolute', top: '10'}}/>
        <Image style = {{width: '100%', height: '80%', resizeMode: 'contain'}} source = {{uri: route.params.data.product.image}} />
        <Text>{route.params.data.product.title}</Text>
        <Button title="reserve" onPress={()=>{
          setModalOpen(!modalOpen);
          }}/>
        <Modal transparent animationType="slide" visible={modalOpen} style={{justifyContent: 'flex-end'}}>
            <View style={{width: '100%', height: '50%', position: 'absolute', bottom: 0, backgroundColor: 'white'}}>
    <Calendar
      markedDates={{...othersMarkedDates, ...myMarkedDates}}
      markingType={'period'}
      onDayPress={handleDayPress}
    />
    {picked?<Button title="rent" onPress={()=>{
      // db.collection("chatGroups").doc(route.params.data.id).update({[`markedDates.${auth.currentUser.uid}`]: markedDates});
      console.log('HELLOOOOOO');
      for (var el in myMarkedDates) {
        myMarkedDates[el] = {...myMarkedDates[el], color: 'green'}
      }
      db.collection("chatGroups").doc(route.params.data.id).update({'markedDates': {...othersMarkedDates, ...myMarkedDates}});
      setModalOpen(false);
    }} />:<></>}
        <Button title="close" onPress={()=>{setModalOpen(!modalOpen)}} />
        </View></Modal>
        </SafeAreaView>;
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