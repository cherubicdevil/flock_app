import React from 'react';
import {View, Image, Text} from 'react-native';
import {constants} from 'App/constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import {rentPrice} from 'App/utils';

const ProductBlurb = ({data}) => {
  // Possible FLOCK_BUG
  // do I need to check for null?
  if (data?.product === undefined) {
    return <View />;
  }

  // FLOCK_UPDATE all data should have type tags
  var type = "";
  if (data.type == 'rec') {
    type = "rec";
  } else if (data.completed) {
    type="rent";
  } else if (data.completed==false) {
    type="flock";
  } else {
    type="product";
  }

  if (type == "flock") {
    return <View style= {{
      padding: 15,
      width: '100%'
    }}>
      <Text numberOfLines={1} style={{flex: 1, color: 'black'}}><Text style={{fontWeight: 'bold'}}>{data?.product?.brand} </Text>{data?.product?.title}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text style={{color: constants.ORANGE, fontWeight: 'bold'}}>${(data?.product?.price / 25 * 1.4).toFixed(2)}</Text>
      <Text>{data?.members?.length} flocking</Text>
      </View>
    </View>;
  } else if (type == "rent") {
      return <View style= {{
        padding: 15,
        width: '100%'
      }}>
        <Text numberOfLines={1} style={{flex: 1, color: 'black', }}><Text style={{fontWeight: 'bold'}}>{data?.product?.brand} </Text>{data?.product?.title}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{color: "#8484a8", fontWeight: 'bold'}}>${rentPrice(data?.product?.price)}</Text>
        <Text>borrowable</Text>
        </View>
      </View>;
  } else if (type==="rec") {
    return <View style= {{
      padding: 15,
      width: '100%'
    }}>
      <Text numberOfLines={1} style={{flex: 1, color: 'black', fontWeight:'bold'}}>{data?.product?.title}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text>@{data.username}</Text>
      <View style={{justifyContent: 'center', alignItems: 'center', marginRight: 5,}}><Icon color={"white"} size={20} name="heart" style={{position: 'absolute'}} /><Text style={{color: 'black', position: 'absolute', fontSize: 10}}>{data.likes}</Text></View>
      </View>
    </View>;
  } else if (data.objectID) { // a search result
    return <View>
      <Text numberOfLines={1} style={{color: 'black', fontWeight:'bold'}}>{data?.product?.title}</Text>
    <Text>${data?.product?.price}</Text>
    </View>;
  } else {
    return <View style= {{
      padding: 15,
      width: '100%'
    }}>
      <Text numberOfLines={1} style={{flex: 1, color: 'black'}}><Text style={{fontWeight: 'bold'}}>{data?.product?.brand} </Text>{data?.product?.title}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text style={{color: constants.ORANGE, fontWeight: 'bold'}}>${(data?.product?.price / 25 * 1.4).toFixed(2)}</Text>
      <Text>flock now</Text>
      </View>
    </View>;
  }
};

const RightBlurb = ({product, title}) => {
  // Possible FLOCK_BUG
  // do I need to check for null?
  if (product?.image === undefined) {
    return <View />;
  }
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        color: '#000',
        opacity: 1.0,
        //borderLeftWidth: 1,
        //borderColor: '#aeaeb2',
        paddingLeft: 15,
      }}>
      <Image
        source={{uri: product.image}}
        style={{
          borderRadius: 10,
          marginTop: 5,
          opacity: 1.0,
          width: '100%',
          height: undefined,

          aspectRatio: 1,
          resizeMode: 'cover',
          flex: 1,
        }}
      />
      <View style={{flex: 2, paddingLeft: 5}}>
        <View
          style={{
            flex: 1,
            marginTop: 5,
            height: 70,
            marginRight: 5,
            flexDirection: 'column',
            justifyContent: 'space-around',
            color: '#000',
          }}>
          <Text
            style={{
              fontFamily: 'Nunito-Light',
              flex: 2,
              paddingRight: 5,
              fontSize: 14,
              color: '#000',
            }}>
            {title}
          </Text>
          <Text
            style={{
              flex: 1,
              color: constants.PURPLEORANGE,
              fontFamily: 'Nunito-Light',
            }}>
            ${product.price}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ProductBlurb;
