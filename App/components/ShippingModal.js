import React, {useState} from 'react';
import {View, Text, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import AnimatedModal from 'App/components/AnimatedModal';
import {constants} from 'App/constants';
import LinearGradient from 'react-native-linear-gradient';

const ShippingModal = ({close, completeFunc=()=>{}}) => {
    const [address, setAddress] = useState('');
    const [geostate, setGeostate] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('')
    const [name, setName] = useState('');
  
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
                close();
                completeFunc();
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

  export default ShippingModal;

  const styles = {
    textbox: {borderWidth: 1, borderColor: constants.DARKGREY, borderRadius: 30, padding: 10, paddingBottom: 10, paddingTop: 10, fontSize: 18},
    row: {width: '100%', borderBottomWidth: 2, borderColor: constants.PINK_BACKGROUND,paddingHorizontal:20, paddingVertical:20},
}