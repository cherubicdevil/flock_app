import React, {useState, useEffect, useContext} from 'react';
import {View, Text, PanResponder, Animated, Dimensions,Image} from 'react-native';
import {constants } from 'App/constants';
import {useDispatch, useSelector, useStore} from 'react-redux';
import {fetchAlbums} from 'App/utils';
import NewVideoPage from 'App/components/screens/videopage/NewVideoPage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const data = ["hello",'world', 'data', 'i', 'am', 'so', 'sad'];


const FeatherList = ({navigation, route, data=data, viewHeight, type="flock"}) => {

    const store = useStore();
    const dispatch = useDispatch();
    // const select = useSelector(state=>state.videopage);

    const [currentIndex, setCurrentIndex] = useState({curr: data.length - 1, prev: data.length});
    
    useEffect(()=>{
        setCurrentIndex({curr:data.length - 1, prev:data.length});
        dispatch({type:'sendCarouselIndex', payload: data.length - 1});

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
// console.log('wtf',data); // LKJH
    return <View 
        style={{alignItems: 'center', height: '100%', width: '100%', backgroundColor: constants.PINK_BACKGROUND,}}>
            {data.map((item)=> {
                return <FeatherPanResponder 
            navigation={navigation}
            route={route}
            key= {
                item.id
            }
        type={type} viewHeight={viewHeight} index = {data.indexOf(item)} currIndex = {currentIndex} setCurrentIndex={setCurrentIndex} positions = {positions} content={item} />})}
    </View>

}
const FeatherPanResponder = React.memo(({navigation, route, index, positions, currIndex, setCurrentIndex, content, viewHeight, type}) => {
    const select = useSelector(state=>state.miscel);
    const resetSelector = useSelector(state=>state.videopage);
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
        // const getDiminishingBotOffset = (topdecay, previoustop)
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


    // if (index == currentIndex && currentIndex < previousIndex) {
    //     var [topAnim, setTopAnim] = useState(new Animated.Value(50));
    // } else {
    // var [topAnim, setTopAnim] = useState(new Animated.Value(previoustop));
    // }

    var [topAnim, setTopAnim] = useState(new Animated.Value(0));
    // const widthAnim = new Animated.Value(top);

    useEffect(()=>{
        if (type ==="flock") {
            // console.log('hellooooooo please reset');
            // Animated.timing(positions[index], {
            //     useNativeDriver: false,
            //     toValue: {y:0, x: 0},
            //     delay: 0,
            //     duration: 200,
            //   }).start();
            const globalIndex = resetSelector.carIndexFlock;
            setCurrentIndex({curr: globalIndex, prev:globalIndex-1});
            // setCurrentIndex({curr:9, prev: 8});
        }
    }, [resetSelector.resetFlock]);

    useEffect(()=>{
        if (type ==="rent") {
            // Animated.timing(positions[index], {
            //     useNativeDriver: false,
            //     toValue: {y:0, x: 0},
            //     delay: 0,
            //     duration: 200,
            //   }).start();
            // setCurrentIndex({curr:9, prev: 8});
            const globalIndex = resetSelector.carIndexRent;
            setCurrentIndex({curr: globalIndex, prev:globalIndex-1});
        }
    }, [resetSelector.resetRent]);

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

        if (index < currentIndex) {
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
        }
        
          if (index == currentIndex ) {
            //   if (previousIndex>currentIndex) {
            // console.log('minus one and plus one', positions[index], topAnim);
            //   }
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

        // if (index == currentIndex && currentIndex<previousIndex) {
        //     pararr.push(Animated.timing(widthAnim, {
        //         useNativeDriver: false,
        //         toValue: newwidth,
        //         delay: animdelay,
        //         duration: animtime,
        //       }));
    
        //       pararr.push(Animated.timing(leftAnim, {
        //         useNativeDriver: false,
        //         toValue: nextleft,
        //         delay: animdelay,
        //         duration: animtime,
        //       }));
    
        //       pararr.push(Animated.timing(positions[index].getLayout().top, {
        //         useNativeDriver: false,
        //         toValue: 0,
        //         delay: animdelay,
        //         duration: animtime,
        //       }));

        // //   pararr.push(Animated.timing(topAnim, {
        // //     useNativeDriver: false,
        // //     toValue: nexttop,
        // //     delay: 0,
        // //     duration: animtime,
        // //   }));
        // }

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
    const outofwayAnimation = (right) => {
        const newLeft = right?1000:-1000; // ypos.getLayout().top , left
        Animated.timing(position, {
          useNativeDriver: false,
          toValue: {y:500, x: newLeft},
          delay: 0,
          duration: 300,
        }).start();
      };
      var isDown = false; // these are to get rid of bug where it is up then down in quick succession
      var isUp = false;
      const panResponder = PanResponder.create({
          onPanResponderTerminationRequest:(event, gesture) => true,
        // onMoveShouldSetPanResponderCapture:(event, gesture)=>Math.abs(gesture.dy)/Math.abs(gesture.dx)>2,
        onMoveShouldSetPanResponder:(event, gesture)=> !select.commentsModal
        //  && Math.abs(gesture.dy)/Math.abs(gesture.dx)>2
         ,
        // onStartShouldSetPanResponder: (event, gesture) => true,
        onPanResponderMove: (event, gesture) => {
            if (gesture.dy > 0) {
                if (isUp) {
                    if (isTop) {
                        position.setValue({ x: gesture.dx, y: gesture.dy });
                    } else {
                        positions[index+1].setValue({y: gesture.dy-500, x: 0+ gesture.dx});
                    }
                    return;
                }
                if (!isDown && !isUp) {
                    isDown = true;
                    isUp = false;
                }
                if (isDown) {
            position.setValue({ x: gesture.dx, y: gesture.dy });
                }
            } else if (gesture.dy < 0) {
                if (isDown) {
                    position.setValue({ x: gesture.dx, y: -gesture.dy });
                    return;
                }
                if (!isDown && !isUp) {
                    isUp = true;
                    isDown = false;
                }
                if (isUp) {
                    if (positions[index+1] !== undefined) {
                    positions[index+1].setValue({y: gesture.dy-500, x: 0+ gesture.dx});
                    } else {
                        position.setValue({ x: gesture.dx, y: gesture.dy });
                    }
                }
            }
        
        },
        onPanResponderRelease: (event, gesture) => {
            isUp = false;
            isDown = false;
            if (Math.abs(gesture.dy) < 20 ) {
                // console.log('hello');
                Animated.timing(positions[index], {
                    useNativeDriver: false,
                    toValue: {y:0, x: 0},
                    delay: 0,
                    duration: 200,
                  }).start();
                  return;
            }
            if (gesture.dy > 0) {
                if (isUp && !isTop) {
                    Animated.timing(positions[index], {
                        useNativeDriver: false,
                        toValue: {y:0, x: 0},
                        delay: 0,
                        duration: 200,
                      }).start();
                    return;
                }
                outofwayAnimation(gesture.dx > 0);
                setTimeout(()=>{
                    setCurrentIndex({curr:currentIndex - 1, prev: currentIndex});

                    // dispatch({type: 'sendCarouselIndex', payload: currentIndex - 1});

                }, 200);
                //setCurrentIndex(currentIndex - 1);
                setTimeout(()=>{
                    if (type === "flock") {
                        dispatch({type: 'sendCarouselFlockIndex', payload: currentIndex - 1});
                    } else if (type === "rent") {
                        dispatch({type: 'sendCarouselRentIndex', payload: currentIndex - 1});
                    } else {
                        dispatch({type: 'sendCarouselIndex', payload: currentIndex - 1});
                    }
                }, 700);
                
                // dispatch({type: 'sendCarouselIndex', payload: currentIndex - 1});

                // console.log("changing flock carindex", currentIndex - 1);
            } else if (gesture.dy < 0) {
                if (!isTop) {
                    // Animated.timing(positions[index+1], {
                    //     useNativeDriver: false,
                    //     toValue: {y:-1000, x: 0},
                    //     delay: 0,
                    //     duration: 500,
                    //   }).start();
                      //setCurrentIndex(current+1);
                      setTimeout(()=>{
                        setCurrentIndex({curr:currentIndex + 1, prev: currentIndex});
                        // dispatch({type: 'sendCarouselIndex', payload: currentIndex + 1});
                    }, 0);
                    //   dispatch({type: 'sendCarouselIndex', payload: currentIndex + 1});
                    setTimeout(()=>{
                        if (type === "flock") {
                            dispatch({type: 'sendCarouselFlockIndex', payload: currentIndex + 1});
                        } else if (type === "rent") {
                            dispatch({type: 'sendCarouselRentIndex', payload: currentIndex + 1});
                        } else {
                            dispatch({type: 'sendCarouselIndex', payload: currentIndex + 1});
                        }
                    }, 700);
                    //   console.log("changing carindex", currentIndex + 1);
                } else {
                    Animated.timing(positions[index], {
                        useNativeDriver: false,
                        toValue: {y:0, x: 0},
                        delay: 0,
                        duration: 200,
                      }).start();
                }
            }
        }

     });
     

     

    //  console.log(position.x._value + 'hi', 'left');
    return <Animated.View style={{
        transform: [
            // { rotateY: "45deg" },
            { rotateZ: position.getLayout().left.interpolate({
                inputRange: [0, Dimensions.get('window').width],
                outputRange: ['0deg', '45deg'] })} // lkjh
          ],
        borderTopLeftRadius: 70, borderTopRightRadius: 70, overflow: 'hidden', alignSelf: 'center', opacity: fade, justifyContent: 'center', position: 'absolute', top: position.getLayout().top, marginTop: topAnim, marginLeft: leftAnim, left: position.getLayout().left, zIndex: index + 50, height: viewHeight, paddingBottom: '10%', width: widthAnim, borderWidth:0, backgroundColor: 'white'}} {...panResponder.panHandlers}>
            {/* <Animated.View style={{position: 'absolute', zIndex: 400, top: 30, right:30, opacity: position.getLayout().top
            .interpolate({
                inputRange: [-500,-100,0, 100],
                outputRange: [0,1,0,1] })
            }}
                >
                <Image source={require('App/Assets/Images/updown_swipe.png')} style={{height: 70, width: 70, shadowOpacity:0.2, shadowOffset:{height:5, width:0}, shadowRadius:5,}} />
            </Animated.View> */}
            <NewVideoPage key={content.id} route={route} navigation={navigation} data={content} index={index} currIndex={index} viewHeight={viewHeight} />
            {/* {content} */}
            </Animated.View>

});

export default FeatherList;