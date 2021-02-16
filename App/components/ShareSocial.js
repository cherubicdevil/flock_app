import React, {useState, useRef} from 'react';
import {View, ScrollView, Text, Switch, TextInput, Image,Dimensions, TouchableOpacity} from 'react-native';
import ProgressHeader from 'App/components/ProgressHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {constants} from 'App/constants';
import LinearGradient from 'react-native-linear-gradient';
import {shareActions} from 'App/utils';
import {useDispatch} from 'react-redux';
import ViewShot from 'react-native-view-shot';
import Animation from 'lottie-react-native';
import {firebase, db} from 'App/firebase/config';
import ResizeableImage from 'App/components/ResizeableImage';

const ShareSocial = ({product, data={}, flockId, shareApp=false, showImage=true, onSuccess=()=>{}}) => {
    const img = useRef();

    data['imgRef'] = img;
    return <View style={{height: Dimensions.get('window').height - constants.NAVBARHEIGHT - constants.HEADERHEIGHT - 50, borderBottomLeftRadius: 60, borderBottomRightRadius: 60, overflow:'hidden'}}>
    <ScrollView style={{paddingBottom:20, backgroundColor:'white', marginTop:10}}><View style={[styles.container, {marginBottom: -2,}]}>
        <Text style={{fontWeight:'bold'}}>Want to pay less? Get more people to join, and earn eggs when you share!</Text>
    </View>
    {/* <ShareRow label="Tag a flocker"  product = {product} data={data} toggle={false} egg={false} shareApp={shareApp}/> */}
    <ShareRow label="Share on Facebook" app="facebook" product = {product} data={data} toggle={true} egg={true} shareApp={shareApp} onSuccess={onSuccess} />
    <ShareRow label="Share on Instagram" app="instagram" product = {product} data={data} toggle={true} egg={true} shareApp={shareApp} onSuccess={onSuccess} />
    <ShareRow label="Share on Snapchat" app="snapchat" product = {product} data={data} toggle={true} egg={true} shareApp={shareApp} onSuccess={onSuccess} />
    {/* <ShareRow label="Share on Tiktok" app="tiktok" product = {product} data={data} toggle={true} egg={true} shareApp={shareApp} /> */}
    <ShareRow label="Share on Twitter" app="twitter" product = {product} data={data} toggle={true} egg={true} shareApp={shareApp} onSuccess={onSuccess}/>
    <ShareRow label="Share on Whatsapp" app="whatsapp" product = {product} data={data} toggle={true} egg={true} shareApp={shareApp} onSuccess={onSuccess} />
    {/* <ShareRow label="Text" app="text" product = {product} data={data} toggle={false} egg={true} shareApp={shareApp} /> */}
    {/* <ShareRow label="Email" app="email" product = {product} data={data} toggle={false} egg={true} shareApp={shareApp} /> */}

    {!shareApp?<ViewShot style={{marginTop:20}} ref={img} options={{ result: "base64", format: "jpg", quality: 0.9 }}>
        {product?.image?
        <>
        <Text style={{fontFamily: constants.FONT, fontSize:20, paddingHorizontal: 15}}>
            Co-own this with me for <Text style={{textDecorationLine:'line-through'}}>${product.price}</Text> ${(parseFloat(product.price)/25 * 1.4).toFixed(2)}
        </Text>
        <ResizeableImage source = {{uri: product.image}} wLimit={Dimensions.get('window').width} />
        <View style={{ position:'absolute', height:'100%', width:'100%', justifyContent:'center', alignItems:'center',}}>
        <View style={{justifyContent: 'center', 
        backgroundColor: "rgba(255,255,255,0.4)", paddingVertical:5,
        shadowColor: 'white', shadowOpacity: 100, shadowRadius: 5, shadowOffset:{height:0}, }}>
        <Image style={{height: 120, width: 300}} source={require('App/Assets/Images/Flock_Watermark.png')}/>
<Text style={{marginTop: -35, alignSelf: 'flex-end', width: 170, 
shadowColor: 'white', shadowOpacity: 1, shadowOffset:{height:0}, 
fontFamily: 'Nunito', fontWeight: 'bold', fontSize: 16}}>search {<Text style={{color: 'black'}}>%{flockId.padStart(5,'0').substring(0,5)}</Text>} in app</Text>
        </View>
        </View>
        </>:<></>}
      </ViewShot>:
      <ViewShot ref={img} options={{ result: "base64", format: "jpg", quality: 1 }}>
      {/* <ResizeableImage source = {{uri: product.image}} wLimit={Dimensions.get('window').width} /> */}
      <View style={{marginTop: 40, overflow: 'hidden', resizeMode: 'contain'}}>
          {/* <Text style={{fontSize: 24, textAlign: 'center',fontWeight: 'bold'}}>Shop with friends</Text> */}
      <View>
      <Image style={{width: '100%', height: 100, resizeMode: 'contain'}} source={require('App/Assets/Images/Flock_Watermark.png')}/>
<Text style={{position: 'absolute', bottom: 10, right: 90, marginTop: -15, alignSelf: 'flex-end', width: 125, shadowColor: 'white', shadowOpacity: 1, shadowOffset:{height:0}, fontFamily: 'Nunito', fontWeight: 'bold', fontSize: 8, textAlign: 'center'}}>Get it now on the app store! Visit shopwithflock.com</Text>
      </View>
      </View>
    </ViewShot>
      }
    </ScrollView>
    </View>
}

const ShareRow = ({toggle, label, app, egg, product, data={}, shareApp, onSuccess}) => { 
    const [showEgg, setShowEgg] = useState(false);
    const animation = useRef();
    const onFailure = () => {
        setToggle(false);
    }
  console.log("IMAGE", product);
    const toggleFunc = () => {
        if (tog) {
            onSuccess=()=>{};
        } else {
            setToggle(!tog);
        }
        
        //animation.play();
        var content;
            var content = {product: product, shareApp: shareApp, data: data, successCallBack: ()=>{setShowEgg(true)}};
            // onSuccess();
      shareActions[app](content, onFailure);

    }
    const [tog, setToggle] = useState(false);
    var shareAction = toggle?<Switch value={tog}
    onValueChange={toggleFunc}
    trackColor={{ false: constants.DARKGREY, true: constants.ORANGE }}
    style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }} />:<Image source={require('App/Assets/Images/Front_Icon.png')} style={{width:20, height: 20, tintColor: constants.DARKGREY}} />;
var shareContainer = <View style={{alignItems: 'center', flexDirection: 'row'}}>
    {showEgg?
    <TouchableOpacity onPress={()=>{
        onSuccess();
        setShowEgg(false); // should be false
        setToggle(false);
    }}>
    <View style={{flexDirection: 'row', alignItems: 'center'}}><Text style={{color: constants.ORANGE, fontSize: 12}}>You've earned +10 eggs!</Text><Image style={{width: 20, height: 20, resizeMode:'contain'}} source={constants.EGG_GOLD} /></View>
    </TouchableOpacity>
    :<View />}{shareAction}</View>;
    return <>
    {/* <LottieView style={{backgroundColor:'black'}} speed = { 1.5} source={require('App/Assets/coins.json')} autoPlay loop /> */}
    
    <View style={{alignItems: 'center', backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', marginTop: 2, paddingLeft: 20, paddingRight: 20, height: 40}}>
        <Text style={{fontWeight: 'bold'}}>
            {label}
        </Text>
        
        {shareContainer}
        {/* <Animation ref={animation} style= {{position: 'absolute', right: 20, width: 50, height: 50, }}source={require('App/Assets/coins.json')} /> */}
        </View>
        
        </>
}
export default ShareSocial;

const styles = {
    container: {width:'100%', backgroundColor: 'white', marginTop: 5, padding: 20},
    inputBox: {borderColor: "grey", paddingLeft: 15, borderRadius: 10, borderWidth: 1}
};