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
} from 'react-native';
import {PaymentCardTextField} from 'tipsi-stripe';
import {createOrUpdate, fetchCustomerInfo} from 'App/utils';
import Icon from 'react-native-vector-icons/FontAwesome';
import AnimatedModal from 'App/components/AnimatedModal';
import ImagePicker from 'react-native-image-picker';
import {constants} from 'App/constants';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
//import Input from 'App/components/common/Input';
import {firebase, auth, db} from 'App/firebase/config';
import OptionsModal from 'App/navigators/OptionsModal';
import {useDispatch} from 'react-redux';
import {validateCard, cc_brand_id, updateCard} from 'App/utils';



const showCardIcon = (brand, color)=>{
    const cardColor = color;
    const cardIcons = {'Visa': <Icon name="cc-visa" size={25} color={cardColor}/>, "MasterCard": <Icon name="cc-mastercard" size={25} color={cardColor} />, "American Express":<Icon name="cc-amex" size={25} color={cardColor} />,"Diners Club":<Icon name="cc-diners-club" size={25} color={cardColor} />, "Discover": <Icon name="cc-discover" size={25} color={cardColor} />, "JCB":<Icon name="cc-jcb" size={25} color={cardColor} />, "UnionPay":<Icon name="credit-card" size={25} color={cardColor} />, "Unknown": <Icon name="credit-card" size={25} color={cardColor} />, "Maestro": <Icon name="credit-card" size={25} color={cardColor} />}
    return cardIcons[brand];
    }
    
const SmartCheckout = () => {
console.log("HAS ID", hasId)
const [billModal, setBillModal] = useState(false);
const [shipModal, setShipModal] = useState(false);

const [changed, setChanged] = useState(false);
const [creditCardChanged, setCreditCardChanged] = useState(false);
const [hasId, setHasId] = useState(false);
const select = useSelector(state=>state.userInfo);

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
        setInfo(data.customer);
        console.log("ADDRESSSS");
        console.log("CUSTOMER INFO", data.customer);
        setCreditInfo(data.card);
      // console.log(data.card,"MY CARD");
      })
  }
}, [select.customerId]);

const [info, setInfo] = useState({
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
});
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


return <View>
            <View style={{flex: 1, marginTop: 20,}} >
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
            <TouchableOpacity 
            style={{marginRight: 10,width: '100%', justifyContent: 'space-between', flexDirection:'row'}}
            onPress={()=>{
                setBillModal(true);
            }}><Text>Billing information</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{marginRight: 10}}>
            {creditInfo.last4?
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {showCardIcon(creditInfo.brand, constants.LAVENDER)}<Text style={{marginLeft: 5, color: 'black'}}>{creditInfo.last4}</Text>
            </View>
            :<Text style={{color: constants.RED}}>Needs Action</Text>}
            </View>
            <Icon name="chevron-right" size={20} />
            </View>
            </TouchableOpacity>
        </View>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
            <TouchableOpacity 
            style={{marginRight: 10,width: '100%', justifyContent: 'space-between', flexDirection:'row'}}
            onPress={()=>{
                setShipModal(true);
            }}><Text>Shipping information</Text>

            <View style={{flexDirection: 'row'}}>
              <View style={{marginRight: 10}}>
            {info?.address?.line1?
            <View style={{flexDirection: 'row', alignItems: 'center',}}>
            <Text>{info.address.line1}</Text>
            </View>
            :<Text style={{color: constants.RED, textAlign: 'right'}}>Needs Action</Text>}
            </View>
            <Icon name="chevron-right" size={20} />
            </View>
            </TouchableOpacity>
            
        </View>
        </View>
        <AnimatedModal colored={true} colors={[constants.ORANGE, constants.GREYORANGE]} visible={billModal} close={()=>setBillModal(false)} state={info} setState={setInfo} content={<BillingModal state={creditInfo} setState={setCreditInfo} setChanged={setCreditCardChanged} close={()=>setBillModal(false)}/>}/>
<AnimatedModal colored={true} colors={[constants.ORANGE, constants.GREYORANGE]} visible={shipModal} close={()=>setShipModal(false)} state={info} setState={setInfo} content={<ShippingModal state={info} setState={setInfo} setChanged={setChanged} close={()=>setShipModal(false)}/>}/>
</View>


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
  
    // const placeholderColor = localState.number === ''?'grey':'black';
    // const numberPlaceholder= localState.number=== ''?'4242424242424242':localState.number;
    // const expirationPlaceholder = localState.expMonth === ''?"MM/YY":localState.expMonth+"/"+localState.expYear;
    return <ScrollView style={{paddingLeft: 30, paddingRight: 30, borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor:'white', zIndex: 50}}>
           
           <Text style={{color: 'red', opacity: error?1:0}}>Please review your information for errors</Text>
           <Text style={{alignSelf: 'center',fontSize: 15, fontFamily: constants.FONT, fontWeight: 'bold'}}>Billing Information</Text>
            <PaymentCard
            state={state}
            onParamsChange={(valid, params) => {
              console.log('changing');
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
            <TouchableOpacity style={{marginTop:30, borderRadius: 40, overflow: 'hidden',  height: 35, width: "100%", alignSelf:'center', backgroundColor:constants.ORANGE, justifyContent:'center', alignItems: 'center', borderRadius:30}} onPress={()=>{
                 // if (!(validateCard(cardNumber(cardNumber)) && validateExp(expMonth, expYear)))
                // valid = true;
                 if (!valid) {
                    setError(true);
                    console.log('error');
                    return;
                }
                const cardString = localState.number;
                setState({...localState, brand: localState.brand, last4: cardString.substring(cardString.length - 4, cardString.length)});
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
  
  const ShippingModal = ({state, setState, close, setChanged}) => {
    const [localState, setLocalState] = useState(state);
    const [address, setAddress] = useState(state.address?.line1);
    const [geostate, setGeostate] = useState(state.address?.state);
    const [city, setCity] = useState(state.address?.city);
    const [zip, setZip] = useState(state.address?.postal_code)
    const [name, setName] = useState("");
  
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
            <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>Address</Text>
            <TextInput value = {address}  onChangeText={(text)=> {
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
                        {/* <View>
                        <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>Country</Text>
            <TextInput defaultValue={localState.addressCountry} onChangeText={(text)=> {
                localState.addressCountry = text;
            }} style={styles.textbox} />
            </View> */}
            </View>            
            <Text style={{marginLeft: 10, marginTop: 15, marginBottom: 5}}>Zip Code</Text>
            <TextInput value={zip} maximumLength={5} keyboardType="numeric" onChangeText={(text)=> {
                setZip(text);
            }} style={styles.textbox} />
  
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
        <TextInput defaultValue = {state.cvc} value={cvcVal} ref = {cvc} maxLength={3} style={styles.textbox} 
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
    row: {width: '100%', marginLeft: 10, borderBottomWidth: 2, borderColor: constants.PINK_BACKGROUND,paddingHorizontal:20, paddingVertical:20},
  });


  export default SmartCheckout;