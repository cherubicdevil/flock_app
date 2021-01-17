import React, {useState, useEffect} from 'react';
import {View, Text, PanResponder, Animated, Dimensions} from 'react-native';

const data = ["hello", 'world', 'hi', 'hey'];

const FeatherList = () => {
    const [currentIndex, setCurrentIndex] = useState(data.length - 1);

    var positions = [];
    for (const item of data) {
        positions.push(new Animated.ValueXY());
    }

    return <View style={{alignItems: 'center', height: '100%', width: '100%'}}>{data.map((item)=> <FeatherPanResponder index = {data.indexOf(item)} currentIndex = {currentIndex} setCurrentIndex={setCurrentIndex} positions = {positions} />)}</View>

}
const FeatherPanResponder = ({index, positions, currentIndex, setCurrentIndex}) => {
    var percentage = 1;
    var topPercentage = 1;
    var width = Dimensions.get('window').width;
    var top = 50;

    const fade = new Animated.Value(0.3);


    if (index > currentIndex) {

    } else {
        const diff = currentIndex - index;
        percentage = percentage * Math.pow(0.95, diff);
        topPercentage = topPercentage * Math.pow(0.8, diff);
        top = Math.round(topPercentage * top);
        width = Math.round(percentage * width);
    }

    const [widthAnim, setWidthAnim] = useState(new Animated.Value(width));

    useEffect(()=>{
        console.log('fade change', fade);
        if (index == currentIndex) {
        Animated.timing(fade, {
            useNativeDriver: false,
            toValue: 1,
            delay: 0,
            duration: 1000,
          }).start();
        }
        Animated.timing(widthAnim, {
            useNativeDriver: false,
            toValue: width,
            delay: 0,
            duration: 1000,
          }).start();
    }, [currentIndex]);

    //const [done, setDone] = useState(false);
    const position = positions[index];
    const isTop = index == positions.length - 1;
    const outofwayAnimation = () => {
        const newLeft = 1000; // ypos.getLayout().top , left
        Animated.timing(position, {
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
            position.setValue({ x: gesture.dx, y: gesture.dy });
            } else if (gesture.dy < 0) {
                if (!isTop) {
                    positions[index+1].setValue({y: Dimensions.get('window').height + gesture.dy, x: 1000});
                }
            }
        
        },
        onPanResponderRelease: (event, gesture) => {
            if (gesture.dy > 0) {
                outofwayAnimation();
                setTimeout(()=>setCurrentIndex(currentIndex - 1), 200);
                //setCurrentIndex(currentIndex - 1);
            } else if (gesture.dy < 0) {
                if (!isTop) {
                    Animated.timing(positions[index+1], {
                        useNativeDriver: false,
                        toValue: {y:0, x: 0},
                        delay: 0,
                        duration: 300,
                      }).start();
                      //setCurrentIndex(current+1);
                      setTimeout(()=>setCurrentIndex(currentIndex + 1), 200);
                }
            }
        }

     });
     

     const leftMargin = Dimensions.get('window').width * (1-percentage) / 2;
    return <Animated.View style={{alignSelf: 'center', opacity: fade, justifyContent: 'center', position: 'absolute', top: position.getLayout().top, marginTop: top, marginLeft: leftMargin, left: position.getLayout().left, zIndex: index + 50, borderColor: 'black', borderWidth: 1, backgroundColor: 'yellow', height: '100%', width: width}} {...panResponder.panHandlers} ></Animated.View>
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

export default FeatherList;