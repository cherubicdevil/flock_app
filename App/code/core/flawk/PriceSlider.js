import React, {useEffect, useState, useRef} from 'react';
import {constants} from 'App/constants';

const SplitComponent = ({splits}) => {
  const [proposedUserSplit, setProposedUserSplit] = useState(0);
  const [confirmedUserSplit, setConfirmedUserSplit] = useState(0);
  const [unconfirmed, setUnconfirmed] = useState(false);

  const [ConfirmButton, setConfirmHook] = useState(()=>{});
  const [CancelButton, setCancelHook]   = useState(()=>{});

  return <>
  <Splits length={w} splits={splits} setUserSplit={setProposedUserSplit} ConfirmButton={ConfirmButton} />
  <AdjustComponent 
              setConfirm = {setConfirmHook}
              setCancel = {setCancelHook}
              setUnconfirmed={setUnconfirmed} 
              setUserSplit={()=>{setUserSplit(proposedUserSplit)}}
          /></>

}


const AdjustComponent = ({confirmHook, cancelHook,
  setUnconfirmed, setUserSplit}) => {
  // setunconfirmed to false if cancel
  // set unconfirmed to false if confirm and adjust usersplit

  useEffect(()=>{
    confirmHook(<Button title="confirm" onPress={()=>{
      setUserSplit();
      setUnconfirmed(false);
    }}/>);
    cancelHook(<Button title="cancel" onPress={()=>{
      setUnconfirmed(false);
    }})
  }, [])

  return <>

  </>
}

const Splits = ({length, splits, setUserSplit, ConfirmButton}) => {
  const unallocated = 1 - Object.entries(splits)
                            .filter((a)=> a[0] !== user.uid)
                            .reduce((a,b)=> a[1]+b[1]);

  return <>
    <View style={{flexDirection: row}}>
    {Object.entries(splits)
                            .filter((a)=> a[0] !== user.uid)
                            .map((item) => <View style={{width: length * item[1]}} />)
                          }
    </View>
    <Slider length={length * unallocated} max={unallocated} />
      <View style={{borderRadius: 40, backgroundColor: constants.ORANGE, width: showPlusMinus?30:0, height: 30, marginLeft: 0, justifyContent: 'center', alignItems: 'center', zIndex: -40}}>
          
          <View style={{borderRadius: 40, backgroundColor: constants.ORANGE, width: showPlusMinus?30:0, height: 30, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity onPress={()=>{
            if (pricePercent>=minPercent + 4) {
              setPricePercent(pricePercent-4);
              setOutsideState(((pricePercent-4)*productPrice).toFixed(2));
              setChanged(true);
            } else if (pricePercent >= minPercent) {
              setPricePercent(minPercent);
              setOutsideState(((minPercent)*productPrice).toFixed(2));
              setChanged(true);
            }

            
          }}>
            <Icon name="minus" color="white" size={27} />
          </TouchableOpacity>
        </View>
            <ConfirmButton />
          <TouchableOpacity onPress={()=>{
            if (pricePercent < remainingPercent && pricePercent < 100) {
              setPricePercent(pricePercent+4);
              setOutsideState(((pricePercent+4)*productPrice).toFixed(2))
              setChanged(true);
            }
            
          }}>
            <Icon name="plus" color="white" size={27} />
          </TouchableOpacity>
        </View>
  </>;
}

const Slider = ({max, length}) => {

      return <>
    <MultiSlider
            values={[pricePercent]}
            onValuesChange={(stuff)=>{
              if (
                stuff[0] <= max
                ) {
              setPricePercent(stuff[0]);
              }
            }}
    markerStyle={{width: 40, height: 40, shadowOpacity:0}}
    selectedStyle={{backgroundColor: constants.BLUERGREY}}
    trackStyle={{height: 15, borderRadius: 0, borderTopLeftRadius: remainingPercent<100?0:20, borderBottomLeftRadius: remainingPercent<100?0:20, backgroundColor:constants.BLUERGREY}}
    selectedStyle={{backgroundColor:constants.ORANGE}}
    markerContainerStyle={{alignSelf: 'center', marginTop: 7.5}}
    sliderLength={length}
    step = {4}
    min={0}
    max={max}
    markerSize={100}
    showSteps={true}
    containerStyle={{width: 30}}
  
  />
  </>;
}


  export default PriceSlider;