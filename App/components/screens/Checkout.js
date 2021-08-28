import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Button, Modal, TextInput, Switch, ScrollView, Alert} from 'react-native';
// import {PaymentCardTextField} from 'tipsi-stripe';
import AnimatedModal from 'App/components/AnimatedModal';
import {constants} from 'App/constants';
import HeaderGradient from '../HeaderGradient';
import {useStore, useDispatch, useSelector} from 'react-redux';
import {firebase, au, db} from 'App/firebase/config';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import {createOrUpdate, fetchCustomerInfo} from 'App/utils';
import SmartCheckout from 'App/components/SmartCheckout';
import StripeCheckout from 'App/components/StripeCheckout';
import {throttle} from 'lodash';
import {Tooltip} from 'react-native-elements';
import ShippingModal from 'App/components/ShippingModal';



const Checkout = ({navigation, route}) => {


    const [shipModal, setShipModal] = useState(false);
    const [billModal, setBillModal] = useState(false);
    const [changed, setChanged] = useState(false);
    const [tog, setToggle] = useState(false);
    const [tog2, setToggle2] = useState(false);

    const [stripeHook, setStripeHook] = useState(()=>()=>{console.log('default stripe hook')});

    const toggleFunc = () => {
        setToggle(!tog);
    }
    const toggleFunc2 = () => {
        setToggle2(!tog2);
    }

    // const store = useStore();
    const select = useSelector(state=>state.userInfo);
    const [email, setEmail] = useState(select.email);
    const dispatch = useDispatch();
    // const customerId = store.getState().userInfo.customerId;
    const customerId = select.customerId;
    var hasId = customerId !== undefined && customerId !== null && customerId !== "none"
    useEffect(()=>{
        if (select.hasCard) {
            fetchCustomerInfo(customerId).then((customerInfo) =>{
                // setInfo({...info, ...customerInfo.customer});
                try {
                setInfo({...info, ...customerInfo.card});
                } catch (err) {
                    console.log(err);
                }
            });
        }
    },[]);

    const [info, setInfo] = useState({
        // mandatory
        number: '4000000000000077',
        expMonth: 11,
        expYear: 23,
        cvc: '223',
        // optional
        name: 'Test User',
        currency: 'usd',
        addressLine1: '123 Test Street',
        addressLine2: 'Apt. 5',
        addressCity: 'Test City',
        addressState: 'Test State',
        addressCountry: 'Test Country',
        addressZip: '55555',
      });
    
      
      const shipConst = tog2?24.99:8.99;
      const dollars = parseFloat((select.eggCoins / constants.EGG_RATIO).toFixed(2));
      const reductionDollars = Math.min(dollars, shipConst);
      const reductionEggs = Math.round(reductionDollars * constants.EGG_RATIO);
      const shipMain = tog?((shipConst - reductionDollars).toFixed(2)):shipConst;
      const amount = (parseFloat(shipMain) + parseFloat(route.params.subtotal)).toFixed(2);
    //   console.log(amount, route.params.subtotal, (parseFloat(shipMain) + parseFloat(route.params.subtotal)).toFixed(2))


      const confirmFunc = (context)=>{
                          if (route.params.doneFunc) {
                    route.params.doneFunc();
                }
                const utcDate1 = new Date(Date.now());
                db.collection('purchaseOrders').add({
				// product: req.body.product,
				amount: amount,
                // user: au.currentUser.uid,
                user: 12345,
                ...context,
                email: email,
                product: route.params.product,
				type: 'borrow',
				groupId: "testing123",
                createdAt: utcDate1,
                date: utcDate1.toISOString,
                dates: [route.params.start, route.params.end],
			});
                dispatch({type:'spendEggs', payload: reductionEggs});
                navigation.navigate('Success', {amount: "$"+amount, period: route.params.start+ " to " +route.params.end, email: email});
                // console.log('email before dispatch', email);
                dispatch({type: "UPDATE_DATA_UPLOAD", payload: ['email',null, null,email]});
      }

    const cancelFunc = () => {
        navigation.goBack();
    }

    return <>
    <SafeAreaView style={{flex: 1,backgroundColor: constants.TRANSLUCENT}}>
        <HeaderGradient title="Checkout" navigation={navigation} absolute={false} >
        {/* <Text style={{fontFamily: constants.FONT, fontSize: 18, marginTop: -10}}>Checkout</Text> */}
        </HeaderGradient>
    <ScrollView keyboardShouldPersistTaps="never">
        {/* <View style={{flex: 1, backgroundColor: constants.PINK_BACKGROUND,}}> */}

        {/* <View style={{height: '100%', marginTop: 10, }}> */}
            {/* <View style={{backgroundColor: 'white', paddingVertical: 10, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, alignItems: "flex-end"}}> */}
        <View style={styles.row}>
            <Text style={{marginVertical: 15}}>
    {<Text style={{fontWeight: 'bold'}}>Period: </Text>}{route.params.start} to {route.params.end}
        </Text>
        </View>
        {/* <View style={[styles.row, {justifyContent: 'space-between'}]}>
            <TouchableOpacity
            style={{marginRight: 10, width: '100%', justifyContent: 'space-between', flexDirection:'row'}}
            onPress={()=>{
                setShipModal(true);
            }}><Text style={{fontWeight:'bold'}}>Shipping information</Text>
            <Icon name="chevron-right" size={20} />
            </TouchableOpacity>
            
        </View>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
            <TouchableOpacity 
            style={{marginRight: 10,width: '100%', justifyContent: 'space-between', flexDirection:'row'}}
            onPress={()=>{
                setBillModal(true);
            }}><Text style={{fontWeight: 'bold'}}>Billing information</Text>
            <Icon name="chevron-right" size={20} />
            </TouchableOpacity>


            
        </View> */}

        <View style={[styles.row, {borderBottomWidth: 0}]}>
                <Text style={{fontWeight: 'bold'}}>Summary</Text>
        <Text>Arriving {["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][moment(route.params.start).day()]} {route.params.start}</Text>

        <View style={{flexDirection: 'row', width: '100%', marginVertical: 15, justifyContent: 'space-between'}}>
            <Text>Subtotal</Text>
            <Text>${route.params.subtotal.toFixed(2)}</Text>
            </View>
        <View style={{flexDirection: 'row', width: '100%', marginVertical: 15, justifyContent: 'space-between'}}>
            <Text>Shipping and Maintenance</Text>
            <Text style={{color: tog?constants.ORANGE:'black'}}>${shipMain}</Text>
            </View>
            <View style={{flexDirection: 'row', width: '100%',  justifyContent: 'space-between', borderTopWidth: 1, borderColor: constants.PINK_BACKGROUND, paddingTop: 10}}>
            <Text style={{fontWeight: 'bold', }}>Total</Text>
            <Text style={{color: tog?constants.ORANGE:'black'}}>${amount}</Text>
            {/* {tog?<Text style={{alignSelf: 'flex-end', color: constants.ORANGE}}>${(shipMain + route.params.subtotal - reductionDollars).toFixed(2)}</Text>:<></>} */}
            </View>
            <View style={{alignSelf:'flex-end', flexDirection:'row', alignItems:'center', marginTop: 10, marginRight: -5, justifyContent: 'space-between'}}>
                <View style={{flex: 1}}>
        <Text>You have {<Text style={{color: constants.ORANGE}}>{select.eggCoins}</Text>} eggs to redeem.</Text>
        <Text>Use {reductionEggs} to save ${reductionDollars.toFixed(2)}</Text>
        </View>
            <Switch value={tog}
    onValueChange={toggleFunc}
    trackColor={{ false: constants.DARKGREY, true: constants.ORANGE }}
    style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }} />
    </View>
            </View>
            <View style={{alignSelf:'flex-end', flexDirection:'row', alignItems:'center', marginTop: 10, marginHorizontal:15, justifyContent: 'space-between'}}>
                <Tooltip 
                backgroundColor={constants.BLUERGREY}
                width={300} height={75} popover={<View><Text style={{color: 'white'}}>Keep your mailing address private from your co-flockers by having Flock ship to you directly.</Text></View>}>
                <Text>Hide shipping information. <Icon name="question" size={15} color={constants.DARKGREY} /></Text>
                </Tooltip>
                <Switch value={tog2}
    onValueChange={toggleFunc2}
    trackColor={{ false: constants.DARKGREY, true: constants.ORANGE }}
    style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }} />
            </View>
            <View style={{marginHorizontal:20, marginTop: 10,
            flexDirection:'row',
            backgroundColor: 'rgba(255,255,255,0.2)', borderColor: constants.LAVENDER, borderWidth: 1, marginTop: 5, borderRadius: 40, paddingVertical: 5, height: 35, paddingLeft: 20,
            alignItems: 'center'
            }}>
                <Text>Send receipt to: </Text>
                {/* <Text style={{marginLeft: 0}}>Email to receive receipt</Text> */}
            <TextInput value={email} onChangeText={throttle((text)=>{
                console.log(email);
                setEmail(text.toLowerCase());
            }, 500)} 
            placeholder="Email to receive receipt"  keyboardType="email-address" defaultValue={select.email}
            style={{width: '100%'}}
            ></TextInput>
            </View>
            <StripeCheckout amount={amount}
             setHook = {setStripeHook} 
             hookDependency = {[email]}
            completeFunc={confirmFunc}
            />
            
            {/* </View> */}
                <TouchableOpacity style={{width: '90%',height: 40, marginTop: 30, overflow: 'hidden', borderRadius: 40, marginHorizontal:20,}} onPress={async ()=>{
            // createOrUpdate(hasId, customerId, info).then();
            if (email == undefined || email === "" || !email.includes("@")) {
                Alert.alert("Input a valid email.")
            } else {
                setShipModal(true);
            }
            

            
        }} >
                                <LinearGradient style={{width: '100%', height: '100%',
                    justifyContent: 'center', alignItems: 'center',}}
                    colors={[constants.LAVENDER, constants.PURPLE]}
                    start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
                    >
                    <Text style={{color: 'white'}}>checkout</Text>
                    </LinearGradient>
            </TouchableOpacity>

        
        
        {/* </View> */}

{/* </View> */}
</ScrollView>
    </SafeAreaView>
    {/* <AnimatedModal colored={true} keyboard = {true} colors={[constants.ORANGE, constants.GREYORANGE]} visible={billModal} close={()=>setBillModal(false)} state={info} setState={setInfo} content={<BillingModal state={info} setState={setInfo} setChanged={setChanged} close={()=>setBillModal(false)}/>}/> */}
        {/* <AnimatedModal colored={true} keyboard = {true} colors={[constants.ORANGE, constants.GREYORANGE]} visible={shipModal} close={()=>setShipModal(false)} state={info} setState={setInfo} content={<ShippingModal state={info} setState={setInfo} setChanged={setChanged} close={()=>setShipModal(false)}/>}/> */}
        <ShippingModal
        visible={shipModal}
        // state={info} setState={setInfo}
        setChanged={setChanged} close={()=>setShipModal(false)} 
        completeFunc={(shippingContext)=> {
            stripeHook(shippingContext)
        }}
         />
    </>
};



const BillingModal = ({state, setState, close, setChanged}) => {
    const [localState, setLocalState] = useState(state);
    // const [cardNumber, setCardNumber] = useState('');
    // const [expMonth, setExpMonth] = useState('');
    // const [expYear, setExpYear] = useState('');
    // const [sec, setSec] = useState('');
    
    // const [name, setName] = useState('');
    const [valid, setValid] = useState(false);
    const [error, setError] = useState(false);

    const placeholderColor = localState.number === ''?'grey':'black';
    const numberPlaceholder= localState.number=== ''?'4242424242424242':localState.number;
    const expirationPlaceholder = localState.expMonth === ''?"MM/YY":localState.expMonth+"/"+localState.expYear;
    return <ScrollView style={{paddingLeft: 30, paddingRight: 30, borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor:'white', zIndex: 50}}>
           <Text style={{color: 'red', opacity: error?1:0}}>Please review your information for errors</Text>
           <Text style={{alignSelf: 'center',fontSize: 15, fontFamily: constants.FONT, fontWeight: 'bold'}}>Billing Information</Text>
            <Text style={{marginLeft: 10, marginTop: 10, marginBottom: 5}}>Card</Text>
            <PaymentCardTextField style={styles.textbox} 
            onParamsChange={(valid, params) => {
                // setValid(valid);
                // setCardNumber(params.number);
                // setSec(params.cvc);
                // setExpMonth(params.expMonth);
                // setExpYear(params.expYear);
                if (valid) {
                    setValid(true);
                    setLocalState({
                        ...localState,
                        ...params
                    })
                } else {
                    setValid(false);
                }
            }}
            />
            <Text style={{marginLeft: 10, marginTop: 10, marginBottom: 5}}>Full Name</Text>
            <TextInput defaultValue={localState.name} onChangeText={(text)=> {
                localState.name = text;
            }} style={styles.textbox} />
            <TouchableOpacity style={{marginTop:30, borderRadius: 40, overflow: 'hidden',  height: 35, width: "100%", alignSelf:'center', backgroundColor:constants.ORANGE, justifyContent:'center', alignItems: 'center', borderRadius:30}} onPress={()=>{
                 // if (!(validateCard(cardNumber(cardNumber)) && validateExp(expMonth, expYear)))
                // valid = true;
                 if (!valid) {
                    setError(true);
                    console.log('error');
                    return;
                }
                setState(localState);
                setChanged(true);
                close();
                }}>
                    <LinearGradient style={{width: '100%', height: '100%',
                    justifyContent: 'center', alignItems: 'center',}}
                    colors={[constants.YELLOW, constants.ORANGE]}
                    start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
                    >
                    <Text style={{color: 'white'}}>confirm</Text>
                    </LinearGradient>
                    </TouchableOpacity>
                
            </ScrollView>
            
}

// const ShippingModal = ({state, setState, close, setChanged}) => {
//     const [localState, setLocalState] = useState(state);
//     // const [cardNumber, setCardNumber] = useState('');
//     // const [expMonth, setExpMonth] = useState('');
//     // const [expYear, setExpYear] = useState('');
//     // const [sec, setSec] = useState('');
    
//     // const [name, setName] = useState('');
//     var valid = false;
//     const [error, setError] = useState(false);
//     return <View style={{paddingLeft: 30, paddingRight: 30, borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor:'white', zIndex: 50}}>
//             <Text style={{alignSelf: 'center',fontSize: 15, fontFamily: constants.FONT, fontWeight: 'bold'}}>Shipping Address</Text>
//             <Text style={{color: 'red', opacity: error?1:0}}>Please review your information for errors</Text>
//             <Text style={{marginLeft: 10, marginTop: 10, marginBottom: 5}}>Full Name</Text>
//             <TextInput defaultValue={localState.name} onChangeText={(text)=> {
//                 localState.name = text;
//             }} style={styles.textbox} />
//             <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>Address</Text>
//             <TextInput defaultValue={localState.addressLine1} onChangeText={(text)=> {
//                 localState.addressLine1 = text;
//             }} style={styles.textbox} />

//             <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
//                 <View style={{flex: 1, marginRight: 20}}>
//             <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>City</Text>
//             <TextInput defaultValue={localState.addressCity} onChangeText={(text)=> {
//                 localState.addressCity = text;
//             }} style={styles.textbox} />
//                         </View>
//                         <View >
//                         <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>State</Text>
//             <TextInput defaultValue={localState.addressState} onChangeText={(text)=> {
//                 localState.addressState = text;
//             }} style={styles.textbox} />
//                         </View>
//                         {/* <View>
//                         <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>Country</Text>
//             <TextInput defaultValue={localState.addressCountry} onChangeText={(text)=> {
//                 localState.addressCountry = text;
//             }} style={styles.textbox} />
//             </View> */}
//             </View>            
//             <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>Zip Code</Text>
//             <TextInput defaultValue={localState.addressZip} onChangeText={(text)=> {
//                 localState.addressZip = text;
//             }} style={styles.textbox} />

//             <TouchableOpacity style={{marginTop:30, borderRadius: 40, overflow: 'hidden',  height: 35, width: "100%", alignSelf:'center', backgroundColor:constants.ORANGE, justifyContent:'center', alignItems: 'center', borderRadius:30}} onPress={()=>{
//                  // if (!(validateCard(cardNumber(cardNumber)) && validateExp(expMonth, expYear)))
//                 valid = true;
//                  if (!valid) {
//                     setError(true);
//                     console.log('error');
//                     return;
//                 }
//                 setState(localState);
//                 setChanged(true);
//                 close();
//                 }}>
//                     <LinearGradient style={{width: '100%', height: '100%',
//                     justifyContent: 'center', alignItems: 'center',}}
//                     colors={[constants.YELLOW, constants.ORANGE]}
//                     start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
//                     >
//                     <Text style={{color: 'white'}}>confirm</Text>
//                     </LinearGradient>
//                     </TouchableOpacity>
                
//             </View>
            
// }

const styles = {
    textbox: {borderWidth: 1, borderColor: constants.DARKGREY, borderRadius: 30, padding: 10, paddingBottom: 10, paddingTop: 10, fontSize: 18},
    row: {width: '100%', borderBottomWidth: 2, borderColor: constants.PINK_BACKGROUND,paddingHorizontal:20, paddingVertical:20},
}

export default Checkout;