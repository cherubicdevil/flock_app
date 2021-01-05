import React, {useState, useRef} from 'react';
import {View, Text, SafeAreaView, Image, Modal, Button} from 'react-native';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
var seedrandom = require('seedrandom');


const FlockReserve = ({navigation, route}) => {
    const [picked, setPicked] = useState(false);
    const [markedDates, setMarkedDates] = useState({
        '2021-01-20': {textColor: 'green'},
        '2021-01-22': {startingDay: true, color: 'green'},
        '2021-01-23': {selected: true, endingDay: true, color: 'green', textColor: 'gray'},
        '2021-01-04': {disabled: true, startingDay: true, color: 'green', endingDay: true}
      });
      const markPeriod = (start, duration=4, options) => {
          const day = start;
          const marked = {};
        for (var i = 1; i < duration - 1; i++) {
            marked[moment(day.dateString).add(i, 'days').format('YYYY-MM-DD')] = options;
        }
          marked[day.dateString] = {
            startingDay: true,...options
          };
          marked[moment(day.dateString).add(duration-1, 'days').format('YYYY-MM-DD')] = {endingDay: true, ...options};
          setMarkedDates(marked);
      } 
    const handleDayPress = (day) => {
        // if (markedDates[day.dateString]) {
        //     markPeriod(4, {});
        //     console.log(markedDates);
        //     return;
        // }
        setPicked(true);
        markPeriod(start=day, duration=4, options={color: 'green'});
        console.log(markedDates);
        
      }
    const cal = useRef();
    const [modalOpen, setModalOpen] = useState(false);
    console.log(route.params);
    return <SafeAreaView>
        <Button title="back" onPress={()=>navigation.goBack()} style={{position: 'absolute', top: '10'}}/>
        <Image style = {{width: '100%', height: '80%', resizeMode: 'contain'}} source = {{uri: route.params.data.product.image}} />
        <Text>{route.params.data.product.title}</Text>
        <Button title="reserve" onPress={()=>{setModalOpen(!modalOpen)}}/>
        <Modal transparent animationType="slide" visible={modalOpen} style={{justifyContent: 'flex-end'}}>
            <View style={{width: '100%', height: '50%', position: 'absolute', bottom: 0, backgroundColor: 'white'}}>
    <Calendar
      markedDates={markedDates}
      markingType={'period'}
      onDayPress={handleDayPress}
    />
    {picked?<Button title="rent" />:<></>}
        <Button title="close" onPress={()=>{setModalOpen(!modalOpen)}} />
        </View></Modal>
        </SafeAreaView>;
}

export default FlockReserve;