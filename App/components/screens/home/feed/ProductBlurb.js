import React from 'react';
import {View, Image, Text} from 'react-native';
import {constants} from 'App/constants';

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
  }

  if (type == "flock") {
    return <View style= {{
      padding: 15,
      width: '100%'
    }}>
      <Text numberOfLines={1} style={{flex: 1, color: 'black', fontWeight:'bold'}}>{data?.product?.title}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text style={{color: constants.ORANGE, fontWeight: 'bold'}}>${data?.product?.price / data?.members?.length} pp</Text>
      <Text>{data?.members?.length} flocking</Text>
      </View>
    </View>;
  }
  return (
    <View
      style={{
        width: '100%',
        overflow: 'hidden',
        //backgroundColor: 'rgb(255,255,255)',
        //borderRadius: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
      }}>
      <RightBlurb product={data.product} title={data.product.title} />
    </View>
  );
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
