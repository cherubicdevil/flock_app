import React, {useState} from 'react';
import {View, Text, ScrollView, Button, Animated} from 'react-native';
import Swiper from 'react-native-deck-swiper';

const data = ['hello', 'world', 'hi', 'DO', 'MORE', 'OF', 'WHAT', 'MAKES', 'YOU', 'HAPPY'];
var globalIndex = 0;

const FeatherCarousel = () => {
    return <Swiper
    cards={data}
    renderCard={(card) => {
        
        const index = data.indexOf(card);
        console.log('local index', index);
        return <Card index={index} card={card} />;
    }}
    onSwiped={(cardIndex) => {
        console.log("current card index", cardIndex);
        globalIndex = cardIndex+1;
    }}
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

const Card = ({index, card}) => {
    const [fade, setFade] = useState(new Animated.Value(0.8));

    const startAnimation = () => {
        Animated.timing(fade, {
          useNativeDriver: false,
          toValue: 1,
          delay: 0,
          duration: 300,
        }).start();
      };

      if (index === globalIndex) startAnimation();
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