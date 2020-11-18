import React, {Component, useState} from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
//import Flockit from './Flockit';
import PropTypes from 'prop-types';

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

  renderDetail = () => {
    return (
      <View>
        <Text style={styles.detailText}>Details</Text>
        <Text style={styles.subDetailText}>
          Product details her blah blah blah blah blah
        </Text>
      </View>
    );
  };

  renderDescription = () => {
    return (
      <View>
        <Text style={styles.priceText}>
          {this.props.route.params.album.title}
        </Text>
        <Text style={styles.priceText}>
          ${this.props.route.params.album.price}
        </Text>
        {/*<Text style={styles.descriptionText}>50 flockers have bought</Text>*/}
        {/*<Text style={styles.descriptionText}>Recommended by username</Text>*/}
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
          <ImageBackground
            source={require('App/Assets/Images/OrangePurpleGradient.png')}
            style={styles.coverImage}>
            <Image
              style={{width: '90%', height: '90%', alignSelf: 'center'}}
              source={{uri: this.props.route.params.album.image}}
            />
            <PhotoButton />
          </ImageBackground>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.mainViewStyle}>
        <ScrollView style={styles.scroll}>
          <View style={[styles.container]}>
            <View style={styles.cardContainer}>
              {this.renderContactHeader()}
            </View>
          </View>
          <View style={styles.footer}>
            <Flockit style={{flex: 1}} />
            <View style={styles.borderCenter} />
            <TouchableOpacity
              style={styles.buttonFooter}
              onPress={() => {
                const title = this.props.route.params.album.title;
                const price = this.props.route.params.album.price;
                this.props.navigation.navigate('PayTest', {
                  title,
                  price,
                  useFlockPrice,
                  flockPrice,
                });
                // Linking.openURL(
                //   'https://shopwithflock.com/redirect/?url=' +
                //     this.props.navigation.state.params.album.url,
                // )
              }}>
              <Text style={styles.textFooter}>BUY IT NOW</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productRow}>{this.renderDescription()}</View>
          {/* <View style={styles.productRow}>{this.renderNavigator()}</View> */}
          {/*   <View style={styles.productRow}>{this.renderDetail()}</View> */}
        </ScrollView>
        <View style={styles.cluckfooter}>
          <TouchableOpacity style={styles.buttonCluck}>
            <Image
              style={styles.circleProfile}
              source={require('App/Assets/Images/ProfilePic.png')}
            />
            <Text style={styles.textFooter}>Cluck</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Product;