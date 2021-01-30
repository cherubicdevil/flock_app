import React, {useState, useEffect, useContext} from 'react';
import {View, Text, PanResponder, Animated, Dimensions} from 'react-native';
import {constants } from 'App/constants';
import {useDispatch, useSelector, useStore} from 'react-redux';
import {fetchAlbums} from 'App/utils';
import NewVideoPage from 'App/components/screens/videopage/NewVideoPage';
import { useFocusEffect } from '@react-navigation/native';

const data = ["hello",'world', 'data', 'i', 'am', 'so', 'sad'];


const FeatherList = ({navigation, route, data=data, viewHeight, type="flock"}) => {
    const store = useStore();
    const dispatch = useDispatch();
    // const select = useSelector(state=>state.videopage);

    const [currentIndex, setCurrentIndex] = useState({curr: data.length - 1, prev: data.length});
    
    useEffect(()=>{
        setCurrentIndex({curr:data.length - 1, prev:data.length});
        dispatch({type:'sendCarouselIndex', payload: data.length - 1});
        console.log('changingSHIt');
    }, [data.length]);


    // useEffect(()=> {
    //     console.log(route.name);
    //     if (route.name === "for you") {
    //         dispatch({type: 'leave', payload: false});
    //     } else {
    //         dispatch({type: 'leave', payload: true});
    //     }

    // }, [route.key]);

    useFocusEffect(
        React.useCallback(() => {
            dispatch({type: 'leave', payload: false});
            //setCurrentIndex()
            var carIndex;
            if (type==="rent") {
                carIndex = store.getState().videopage.carIndexRent;
            } else if (type === "flock") {
                carIndex = store.getState().videopage.carIndexFlock;
            } else {
                carIndex = store.getState().videopage.carIndex;
            }
            // const carIndex = store.getState().videopage.carIndex;
            setTimeout(()=>setCurrentIndex({curr: carIndex, prev: carIndex+1}), 0);
            // console.log("CARINDEX:", carIndex);
          return ()=>{
              dispatch({type: 'leave', payload: true});
            //   console.log(store.getState().videopage.carIndex);
        };
        }, [])
      );


    var positions = [];
    for (const item of data) {
        // var [positionInstance, _] = useState(new Animated.ValueXY());
        // positions.push(positionInstance);
        positions.push(new Animated.ValueXY());
    }

    return <View 
        style={{alignItems: 'center', height: '100%', width: '100%', backgroundColor: constants.PINK_BACKGROUND}}>
            {data.map((item)=> <FeatherPanResponder type={type} viewHeight={viewHeight} index = {data.indexOf(item)} currIndex = {currentIndex} setCurrentIndex={setCurrentIndex} positions = {positions} content={item} />)}
    </View>

}
const FeatherPanResponder = ({index, positions, currIndex, setCurrentIndex, content, viewHeight, type}) => {
    
    const dispatch = useDispatch();
    
    var previouspercentage = 1;
    var nextpercentage = 1;
    var topPercentage = 1;

    var previoustop = 50;
    var nexttop = 50;
    const widthdecay = 0.95;
    const topdecay = .5;

    const animdelay = 0;
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
            return 0;
        }
    }

    var init = getFade(index, previousIndex);
    if (currentIndex > index) {
        init = 1;
    }
    const [fade, setFade] = useState(new Animated.Value(init));


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


        var previousleft = Dimensions.get('window').width * (1-previouspercentage) / 2;
        var nextleft = Dimensions.get('window').width * (1-nextpercentage) / 2;


    const [widthAnim, setWidthAnim] = useState(new Animated.Value(previouswidth));
    const [leftAnim, setLeftAnim] = useState(new Animated.Value(previousleft));
    const [topAnim, setTopAnim] = useState(new Animated.Value(previoustop));
    // const widthAnim = new Animated.Value(top);

    
    useEffect(()=>{
        const animations = [];
        const pararr = [];
        if (index == currentIndex) {
        animations.push(Animated.timing(fade, {
            useNativeDriver: false,
            toValue: 1,
            delay: animdelay,
            duration: animtime,
          }));
        }
        // } else if (index == currentIndex - 1) {
        //     animations.push(Animated.timing(fade, {
        //         useNativeDriver: false,
        //         toValue: 0.3,
        //         delay: 0,
        //         duration: 2000,
        //       }));
        // }

        if (index < currentIndex - 1) {
            pararr.push(Animated.timing(fade, {
                useNativeDriver: false,
                toValue: initialFade,
                delay: animdelay,
                duration: animtime,
              }));
        } else if (index == currentIndex - 1) {
            pararr.push(Animated.timing(fade, {
                useNativeDriver: false,
                toValue: secondFade,
                delay: animdelay,
                duration: animtime,
              }));
        }
        // pararr.push(Animated.timing(fade, {
        //     useNativeDriver: false,
        //     toValue: getFade(index, currentIndex),
        //     delay: 0,
        //     duration: 2000,
        //   }));

        if (index <= currentIndex) {
        pararr.push(Animated.timing(widthAnim, {
            useNativeDriver: false,
            toValue: newwidth,
            delay: animdelay,
            duration: animtime,
          }));

          pararr.push(Animated.timing(leftAnim, {
            useNativeDriver: false,
            toValue: nextleft,
            delay: animdelay,
            duration: animtime,
          }));

          pararr.push(Animated.timing(topAnim, {
            useNativeDriver: false,
            toValue: nexttop,
            delay: animdelay,
            duration: animtime,
          }));

        //   pararr.push(Animated.timing(topAnim, {
        //     useNativeDriver: false,
        //     toValue: nexttop,
        //     delay: 0,
        //     duration: animtime,
        //   }));
        }

        if (index > currentIndex) {
            pararr.push(Animated.timing(topAnim, {
                useNativeDriver: false,
                toValue: 1000,
                delay: animdelay,
                duration: 0,
              }));
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
      var isUp = false;
      var isDown = false;
      const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (event, gesture) => true,
        onPanResponderMove: (event, gesture) => {
            if (gesture.dy > 0) {
                if (isUp) return;
                isDown = true;
            position.setValue({ x: gesture.dx, y: gesture.dy });
            } else if (gesture.dy < 0) {
                if (isDown) return;
                if (!isTop) {
                    positions[index+1].setValue({y: Dimensions.get('window').height + gesture.dy, x: 300 +gesture.dx});
                }
            }
        
        },
        onPanResponderRelease: (event, gesture) => {
            isUp = false;
            isDown = false;
            if (gesture.dy > 0) {
                outofwayAnimation();
                setTimeout(()=>{
                    setCurrentIndex({curr:currentIndex - 1, prev: currentIndex});

                    // dispatch({type: 'sendCarouselIndex', payload: currentIndex - 1});
                }, 200);
                //setCurrentIndex(currentIndex - 1);
                
                // dispatch({type: 'sendCarouselIndex', payload: currentIndex - 1});
                if (type === "flock") {
                    dispatch({type: 'sendCarouselFlockIndex', payload: currentIndex - 1});
                } else if (type === "rent") {
                    dispatch({type: 'sendCarouselRentIndex', payload: currentIndex - 1});
                } else {
                    dispatch({type: 'sendCarouselIndex', payload: currentIndex - 1});
                }
                console.log("changing carindex", currentIndex - 1);
            } else if (gesture.dy < 0) {
                if (!isTop) {
                    Animated.timing(positions[index+1], {
                        useNativeDriver: false,
                        toValue: {y:0, x: 0},
                        delay: 0,
                        duration: 1000,
                      }).start();
                      //setCurrentIndex(current+1);
                      setTimeout(()=>{
                        setCurrentIndex({curr:currentIndex + 1, prev: currentIndex});
                        // dispatch({type: 'sendCarouselIndex', payload: currentIndex + 1});
                    }, 200);
                    //   dispatch({type: 'sendCarouselIndex', payload: currentIndex + 1});
                    if (type === "flock") {
                        dispatch({type: 'sendCarouselFlockIndex', payload: currentIndex + 1});
                    } else if (type === "rent") {
                        dispatch({type: 'sendCarouselRentIndex', payload: currentIndex + 1});
                    } else {
                        dispatch({type: 'sendCarouselIndex', payload: currentIndex + 1});
                    }
                      console.log("changing carindex", currentIndex + 1);
                }
            }
        }

     });
     

     

    return <Animated.View style={{borderTopLeftRadius: 70, borderTopRightRadius: 70, overflow: 'hidden', alignSelf: 'center', opacity: fade, justifyContent: 'center', position: 'absolute', top: position.getLayout().top, marginTop: topAnim, marginLeft: leftAnim, left: position.getLayout().left, zIndex: index + 50, height: viewHeight - 50, width: widthAnim, borderWidth:0, backgroundColor: 'white'}} {...panResponder.panHandlers}>{content}</Animated.View>

}

export default FeatherList;