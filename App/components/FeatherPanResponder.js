import React, {useState, useEffect} from 'react';
import {View, Text, PanResponder, Animated, Dimensions} from 'react-native';

const data = ["hello", 'world', 'hi', 'hey'];

const FeatherList = () => {
    var getBackPrev = [];
    var ypositions = [];

    return data.map((item)=> <FeatherPanResponder text={item} index = {data.indexOf(item)} getBackPrev = {getBackPrev} ypositions = {ypositions} />);

}
const FeatherPanResponder = ({text, index, getBackPrev, ypositions}) => {
    //const [done, setDone] = useState(false);
    const [indexState, setIndexState] = useState(index);
    const [ypositionState, setYPositionState] = useState(0);
    const yposition = new Animated.Value(ypositionState);
    console.log('index', index, 'yposition', yposition);

    useEffect(()=> {
        if (indexState > 0) {
            resetAnimation();
        }
    }), [indexState];
    const resetAnimation = () => {
        Animated.timing(yposition, {
          useNativeDriver: false,
          toValue: 0,
          delay: 0,
          duration: 300,
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
        onStartShouldSetPanResponder: (event, gesture) => true,
        onPanResponderMove: (event, gesture) => {
            yposition.setValue(gesture.dy);
            //console.log(yposition);
        },
        onPanResponderGrant: (event, gesture) => {
        },
        onPanResponderRelease: (event, gesture) => {
            if (gesture.dy > 200) {
                //if (index == data.length-1) return;
                console.log('swipe up');
                swipeUpAnimation();
                const thisPrev = () => {
                    //setDone(false);
                    setIndexState(index);
                    // console.log('resetanimation', yposition);
                };
                getBackPrev.push(thisPrev);
                ypositions.push(yposition);
                //setDone(true);
                setIndexState(-100);
                setYPositionState(1000 + index);
            } else if (gesture.dy < -200) {
                console.log('swipe down', getBackPrev.length);
                if (getBackPrev.length > 0) {
                    (getBackPrev.pop())();
                    resetAnimation();

                }

            } else if ( Math.abs(gesture.dy) < 200) {
                resetAnimation();
            }
        }
     });
     


    return <Animated.View style={{justifyContent: 'center', position: 'absolute', top: yposition, zIndex: indexState, borderColor: 'black', borderWidth: 1, backgroundColor: 'yellow', height: '100%', width: '100%'}} {...panResponder.panHandlers} ><Text>{text}</Text></Animated.View>
}

const MinimalFeatherParent = () => {
    const yposition1 = new Animated.ValueXY();
    const yposition2 = new Animated.ValueXY();
    return <View style={{position: 'absolute', height: '100%', width: '100%', backgroundColor: 'black'}}>
        <FeatherChild ypos = {yposition1} ypos2 = {yposition2} index = {1} />
        <FeatherChild ypos = {yposition2} ypos2 = {yposition1} index = {2} />
    </View>
}

const FeatherChild = ({ypos, index, ypos2}) => {
    const top = index==2;
    const outofwayAnimation = () => {
        const newLeft = ypos.getLayout().left>Dimensions.get('window').width?-500:1000;
        Animated.timing(ypos, {
          useNativeDriver: false,
          toValue: {y:1000, x: newLeft},
          delay: 0,
          duration: 300,
        }).start();
      };
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (event, gesture) => true,
        onPanResponderMove: (event, gesture) => {
            if (gesture.dy > 0) {
            ypos.setValue({ x: gesture.dx, y: gesture.dy });
            } else if (gesture.dy < 0) {
                if (!top) {
                    ypos2.setValue({y: Dimensions.get('window').height + gesture.dy, x: 1000});
                }
            }
        
        },
        onPanResponderRelease: (event, gesture) => {
            if (gesture.dy > 0) {
                outofwayAnimation();
            } else if (gesture.dy < 0) {
                if (!top) {
                    Animated.timing(ypos2, {
                        useNativeDriver: false,
                        toValue: {y:0, x: 0},
                        delay: 0,
                        duration: 300,
                      }).start();
                }
            }
        }

     });
     return <Animated.View style={{justifyContent: 'center', position: 'absolute', top: ypos.getLayout().top, left: ypos.getLayout().left, borderColor: 'black', borderWidth: 1, backgroundColor: top?'yellow':'green', height: '100%', width: '100%'}} {...panResponder.panHandlers} ></Animated.View>;
}

export default MinimalFeatherParent;