import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import {PaymentCardTextField} from 'tipsi-stripe';
import {createOrUpdate, fetchCustomerInfo, fetchShipping} from 'App/utils';
import Icon from 'react-native-vector-icons/FontAwesome';
import AnimatedModal from 'App/components/AnimatedModal';
import ImagePicker from 'react-native-image-picker';
import {constants} from 'App/constants';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
//import Input from 'App/components/common/Input';
import {firebase, au, db} from 'App/firebase/config';
import OptionsModal from 'App/navigators/OptionsModal';
import {useDispatch} from 'react-redux';
import {validateCard, cc_brand_id, updateCard} from 'App/utils';



const showCardIcon = (brand, color)=>{
    const cardColor = color;
    const cardIcons = {'Visa': <Icon name="cc-visa" size={25} color={cardColor}/>, "MasterCard": <Icon name="cc-mastercard" size={25} color={cardColor} />, "American Express":<Icon name="cc-amex" size={25} color={cardColor} />,"Diners Club":<Icon name="cc-diners-club" size={25} color={cardColor} />, "Discover": <Icon name="cc-discover" size={25} color={cardColor} />, "JCB":<Icon name="cc-jcb" size={25} color={cardColor} />, "UnionPay":<Icon name="credit-card" size={25} color={cardColor} />, "Unknown": <Icon name="credit-card" size={25} color={cardColor} />, "Maestro": <Icon name="credit-card" size={25} color={cardColor} />}
    return cardIcons[brand];
    }

const SmartCheckout = ({confirmFunc, cancelFunc, children, billingOnly=false, shippingOnly=false, showSummary=true, allowConfirm = (creditCardChanged, shippingChanged, hasId, hasShipping)=>{


  if (billingOnly && shippingOnly) { //  both needed
    return {allowed:(shippingChanged || hasShipping)  && (creditCardChanged || hasId), errorMessage:"Please fill out billing and shipping."};
  }
  
  if (billingOnly) {
    return {allowed:creditCardChanged || hasId, errorMessage:"Please fill out billing."};
  } else if (shippingOnly) {
    return {allowed:shippingChanged || hasShipping, errorMessage: "Please fill out shipping."};
  } else { // default. neither needed. in profile perhaps false && false
    return {allowed:true, errorMessage:"shouldn't happen"};
  }
}}) => {
console.log("HAS ID", hasId)
const dispatch = useDispatch();
const [billModal, setBillModal] = useState(false);
const [shipModal, setShipModal] = useState(false);

const [changed, setChanged] = useState(false);
const [creditCardChanged, setCreditCardChanged] = useState(false);
const [hasId, setHasId] = useState(false);
const select = useSelector(state=>state.userInfo);

const [errorMessage, setErrorMessage] = useState("");
const [hasIdLoading, setHasIdLoading] = useState(true);
const [updating, setUpdating] = useState(false);

useEffect(()=>{
  if (select.customerId === "none" || select.customerId === undefined) {
    console.log("NOETAPPLCABE", select.customerId);
    // hasId = false;
    setHasId(false);
  } else {
    console.log("EHEREIT IS", select.customerId);
    // hasId = true;
    setHasId(true);
    fetchCustomerInfo(select.customerId).then((data)=>{
        // setInfo(data.customer);
        console.log("ADDRESSSS");
        console.log("CUSTOMER INFO", data.customer);
        console.log("CREDIT CARD INFO", data.card);
        setCreditInfo(data.card);
      // console.log(data.card,"MY CARD");
      }).catch(err=>console.log(err));
      console.log('hello');

    const shipping = select.shipping;
    if (shipping !== undefined && shipping !== "none") {
      setInfo(shipping);
      console.log('shipping', shipping);
    }
  }
  fetchShipping(au.currentUser.uid).then((data)=>{
    console.log('shipping non?', data);
    if (data !== "none") {
      setInfo(data);
      console.log('shipping', data);
    }
    
  })
}, [select.customerId]);

const defaultInfo = {
  // mandatory
  number: '',
  exp_month: null,
  exp_year: null,
  cvc: '',
  // optional
  name: '',
  currency: 'usd',
  address: {},
  addressLine1: '',
  addressLine2: '',
  addressCity: '',
  addressState: '',
  addressCountry: 'USA',
  addressZip: '',
};
const [info, setInfo] = useState(defaultInfo);
console.log(info);

const [creditInfo, setCreditInfo] = useState({
  // mandatory
  number: '',
  exp_month: null,
  exp_year: null,
  cvc: '',
  // optional
  name: '',
  currency: 'usd',
  addressLine1: '',
  addressLine2: '',
  addressCity: '',
  addressState: '',
  addressCountry: 'USA',
  addressZip: '',
});

const hasShipping = select.shipping !== undefined && select.shipping !== "none";
var notAllowedMessage="hello initial";
var {allowed:allowed, errorMessage: notAllowedMessage} = allowConfirm(creditCardChanged, changed, hasId, hasShipping);
console.log("??????????", allowed, creditCardChanged, changed, hasId, hasShipping, 'stuff');
return <><View style={{marginTop: 5}} >
        <View style={[styles.row, {justifyContent: 'space-between',}]}>
            {!shippingOnly || (billingOnly && shippingOnly)?
            <TouchableOpacity 
            style={{marginRight: 10,width: '100%', justifyContent: 'space-between', flexDirection:'row'}}
            onPress={()=>{
                setBillModal(true);
                
            }}>
              <View style={{flex: 1}}>
              <Text>Billing Information</Text>
              </View>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <TouchableOpacity onPress={()=>{
                console.log('remove card')
              }}>
                <View style={{borderRadius: 40, backgroundColor: 'red', padding: 7, justifyContent: 'center', alignItems: 'center',}}>
                <Icon name="minus" size={10} color="white"/>
                </View>
              </TouchableOpacity>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
            {creditInfo.last4?
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {showCardIcon(creditInfo.brand, constants.LAVENDER)}<Text style={{marginLeft: 5, color: 'black', paddingRight: 10}}>{creditInfo.last4}</Text>
            </View>
            :hasId?<ActivityIndicator animating={hasIdLoading} color={constants.LAVENDER} style={{marginRigth:10}} />:<Text style={{color: constants.RED, paddingRight: 10}}>Needs Action</Text>}
            </View>
            <View style={{alignSelf: 'center'}}>
            <Icon name="chevron-right" size={20} color={constants.LAVENDER} style={{marginRight: 10}} />
            </View>
            </View>
            </TouchableOpacity>
            :
            <></>
            }
        </View>
                  {!billingOnly || (billingOnly && shippingOnly) ?
        <View style={[styles.row, {justifyContent: 'space-between'}]}>

            <TouchableOpacity 
            style={{marginRight: 10,width: '100%', justifyContent: 'space-between', flexDirection:'row'}}
            onPress={()=>{
                setShipModal(true);
            }}>
              <View style={{flex: 1}}>
              <Text>Shipping Information</Text>
              </View>

            <View style={{flexDirection: 'row', flex: 1}}>
              <View style={{flex: 1}}>
            {info?.address?.line1?
            <View style={{flexDirection: 'row', flex: 1, alignItems: 'center',}}>
            <Text numberOfLines={1}>{info.address.line1}</Text>
            </View>
            :<Text style={{color: constants.RED, textAlign: 'right'}}>Needs Action</Text>}
            </View>
            <View style={{marginRight: 10, alignSelf: 'flex-end'}}>
            <Icon name="chevron-right" size={20} color={constants.LAVENDER} />
            </View>
            </View>
            </TouchableOpacity>
        </View>
        :
            <></>
            }
        {children}
        <View style={{justifyContent: 'center', flexDirection: 'row', marginTop: 50}}>
          <TouchableOpacity
            style={{
              width: 80,
              margin: 10,
              borderRadius: 20,

              padding: 5,
              // borderWidth: 2,
              paddingTop: 3,
              // borderColor: '#aaa',
              backgroundColor: '#d8d8d8',
              justifyContent: 'center'
            }}
            onPress={cancelFunc}>
            <Text
              style={{
                color: constants.LIGHTGREY,
                textAlign: 'center',
                fontFamily: 'Nunito-Bold',
              }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            title="update"
            style={{
              width: 80,
              margin: 10,
              borderRadius: 20,
              //borderWidth: 2,
              padding: 5,
              borderColor: 'white',
              backgroundColor: constants.ORANGE,
              // opacity: allowed?1:0.2,
            }}
            onPress={() => {
                console.log('pressed creditcard changed, changed',creditCardChanged, changed, hasId);
                console.log("creditInfo", creditInfo);
                // setErrorMessage("");
                if (!allowed) {
                  setErrorMessage(notAllowedMessage || "ugh null?");
                  return;
                } else {
                  // setErrorMessage("");
                }
              if (hasId && creditCardChanged) {
                  console.log('has id and creditcardchanged');
                updateCard(select.customerId, creditInfo);
                confirmFunc(select.customerId);
                setErrorMessage("");
              } 
              if (changed) { // update shipping info
                console.log('changed shipping');
                setUpdating(true);
                const tempCredit = {...creditInfo, exp_month: parseInt(creditInfo.expMonth), exp_year: parseInt(creditInfo.expYear),expMonth: parseInt(creditInfo.expMonth), expYear: parseInt(creditInfo.expYear)};
                // createOrUpdate(hasId, select.customerId, tempCredit).then((id)=>{
                //   dispatch({type:'UPDATE_DATA', payload: ["customerId", null, null, id]});
                //   console.log('done in profile change');
                //   setUpdating(false);
                //   confirmFunc(id);
                // })
                console.log('updateShipping');
                dispatch({type:'UPDATE_DATA', payload: ["shipping", null, null, info]});
                db.collection('users').doc(au.currentUser.uid).update({
                  
                  shipping: info
                }).then(()=>{
                  console.log('updaing shipping');
                  setUpdating(false);
                }).catch((errr)=>{
                  console.log("UPDATING SHIP ERR:", errr);
                });
                confirmFunc(select.customerId);


              }
                  if (hasId) {
                      console.log('hasId');
                      confirmFunc(select.customerId);
                  } else { // doesn't have id, credit card changed
                      console.log('doesnt have id');
                      if (!changed && !creditCardChanged) {
                        confirmFunc(null);
                        return;
                      }
                      if (changed && creditCardChanged) {
                        setUpdating(true);
                        const tempCredit = {...creditInfo, exp_month: parseInt(creditInfo.expMonth), exp_year: parseInt(creditInfo.expYear),expMonth: parseInt(creditInfo.expMonth), expYear: parseInt(creditInfo.expYear)};
                    createOrUpdate(hasId, select.customerId, tempCredit).then((id)=>{
                        dispatch({type:'UPDATE_DATA', payload: ["customerId", null, null, id]});
                        console.log('done in profile change');
                        setUpdating(false);
                        confirmFunc(id);
                      });

                      db.collection('users').doc(au.currentUser.uid).update({
                        shipping: info
                      });
                      dispatch({type:'UPDATE_DATA', payload: ["shipping", null, null, info]});

                    } else if (creditCardChanged) {
                      // console.log(creditInfo['exp_month'], parseInt(creditInfo.expMonth));
                      const tempCredit = {...creditInfo, exp_month: parseInt(creditInfo.expMonth), exp_year: parseInt(creditInfo.expYear),expMonth: parseInt(creditInfo.expMonth), expYear: parseInt(creditInfo.expYear)};
                      console.log("credit", tempCredit);
                      setUpdating(true);
                      // createOrUpdate(hasId, select.customerId, info).then((id)=>{
                      createOrUpdate(hasId, select.customerId, tempCredit).then((id)=>{
                        if (typeof id === "object") {
                          setUpdating(false);
                          setErrorMessage(id.message);
                          return;
                        }
                        setUpdating(false);
                        dispatch({type:'UPDATE_DATA', payload: ["customerId", null, null, id]});
                        // console.log('done in profile change');
                        confirmFunc(id);
                      }).catch((err)=>{
                        console.log("update credit error", err);
                      });
                    }
                  
                  
              }

              

            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontFamily: 'Nunito-Bold',
              }}>
              Confirm
            </Text>
          </TouchableOpacity>

        </View>
        <Text style={{textAlign: 'center', color: constants.RED}}>{errorMessage}</Text>
        <View style={{position: 'absolute', zIndex: 200, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)', height: updating?'100%':0, width: updating?'100%':0}}>
            <Text style={{fontWeight: 'bold', color: constants.LAVENDER}}>Updating</Text>
          </View>
        </View>
        <AnimatedModal nested = {true} keyboard={true} upPercent="60%" colored={true} colors={[constants.ORANGE, constants.GREYORANGE]} visible={billModal} close={()=>setBillModal(false)} state={info} setState={setInfo} content={<BillingModal state={creditInfo} setState={setCreditInfo} setChanged={setCreditCardChanged} close={()=>setBillModal(false)}/>}/>
<AnimatedModal upPercent="55%"  nested = {true} keyboard={true} colored={true} colors={[constants.ORANGE, constants.GREYORANGE]} visible={shipModal} close={()=>setShipModal(false)} state={info} setState={setInfo} content={<ShippingModal state={info} setState={setInfo} setChanged={setChanged} close={()=>setShipModal(false)}/>}/>

</>


};



const BillingModal = ({state, setState, close, setChanged}) => {
    const [localState, setLocalState] = useState(state);
    // const [cardNumber, setCardNumber] = useState('');
    // const [expMonth, setExpMonth] = useState('');
    // const [expYear, setExpYear] = useState('');
    // const [sec, setSec] = useState('');
    
    // const [name, setName] = useState('');
    const scrollRef = useRef();

    const [valid, setValid] = useState(false);
    const [error, setError] = useState(false);


    const [address, setAddress] = useState(state.address_line1);
    const [geostate, setGeostate] = useState(state.address_state);
    const [city, setCity] = useState(state.address_city);
    const [zip, setZip] = useState(state.address_zip);
  
    // const placeholderColor = localState.number === ''?'grey':'black';
    // const numberPlaceholder= localState.number=== ''?'4242424242424242':localState.number;
    // const expirationPlaceholder = localState.expMonth === ''?"MM/YY":localState.expMonth+"/"+localState.expYear;

    console.log("credit info ", localState);
    

    return <ScrollView ref={scrollRef}  style={{paddingLeft: 30, paddingRight: 30, borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor:'white', zIndex: 50}}>
           
           <Text style={{color: 'red', opacity: error?1:0}}>Please review your information for errors</Text>
           <Text style={{alignSelf: 'center',fontSize: 15, fontFamily: constants.FONT, fontWeight: 'bold'}}>Billing Information</Text>
            <PaymentCard
            state={state}
            onParamsChange={(valid, params) => {
              console.log(au.currentUser.uid);
              console.log('changing', params, valid);
                // setValid(valid);
                // setCardNumber(params.number);
                // setSec(params.cvc);
                // setExpMonth(params.expMonth);
                // setExpYear(params.expYear);
                if (valid) {
                    setValid(true);
                    setLocalState({
                        ...localState,
                        ...params,
                        exp_year: parseInt(params.expYear),
                        exp_month: parseInt(params.expMonth),
                    });
                    console.log(params.brand);
                } else {
                    setValid(false);
                }
            }}
            />
            <Text style={{marginLeft: 10, marginTop: 10, marginBottom: 5}}>Full Name</Text>
            <TextInput defaultValue={localState.name} onChangeText={(text)=> {
                localState.name = text;
            }} style={styles.textbox} />

{/* <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>Address</Text>
            <TextInput defaultValue={localState.addressLine1} value = {address}  onChangeText={(text)=> {
                setAddress(text);
            }} style={styles.textbox} />
  
            <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                <View style={{flex: 1, marginRight: 20}}>
            <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>City</Text>
            <TextInput value={city}  onChangeText={(text)=> {
                setCity(text);
            }} style={styles.textbox} />
                        </View>
                        <View style={{width: 75}}>
                        <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>State</Text>
            <TextInput keyboardType="default" maxLength={2} value={geostate}   onChangeText={(text)=> {
                setGeostate(text);
            }} style={styles.textbox} />
                        </View>
                        <View>
                        <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>Country</Text>
            <TextInput defaultValue={localState.addressCountry} onChangeText={(text)=> {
                localState.addressCountry = text;
            }} style={styles.textbox} />
            </View>
            </View>            
            <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>Zip Code</Text>
            <TextInput value={zip} maximumLength={5} keyboardType="numeric" 
            onBlur={()=>{
              scrollRef.current.scrollToEnd({animated: true});
            }}
            onChangeText={(text)=> {
                setZip(text);
            }} style={styles.textbox} /> */}

            <TouchableOpacity style={{marginTop:30, marginBottom: 40, borderRadius: 40, overflow: 'hidden',  height: 35, width: "100%", alignSelf:'center', backgroundColor:constants.ORANGE, justifyContent:'center', alignItems: 'center', borderRadius:30}} onPress={()=>{
                 // if (!(validateCard(cardNumber(cardNumber)) && validateExp(expMonth, expYear)))
                // valid = true;
                 if (!valid) {
                    setError(true);
                    console.log('error');
                    return;
                }
                const cardString = localState.number;
                setState({...localState, brand: localState.brand, last4: cardString.substring(cardString.length - 4, cardString.length),
                address_city: city, address_country:"US", address_line1: address, address_state: geostate, address_zip:zip
                });
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
                    <Image  style={{alignSelf: 'center',height: 25, resizeMode: 'contain'}} source={require('App/Assets/Images/stripe-logo.png')}/>
            </ScrollView>
            
  }
  
  const ShippingModal = ({state, setState, close, setChanged}) => {
    const [localState, setLocalState] = useState(state);
    const [address, setAddress] = useState(state.address?.line1);
    const [geostate, setGeostate] = useState(state.address?.state);
    const [city, setCity] = useState(state.address?.city);
    const [zip, setZip] = useState(state.address?.postal_code)
    const [name, setName] = useState(state.address?.name);
  
    // const [cardNumber, setCardNumber] = useState('');
    // const [expMonth, setExpMonth] = useState('');
    // const [expYear, setExpYear] = useState('');
    // const [sec, setSec] = useState('');
    
    // const [name, setName] = useState('');
    var valid = false;
    const [error, setError] = useState(false);
    return <ScrollView scrollEnabled={false} style={{paddingLeft: 30, paddingRight: 30, borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor:'white', zIndex: 50}}>
            <Text style={{alignSelf: 'center',fontSize: 15, fontFamily: constants.FONT, fontWeight: 'bold'}}>Shipping Address</Text>
            <Text style={{color: 'red', opacity: error?1:0}}>Please review your information for errors</Text>
            {/* <Text style={{marginLeft: 10, marginTop: 10, marginBottom: 5}}>Full Name</Text>
            <TextInput value = {name} defaultValue={state.name} onChangeText={(text)=> {
                setName(text);
            }} style={styles.textbox} /> */}
                        <Text style={{marginLeft: 10, marginTop: 10, marginBottom: 5}}>Full Name</Text>
            <TextInput value={name} onChangeText={(text)=> {
                setName(text);
            }} style={styles.textbox} />
            <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>Address</Text>
            <TextInput value = {address}  onChangeText={(text)=> {
                setAddress(text);
            }} style={styles.textbox} />
  
            <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                <View style={{flex: 1.4, marginRight: 20}}>
            <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>City</Text>
            <TextInput value={city}  onChangeText={(text)=> {
                setCity(text);
            }} style={styles.textbox} />
                        </View>
                        <View style={{flex: .8, marginRight: 20}}>
                        <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5,}}>State</Text>
            <TextInput keyboardType="default" maxLength={2} value={geostate}   onChangeText={(text)=> {
                setGeostate(text);
            }} style={styles.textbox} />
                        </View>
                        <View style={{flex: 1, marginRight: 20}}>
                        <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5,}}>Country</Text>
            <TextInput editable={false} keyboardType="default" maxLength={2} value="USA"   onChangeText={(text)=> {
                setGeostate(text);
            }} style={[styles.textbox, {color: constants.DARKGREY}]} />
                        </View>
                        {/* <View>
                        <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>Country</Text>
            <TextInput defaultValue={localState.addressCountry} onChangeText={(text)=> {
                localState.addressCountry = text;
            }} style={styles.textbox} />
            </View> */}
                        
                        <View styles={{flex: 1, marginLeft: 10,}}>
                        <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>Zip Code</Text>
            <TextInput value={zip} maximumLength={5} keyboardType="numeric" onChangeText={(text)=> {
                setZip(text);
            }} style={styles.textbox} />
            </View>
            </View>            

  
            <TouchableOpacity style={{marginTop:30, borderRadius: 40, overflow: 'hidden',  height: 35, width: "100%", alignSelf:'center', backgroundColor:constants.ORANGE, justifyContent:'center', alignItems: 'center', borderRadius:30}} onPress={()=>{
                 // if (!(validateCard(cardNumber(cardNumber)) && validateExp(expMonth, expYear)))
                valid = true;
                 if (!valid) {
                    setError(true);
                    console.log('error');
                    return;
                }
                setState({...state, address: {
                  line1: address,
                  city: city,
                  state: geostate,
                  country: "US",
                  postal_code: zip,
                  name: name,
                }});
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
  
  const PaymentCard = ({onParamsChange=()=>{}, state}) => {
    const cardRef = useRef();
    const exp = useRef();
    const cvc = useRef();
    const [cardNumber, setCardNumber] = useState("");
    const [expDate, setExpDate] = useState("");
    const [cvcVal, setCVCVal] = useState("");
  
    const card_number_lengths = {"Visa": 16, "MasterCard": 16, "American Express": 15, "Diners Club": 14, "Discover": 16, "JCB":16, "Maestro": 16, "Unknown":19}
  
  
    const cardBrand = cc_brand_id(cardNumber);
    const maximumLength = card_number_lengths[cardBrand];
    const valid = validateCard(cardNumber) && cardNumber.length <= maximumLength;
    var backspaceExp = false;
    const invalidLength = cardNumber.length < 13;
    console.log("IS", valid, cardNumber.length);
    // const allValid = valid && expDate.length == 5 && cvcVal.length == 3;
    
    return <View>
      <View>
        <Text style={{marginLeft: 10}}>Card</Text>
        <View style={[styles.textbox, {flexDirection: 'row', paddingVertical: 0, alignItems: 'center'}]}>
          <View style={{width: 40}}>{showCardIcon(cardBrand, constants.GREYORANGE)}</View>
      <TextInput defaultValue={state.number} value={cardNumber} ref = {cardRef} maxLength={maximumLength} keyboardType="numeric" style={[styles.textbox,{color: valid || invalidLength?'black':'red', width:'100%', height: '100%', borderWidth: 0}]} onChangeText={(text)=>{
        const currValid = validateCard(text);
        const allValid = currValid && expDate.length == 5 && cvcVal.length == 3;
        onParamsChange(allValid, {number: text, brand: cardBrand, expMonth: expDate.split("/")[0], expYear: expDate.split("/")[1] || "", cvc: cvcVal,
        exp_month: expDate.split("/")[0], exp_year: expDate.split("/")[1] || ""});
        if (text.length == maximumLength
          //  && currValid
           ) {
          console.log("leave now");
          setCardNumber(text);
          exp.current.focus();
          return;
        }
  
          setCardNumber(text);
      }} />
      </View>
      </View>
  
      <View style={{flexDirection: 'row'}}>
        <View style={{marginTop: 20, flex: 2}}>
          <Text style={{marginLeft: 10,}}>Exp Date</Text>
        <TextInput maxLength={5} value = {expDate} placeholder="MM/YY" keyboardType="numeric" ref = {exp} style={styles.textbox}
        onKeyPress={({nativeEvent})=>{
          console.log(expDate, nativeEvent.key);
          if (nativeEvent.key === 'Backspace') {
            backspaceExp = true;
              if (expDate === "") {
                cardRef.current.focus();
            }
          } else {
            backspaceExp = false;
          }
          // if (month ==="") {
          //   if (nativeEvent.key === 'Backspace') {
          //     cardRef.current.focus();
          //     setCardNumber(cardNumber.substring(0, cardNumber.length - 1));
          //   }
          // }
        }}
        onChangeText={(text)=>{
          var newText= text;
          // setExpDate(text);
          if (text.indexOf("/") == -1) {
            console.log("/ not found")
            if (text.length == 1) {
              console.log(parseInt(text));
              if (parseInt(text) >= 2) {
                setExpDate("0"+text +"/");
                newText = "0"+text +"/";
                return;
              }
            }
  
          }
          if (text.length == 2 && backspaceExp) {
            newText=text.substring(0,1);
            setExpDate(text.substring(0,1));
          } else if (text.length == 2) {
            newText = text+"/";
            setExpDate(text+"/");
          } else if (text.length == 5) {
            newText = text;
            setExpDate(text);
            cvc.current.focus();
          } else {
            newText=text;
            setExpDate(text);
          }
          
          
          const allValid = valid && newText.length == 5 && cvcVal.length == 3;
          onParamsChange(allValid, {number: cardNumber, brand: cardBrand, expMonth: newText.split("/")[0], expYear: newText.split("/")[1] || "", cvc: cvcVal});
        }}
        />
        </View>
        <View style={{marginTop: 20, flex: 1, marginLeft: 10}}>
          <Text style={{marginLeft: 10}}>CVC</Text>
        <TextInput keyboardType="numeric" defaultValue = {state.cvc} value={cvcVal} ref = {cvc} maxLength={3} style={styles.textbox} 
        onKeyPress={({nativeEvent})=>{
          if (nativeEvent.key =="Backspace") {
            if (cvcVal === "") {
              exp.current.focus();
            }
          } else {
            if (cvcVal.length == 3) {
              codeFull = true;
            } else {
              codeFull = false;
            }
          }
        }}
        onChangeText={(text)=>{
          setCVCVal(text);
          const allValid = valid && expDate.length == 5 && text.length == 3;
          onParamsChange(allValid, {number: cardNumber, brand: cardBrand, expMonth: expDate.split("/")[0], expYear: expDate.split("/")[1] || "", cvc: text});
          
        }} />
        </View>
      </View>
    </View>
  }

  const styles = StyleSheet.create({
    inputStyle: {
      fontSize: 14,
      padding: 5,
      borderRadius: 3,
      borderWidth: 1,
    },
    textbox: {borderWidth: 1, borderColor: constants.DARKGREY, borderRadius: 30, padding: 10, paddingVertical: 10, fontSize: 18},
    row: {borderBottomWidth: 2,
    borderColor: constants.PINK_BACKGROUND,
    paddingHorizontal:20, paddingRight: 10, paddingVertical:20},
  });


  export default SmartCheckout;