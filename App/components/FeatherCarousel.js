import React, {useState, useRef} from 'react';
import {View, Text, ScrollView, Button, Animated} from 'react-native';
import Swiper from 'react-native-deck-swiper';

const data = ['hello', 'world', 'hi', 'DO', 'MORE', 'OF', 'WHAT', 'MAKES', 'YOU', 'HAPPY'];


const FeatherCarousel = () => {
    var globalIndex = 0;
var previousIndex = 0;

    const swiper = useRef();

    const Card = ({index, card}) => {
        const [fade, setFade] = useState(new Animated.Value(0.5));
    
        const startAnimation = () => {
            Animated.timing(fade, {
              useNativeDriver: false,
              toValue: 1,
              delay: 0,
              duration: 200,
            }).start();
          };
    
          const startAnimation2 = () => {
            Animated.timing(fade, {
              useNativeDriver: false,
              toValue: 0.5,
              delay: 0,
              duration: 200,
            }).start();
          };
    
          const resetAnimation = () => {
            Animated.timing(fade, {
              useNativeDriver: false,
              toValue: 0.5,
              delay: 0,
              duration: 700,
            }).start();
          };
    
          const resetAnimation2 = () => {
            Animated.timing(fade, {
              useNativeDriver: false,
              toValue: 0.2,
              delay: 0,
              duration: 700,
            }).start();
          };
    
          if (previousIndex > globalIndex) {
              resetAnimation();
          } else if (previousIndex < globalIndex) {
              resetAnimation2();
          }
          
          if (index === globalIndex) startAnimation();
          if (index === globalIndex - 1) startAnimation2();
        return <Animated.View style={{
            height: 500,
            width: 300,
            backgroundColor: 'white',
            opacity: fade,
    
            alignSelf: 'center',
        }}>
            <Text style={styles.text}>{card}</Text>
        </Animated.View>
    }

    return <Swiper
    ref = {swiper}
    goBackToPreviousCardOnSwipeTop={true}
    cards={data}
    animateCardOpacity={true}
    renderCard={(card) => {
        
        const index = data.indexOf(card);
        console.log('local index', index);
        return <Card index={index} card={card} />;
    }}
    // onSwiped={(cardIndex) => {
    //     console.log("current card index", cardIndex);
    //     globalIndex = cardIndex+1;
    // }}
    stackSeparation={-20}
    onSwipedBottom={(cardIndex) => {
        console.log("swipe bottom", cardIndex);
        globalIndex = cardIndex+1;
        previousIndex = cardIndex;
    }}
    onSwipedTop={(cardIndex) => {
        console.log('swiped top');
        globalIndex = cardIndex-1;
        previousIndex = cardIndex;
        //swiper.swipeBack();
    }}
    swipeBackCard={<View style={{backgroundColor:'yellow'}}/>}
    
    canSwipeBack={true}
    onSwipedAll={() => {console.log('onSwipedAll')}}
    cardIndex={0}
    backgroundColor={'#4FD0E9'}
    stackSize= {3}>
    <Button
        onPress={() => {console.log('oulala')}}
        title="Press me">
        You can press me
    </Button>
</Swiper>



}



const styles={
    card: {
        height: 500,
        width: 300,
        backgroundColor: 'white',

        alignSelf: 'center',
    },
    text: {
        fontSize:12,
    }
}

export default FeatherCarousel;