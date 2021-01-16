import React, {useState} from 'react';
import {View, Text, PanResponder, Animated, Dimensions} from 'react-native';

const data = ["hello", 'world', 'hi', 'hey'];

const FeatherList = () => {
    return data.map((item)=> <FeatherPanResponder text={item} index = {data.indexOf(item)} />);

}
const FeatherPanResponder = ({text, index}) => {
    const [done, setDone] = useState(false);
    const yposition = new Animated.Value(0);
    const resetAnimation = () => {
        Animated.timing(yposition, {
          useNativeDriver: false,
          toValue: 0,
          delay: 0,
          duration: 700,
        }).start();
      };

      const swipeUpAnimation = () => {
        Animated.timing(yposition, {
          useNativeDriver: false,
          toValue: -Dimensions.get('window').height,
          delay: 0,
          duration: 700,
        }).start();
      };
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gesture) => {
            yposition.setValue(gesture.dy);
            console.log(yposition);
        },
        onPanResponderGrant: (event, gesture) => {
        },
        onPanResponderRelease: (event, gesture) => {
            if (gesture.dy < -200) {
                console.log('swipe up');
                swipeUpAnimation();
                setDone(true);
            } else {
                resetAnimation();
            }
        }
     });
     
    return <>{done?<></>:<Animated.View style={{position: 'absolute', top: yposition, zIndex: index, borderColor: 'black', borderWidth: 1, backgroundColor: 'yellow', height: '100%', width: '100%'}} {...panResponder.panHandlers} ><Text>{text}</Text></Animated.View>}</>
}

export default FeatherList;