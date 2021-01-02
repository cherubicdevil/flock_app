import React, {Component, useState, useEffect} from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  SafeAreaView,
  Button,
  Linking,
} from 'react-native';
import {firebase} from 'App/firebase/config';
import {WebView} from 'react-native-webview';
import {constants} from 'App/constants';
import LinearGradient from 'react-native-linear-gradient';
//import Flockit from './Flockit';
import PropTypes from 'prop-types';
import Video from 'react-native-video';
import productData from './product.json';

import PhotoButton from './PhotoButton';
import ProductStyles from './ProductStyle';
import ModalSelector from 'react-native-modal-selector';

const styles = StyleSheet.create({...ProductStyles});

let index = 0;
let useFlockPrice = false;
let flockPrice = 0;
const data = [
  {
    key: index++,
    section: true,
    label:
      'HOW IT WORKS \n\n You choose the desired discount amount. We present your request to the retailer along with requests of other FLOCKERS when the countdown ends. \n\n If the retailer accepts the request, we’ll charge your credit card and submit the order. Your credit card will NOT be charged unless we can get this for you.',
  },
  {key: index++, label: '-0%'},
  {key: index++, label: '-10%'},
  {key: index++, label: '-20%'},
  {key: index++, label: '-30%'},
  {key: index++, label: '-40%'},
];

const Flockit = () => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <View style={{flex: 1, height: '100%', zIndex: 10}}>
      <ModalSelector
        data={data}
        initValue="FLOCK IT"
        initValueTextStyle={{
          height: '100%',
          fontSize: 24,
          paddingTop: 7,
          color: '#fff',
        }}
        selectTextStyle={{
          height: '100%',
          fontSize: 24,
          paddingTop: 7,
          color: '#fff',
        }}
        onChange={(option) => {
          if (option.key == 1) {
            useFlockPrice = false;
            flockPrice = 0;
          } else {
            flockPrice = option.label.substring(1, 3);
          }
          console.log('FLOCCKCKKC', flockPrice);
        }}
      />
    </View>
  );
};

class Product extends Component {
  static propTypes = {
    // img: PropTypes.string.isRequired,
    // detail: PropTypes.string.isRequired,
    // containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  };

  static defaultProps = {
    containerStyle: {},
  };

  componentDidMount () {


  }

  renderDetail = () => {
    return (
      
      <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between'}} onPress={() => {
        Linking.openURL(
          'https://shopwithflock.com/redirect/?url=' +
            this.props.route.params.album.url,
        );
      }}>
        <Text style={{fontFamily: constants.FONTBOLD, fontSize: 14, color: 'black'}}>
          Product information, description, and details
        </Text>
        <Text>{'>'}</Text>
      </TouchableOpacity>
    );
  };

  renderDescription = () => {
    return (
      <View>
        <Text style={{fontSize: 14, fontWeight: 'bold', marginBottom: 5,}}>
          {this.props.route.params.album.title}
        </Text>
        <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
        <Text style={{alignSelf: 'center', fontFamily: constants.FONTBOLD, color: constants.ORANGE, fontSize: 16}}>
          ${this.props.route.params.album.price}
        </Text>
        {/*<Text style={styles.descriptionText}>50 flockers have bought</Text>*/}
        {/*<Text style={styles.descriptionText}>Recommended by username</Text>*/}
        <LinearGradient
          colors={[constants.YELLOW, constants.ORANGE]}
          start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 30,
            zIndex: 40,
          }}><TouchableOpacity style={{borderRadius: 30, color: 'white', justifyContent: 'center', alignItems:'center', paddingBottom: 5, paddingTop: 3,paddingLeft: 10, paddingRight: 10}}><Text style={{color: 'white', fontSize: 14, fontFamily: constants.FONTBOLD}}>{"$" + Math.round(this.props.route.params.album.price / 7) + " or less when you split with flockers"}</Text></TouchableOpacity>
</LinearGradient>
        </View>
      </View>
    );
  };

  renderNavigator = () => {
    return (
      <View style={{flexDirection: 'column'}}>
        <TouchableOpacity style={[styles.navigatorButton, {flex: 2}]}>
          <Text style={styles.navigatorText}>SIZE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navigatorButton, {flex: 2}]}>
          <Text style={styles.navigatorText}>COLOR</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderContactHeader = () => {
    console.log(this.props.route.params.album.image);
    return (
      <View style={styles.headerContainer}>
        <View style={styles.coverContainer}>
          <View style={styles.coverImage}>
            <TouchableOpacity style={{zIndex: 50, height: 30, width: 50,position: 'absolute', top: 40, left: 30}} onPress={this.props.navigation.goBack}><Image style={{width: 35, height: 35, tintColor: constants.LIGHTGREY}} source = {require('App/Assets/Images/Back_Icon.png')} /></TouchableOpacity>
            <Image
              style={{
                width: '100%',
                resizeMode: 'contain',
                aspectRatio: 1,
                height: '100%',
                //height: 200,
                alignSelf: 'center',
              }}
              source={{uri: this.props.route.params.album.image}}
            />
            <Video
          repeat={true}
          muted={true}
          source={{
            uri: this.props.route.params.video.video,
          }}
          style={{
            height: 150,
            width: 150,
            position: 'absolute',
            bottom: -33,
            right: -15,
          }}
        />
          </View>
        </View>
      </View>
    );
  };

  render() {

    return (
      <>
      <ScrollView style={styles.mainViewStyle}>
        {/* <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(40,60,81, 0.4)']}
          style={{
            width: '100%',
            zIndex: 40,
            position: 'absolute',
            bottom: 0,
            height: '30%',
            width: '100%',
          }}> */}
        {/* <Image
            style={{
              height: '100%',
              width: '100%',
              //tintColor: 'rgb(180,44,81)',
              tintColor: constants.RED,
              resizeMode: 'repeat',
              zIndex: 50,
            }}
            source={require('App/Assets/Images/gray-floral.png')}
          /> */}
        {/* </LinearGradient> */}

        <View style={styles.scroll}>
              {this.renderContactHeader()}
          <View
            style={{
              flex: 1,
              height: '100%',
              //borderWidth: 1,
              //borderColor: 'rgba(0,0,0,0.2)',

              marginRight: 5,
              marginLeft: 5,
              //backgroundColor: 'white',
              borderRadius: 10,
            }}>
            <View style={styles.productRow}>{this.renderDescription()}</View>
            <FlockList navigation = {this.props.navigation} product = {this.props.route.params.album} />
            <View style={styles.productRow}>{this.renderDetail()}</View>
          </View>
          {/* <View style={styles.productRow}>{this.renderNavigator()}</View> */}
          {/*   <View style={styles.productRow}>{this.renderDetail()}</View> */}

        
        </View>
        
        {/* <View style={styles.cluckfooter}>
          <TouchableOpacity style={styles.buttonCluck}>
            <Image
              style={styles.circleProfile}
              source={require('App/Assets/Images/ProfilePic.png')}
            />
            <Text style={styles.textFooter}>Cluck</Text>
          </TouchableOpacity>
        </View> */}

      </ScrollView>
                <View style={{flexDirection: 'row', height: 40, marginBottom: 30, marginRight: 10, marginLeft:20, justifyContent: 'space-between', alignItems: 'center', }}>

            
                <Image source={constants.PLACEHOLDER_IMAGE } style={{width: 30, aspectRatio:1}}/>
                
                <View style={{justifyContent: 'center', alignItems: 'center'}}><Image source = {require('App/Assets/Images/heart.png')} style={{width: 25, height: 25,  shadowOpacity: 0.2, shadowOffset: {height:1 , width: 0}}} />
                <Text style={{position: 'absolute', top: 5,fontSize: 12}}>34</Text>
                </View>
                
                <Image source={require('App/Assets/Images/Share_Icon_White.png') } style={{shadowOpacity: 0.4, shadowOffset:{height:2, width:0},  width: 30, aspectRatio:1}}/>
              
              
              <View style={{shadowOpacity: 1, shadowColor: '#555', shadowOffset: {height: 2, width: 0}, borderRadius: 30, flex: 0.8, flexDirection: 'row', backgroundColor: constants.ORANGE, height: 50, alignItems: 'center', marginRight: 10,}}>
              <LinearGradient
              colors={[constants.YELLOW, constants.LIGHTORANGE]}
              start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
              style={{
                flexDirection: 'row',
                borderBottomLeftRadius: 30,
                borderTopLeftRadius: 30,
                height: '100%',
                flex: 1,
              }}>
                <View style={{flex: 1, height: '100%', justifyContent:'center'}}>
                  <TouchableOpacity onPress={()=>{Linking.openURL(
              'https://shopwithflock.com/redirect/?url=' +
                this.props.route.params.album.url,
            );} }><Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold',  fontSize: 13}}>Buy Now ${this.props.route.params.album.price}</Text></TouchableOpacity>
                </View>
              </LinearGradient>
              <LinearGradient
              colors={['#ff8000', '#ff4d00']}
              start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
              style={{
                flexDirection: 'row',
                borderBottomRightRadius: 30,
                borderTopRightRadius: 30,
                height: '100%',
                flex: 1,
              }}>
              <View style={{flex:1, height: '100%', justifyContent: 'center'}}>
                <TouchableOpacity style={{height: "100%", justifyContent: 'center'}} onPress= {() => {

                  this.props.navigation.navigate('StartFlock', {index: 0, product: this.props.route.params.album, data:{}});
    
                }}
    
                  >
                    <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 13}}>Start Your Flock</Text>
                </TouchableOpacity>
                </View>
                </LinearGradient>
                </View>
                </View></>
    );
  }
}



const Countdown = ({dateObj}) => {
  const [now, setNow] = useState(Math.round(Date.now()/1000));
  var diff = dateObj - now + 3600*24*7;
  useEffect(()=> {
    setInterval(()=> setNow(Math.round(Date.now()/1000)), 1000);
  }, []);

  const days = Math.round(diff / (3600*24));
  var remainder = diff % (3600*24);
  const hours = Math.floor(remainder / 3600);
  remainder %= (3600);
  const minutes = Math.floor(remainder / 60);
  remainder %= 60;
  const seconds = Math.floor(remainder);

  return <><View style={{flexDirection: 'row', justifyContent:'space-between'}}><View style={{ flex: 1, alignSelf: 'stretch' }}><Text style={{textAlign:'center'}}>{days<10?0:''}{days}</Text></View><Text>:</Text><View style={{ flex: 1, alignSelf: 'stretch' }}><Text style={{textAlign: 'center'}}>{hours<10?0:''}{hours}</Text></View><Text>:</Text><Text style={{ flex: 1, alignSelf: 'stretch', textAlign: 'center' }}>{minutes<10?0:''}{minutes}</Text><Text>:</Text><Text style={{ flex: 1, alignSelf: 'stretch', textAlign: 'center'}}>{seconds<10?0:''}{seconds}</Text></View>
  <View style={{flexDirection: 'row', justifyContent:'space-between', fontSize: 10}}><Text style={{fontSize:10, alignSelf: 'stretch'}}>days</Text><Text style={{fontSize:10, alignSelf: 'stretch'}}>hrs</Text><Text style={{fontSize:10, alignSelf: 'stretch'}}>min</Text><Text style={{fontSize:10, alignSelf: 'stretch'}}>left</Text></View></>
}

const FlockList = ({product, navigation}) => {
  const [ar, setAr] = useState([]);
  useEffect(()=>{
    const arr = [];
    var citiesRef = firebase.firestore().collection("chatGroups");
    console.log(product.title);
    // Create a query against the collection.
    var query = citiesRef.where("productTitle", "==", product.title);
    query.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          console.log("FOUNDDDDDD");
          arr.push(doc.data());
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
        setAr(arr);
    })
  }, [product]);
  const result = [];
  for (i = 0; i < Math.min(ar.length,2); i++) {
    console.log("index", i);
    const dat = ar[i];
    const tempFunc = ()=>{
      console.log("check array", ar);
      //console.log(ar.length, ar[0]);
      console.log(i);
      console.log("SENDING DATA", dat);
      navigation.navigate("ChatInterface", {data: dat});
    };
    console.log(result.length);
    result.push(  
      <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, borderTopWidth:2, borderColor: constants.GREY, paddingLeft: 20, paddingBottom:3}}>
      <View style={{flex: 1}}>
    <Text numberOfLines = {1} style={{fontWeight: 'bold', fontSize:15,width: 80, height: 20, }}>@{ar[i].members[0].name}</Text>
      <Text>and {ar[i].members.length-1} others</Text>
      </View>
      <View style={{flex: 1.75, flexDirection:'row', justifyContent: 'space-between'}}>
      <View style={{flex:1, marginRight: 15}}>
      <Countdown dateObj = {ar[i].time} />
      </View>
      <View style={{borderRadius: 30, backgroundColor: constants.ORANGE, justifyContent:'center', paddingLeft: 10, paddingRight: 10, marginRight: 20}}>
      <TouchableOpacity onPress={tempFunc}>
      <Text style={{color: 'white', fontFamily: constants.FONT, fontWeight: 'bold', fontSize: 13}}>${Math.round(ar[i].product.price/(ar[i].members.length + 1))} or less</Text>
      </TouchableOpacity>
      </View>
      </View>
      </View>
    );
  }
  return <View style={[styles.productRow, {padding:0, paddingBottom: 10}]}><Text style={{marginTop: 10,paddingLeft: 20, fontWeight: 'bold'}}>Over 36 have flock'ed. 9 are currently flock'ing.</Text>
  {result.length > 0?result:(<View style={{height: 60}}>
    <View style={{borderTopWidth: 1, paddingTop: 15, paddingLeft:20, marginTop: 10, alignItems: 'center', flexDirection: 'row'}}>
    <Text>No current flocks.</Text>
    <View
          style={{
            flexDirection: 'row',
            backgroundColor: constants.ORANGE,
            height: '100%',
            height: 30,
            width: 30,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 20,
            marginLeft: 60,
            alignSelf: 'center',
            borderRadius: 10,
            flex: 1,
          }}>
  <TouchableOpacity onPress= {() => {
    navigation.navigate('StartFlock', {index: 0, product: product});

  }}><Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 13}}>Start Your Own</Text>
  </TouchableOpacity></View></View></View>)}</View>;



}



export default Product;
