import React from 'react';
import {View, ScrollView, Text, TextInput, Image} from 'react-native';
import ProgressHeader from 'App/components/ProgressHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {constants} from 'App/constants';
import LinearGradient from 'react-native-linear-gradient';

const StartFlock = ({navigation, route}) => {
    const Tab = createMaterialTopTabNavigator();
    console.log('start flock index is', route.params);
    var ar = [<PageOne product = {route.params.product} data = {route.params.data} />, <PageTwo />, <PageThree />, <PageFour />];
    return <ScrollView scrollEnabled={false} keyboardShouldPersistTaps="never"><ProgressHeader
    nextRoute="StartFlock"
    backRoute="StartFlock"
    headerText="Start a Flock"
    goBack={true}
    navigation={navigation}
    index={route.params.index}
    number={4}
    data={route.params.data}
  />
    {ar[route.params.index]}
  </ScrollView>
}

const PageOne = ({product, data}) => {
    return <View style={{width:'100%', backgroundColor: 'white', marginTop: 5, padding: 20}}>
        <InputText data = {data} numLines = {2} placeholder = "Size 4? Size 10? Red? Green?" label="List specifications like size and color if applicable."/>
        <InputText data = {data} numLines = {4} placeholder = "What do you want others to know about this product? Hype it up so they join your flock and lower your price?" label="Message"/>
        <ProductPreview product = {product}/>

    </View>;
}

const PageTwo = () => {
    return <Text>Test 2</Text>
}

const PageThree = () => {
    return <Text>Test 3</Text>
}

const PageFour = () => {
    return <Text>Test 4</Text>
}

const InputText = ({numLines, data, member, placeholder, label}) => {
    return <View style={{marginBottom: 10}}><Text style={{fontWeight: 'bold'}}>{label}</Text>
    <TextInput defaultValue={data[label]} blurOnSubmit placeholder={placeholder} style={{marginTop: 5, borderColor: "grey", paddingLeft: 15, borderRadius: 10, borderWidth: 1, height: numLines * 25}} multiline numberOfLines = {5} onBlur = {(e)=> {
        console.log("BLUR", e.nativeEvent.text);
        data[label] = e.nativeEvent.text;
    }} /></View>
}

const ProductPreview = ({product}) => {
    return <View style={{flexDirection: 'row'}}>
        <Image style={{width: 50, height: null, marginRight: 10}} source={{uri: product.image}} />
        <View style={{flex:1}}>
            <Text style={{fontWeight: 'bold'}}>{product.title}</Text>
            <Text style = {{textDecorationLine: 'line-through', color: 'red', }}>${product.price}</Text>
            <LinearGradient
          colors={[constants.YELLOW, constants.ORANGE]}
          start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 30,
            //alignItems: 'center',
            paddingLeft: 10,
            paddingTop: 10,
            paddingBottom: 10
          }}><Text style={{color: 'white', fontSize: 14, fontFamily: constants.FONTBOLD}}>{"$" + Math.floor(product.price / 2) + " or less when you split with flockers"}</Text>
</LinearGradient>
        </View>
    </View>
}

export default StartFlock;