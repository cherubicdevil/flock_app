import React, {useState, useEffect} from 'react';
import {View, Text, PanResponder, Animated, Dimensions} from 'react-native';
import {constants } from 'App/constants';

const data = ["hello",'world', 'data', 'i', 'am', 'so', 'sad'];

const FeatherList = () => {
    const [currentIndex, setCurrentIndex] = useState({curr: data.length - 1, prev: data.length});

    var positions = [];
    for (const item of data) {
        positions.push(new Animated.ValueXY());
    }

    return <View style={{alignItems: 'center', height: '100%', width: '100%', backgroundColor: constants.PINK_BACKGROUND}}>{data.map((item)=> <FeatherPanResponder index = {data.indexOf(item)} currIndex = {currentIndex} setCurrentIndex={setCurrentIndex} positions = {positions} text={item} 
    content={<View style={{height: '100%', width: '100%', borderRadius: 40, borderTopLeftRadius: 0, borderTopRightRadius: 0, backgroundColor: 'white', }} />}
    />)}</View>

}
const FeatherPanResponder = ({index, positions, currIndex, setCurrentIndex, content}) => {
    var previouspercentage = 1;
    var nextpercentage = 1;
    var topPercentage = 1;

    var previoustop = 50;
    var nexttop = 50;
    const widthdecay = 0.95;
    const topdecay = .5;

    const animtime = 300;
    const initialFade = 0.2;
    const secondFade = 0.5;

    const {curr: currentIndex, prev: previousIndex} = currIndex;

    const getFade = (curr, ref) => {
        if (curr < ref - 1) {
            return initialFade;
        } else if (curr == ref - 1) {
            return secondFade;
        } else {
            return 1;
        }
    }

    var fade = new Animated.Value(getFade(index, previousIndex));
    if (currentIndex > index) {
        fade = new Animated.Value(1);
    }

    var previouswidth = Dimensions.get('window').width;
        var diff = previousIndex - index;
        previouspercentage = Math.pow(widthdecay, diff);
        topPercentage =  Math.pow(topdecay, diff);
        previoustop = Math.round(topPercentage * previoustop);
        previouswidth = Math.round(previouspercentage * previouswidth);

        topPercentage = 1;
        nextpercentage=1;
        var newwidth = Dimensions.get('window').width;
        var diff = Math.max(currentIndex - index, 0);
        nextpercentage = nextpercentage * Math.pow(widthdecay, diff);
        topPercentage =  Math.pow(topdecay, diff);
        newwidth = Math.round(nextpercentage * newwidth);
        nexttop = Math.round(topPercentage * nexttop);

        // console.log(text, previouswidth, newwidth);

        var previousleft = Dimensions.get('window').width * (1-previouspercentage) / 2;
        var nextleft = Dimensions.get('window').width * (1-nextpercentage) / 2;


    const [widthAnim, setWidthAnim] = useState(new Animated.Value(previouswidth));
    const [leftAnim, setLeftAnim] = useState(new Animated.Value(previousleft));
    const [topAnim, setTopAnim] = useState(new Animated.Value(previoustop));
    // const widthAnim = new Animated.Value(top);

    
    useEffect(()=>{
        const animations = [];
        const pararr = [];
        console.log(index, fade);
        if (index == currentIndex) {
        animations.push(Animated.timing(fade, {
            useNativeDriver: false,
            toValue: 1,
            delay: 0,
            duration: 1000,
          }));
        }
        // } else if (index == currentIndex - 1) {
            // animations.push(Animated.timing(fade, {
            //     useNativeDriver: false,
            //     toValue: 0.3,
            //     delay: 0,
            //     duration: 2000,
            //   }));
        // }

        pararr.push(Animated.timing(fade, {
            useNativeDriver: false,
            toValue: getFade(index, currentIndex),
            delay: 0,
            duration: 2000,
          }));

        if (index <= currentIndex) {
        pararr.push(Animated.timing(widthAnim, {
            useNativeDriver: false,
            toValue: newwidth,
            delay: 0,
            duration: animtime,
          }));

          pararr.push(Animated.timing(leftAnim, {
            useNativeDriver: false,
            toValue: nextleft,
            delay: 0,
            duration: animtime,
          }));

          pararr.push(Animated.timing(topAnim, {
            useNativeDriver: false,
            toValue: nexttop,
            delay: 0,
            duration: animtime,
          }));

        //   pararr.push(Animated.timing(topAnim, {
        //     useNativeDriver: false,
        //     toValue: top,
        //     delay: 1000,
        //     duration: 1000,
        //   }));
        }

          Animated.sequence([Animated.parallel([...animations, ...pararr]), ]).start();
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
     

     
    return <Animated.View style={{alignSelf: 'center', opacity: fade, justifyContent: 'center', position: 'absolute', top: position.getLayout().top, marginTop: topAnim, marginLeft: leftAnim, left: position.getLayout().left, zIndex: index + 50, height: '100%', width: widthAnim}} {...panResponder.panHandlers} >{content}</Animated.View>
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