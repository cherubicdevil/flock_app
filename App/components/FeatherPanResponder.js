import React, {useState, useEffect} from 'react';
import {View, Text, PanResponder, Animated, Dimensions} from 'react-native';

const data = ["hello", 'world', 'hi', 'hey'];

const FeatherList = () => {
    const [currentIndex, setCurrentIndex] = useState({curr: data.length - 1, prev: data.length});

    var positions = [];
    for (const item of data) {
        positions.push(new Animated.ValueXY());
    }

    return <View style={{alignItems: 'center', height: '100%', width: '100%'}}>{data.map((item)=> <FeatherPanResponder index = {data.indexOf(item)} currIndex = {currentIndex} setCurrentIndex={setCurrentIndex} positions = {positions} />)}</View>

}
const FeatherPanResponder = ({index, positions, currIndex, setCurrentIndex}) => {
    var percentage = 1;
    var topPercentage = 1;

    var top = 50;
    const {curr: currentIndex, prev: previousIndex} = currIndex;

    var fade = new Animated.Value(0.3);
    if (currentIndex > index) {
        fade = new Animated.Value(1);
    }

    var previouswidth = Dimensions.get('window').width;
        var diff = previousIndex - index;
        percentage = Math.pow(0.95, diff);
        previouswidth = Math.round(percentage * previouswidth);

        topPercentage = 1;
        percentage=1;
        var newwidth = Dimensions.get('window').width;
        var diff = Math.max(currentIndex - index, 0);
        percentage = percentage * Math.pow(0.95, diff);
        newwidth = Math.round(percentage * newwidth);

    const widthAnim = new Animated.Value(newwidth);
    // const widthAnim = new Animated.Value(top);

    
    useEffect(()=>{
        const animations = [];
        console.log(index, fade);
        if (index == currentIndex) {
        // Animated.timing(fade, {
        //     useNativeDriver: false,
        //     toValue: 1,
        //     delay: 0,
        //     duration: 1000,
        //   }).start();
        animations.push(Animated.timing(fade, {
            useNativeDriver: false,
            toValue: 1,
            delay: 0,
            duration: 1000,
          }));
        } else if (index == currentIndex - 1) {
            // Animated.timing(fade, {
            //     useNativeDriver: false,
            //     toValue: 0.3,
            //     delay: 1100,
            //     duration: 2000,
            //   }).start();
            animations.push(Animated.timing(fade, {
                useNativeDriver: false,
                toValue: 0.3,
                delay: 0,
                duration: 2000,
              }));
        }
        const pararr = [];
        if (index !== currentIndex) {
        // pararr.push(Animated.timing(widthAnim, {
        //     useNativeDriver: false,
        //     toValue: newwidth,
        //     delay: 1000,
        //     duration: 1000,
        //   }));

        //   pararr.push(Animated.timing(topAnim, {
        //     useNativeDriver: false,
        //     toValue: top,
        //     delay: 1000,
        //     duration: 1000,
        //   }));
        }

          Animated.parallel([...animations, ...pararr]).start();
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
                    positions[index+1].setValue({y: Dimensions.get('window').height + gesture.dy, x: 300 +gesture.dx});
                }
            }
        
        },
        onPanResponderRelease: (event, gesture) => {
            if (gesture.dy > 0) {
                outofwayAnimation();
                setTimeout(()=>setCurrentIndex({curr:currentIndex - 1, prev: currentIndex}), 200);
                //setCurrentIndex(currentIndex - 1);
            } else if (gesture.dy < 0) {
                if (!isTop) {
                    Animated.timing(positions[index+1], {
                        useNativeDriver: false,
                        toValue: {y:0, x: 0},
                        delay: 0,
                        duration: 1000,
                      }).start();
                      //setCurrentIndex(current+1);
                      setTimeout(()=>setCurrentIndex({curr: currentIndex + 1, prev: currentIndex}), 1000);
                }
            }
        }

     });
     

     const leftMargin = Dimensions.get('window').width * (1-percentage) / 2;
    return <Animated.View style={{alignSelf: 'center', opacity: fade, justifyContent: 'center', position: 'absolute', top: position.getLayout().top, marginTop: top, marginLeft: leftMargin, left: position.getLayout().left, zIndex: index + 50, borderColor: 'black', borderWidth: 1, backgroundColor: 'yellow', height: '100%', width: widthAnim}} {...panResponder.panHandlers} ></Animated.View>
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