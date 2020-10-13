import React, {Component} from 'react';
import {Dimensions, ScrollView, View, StyleSheet, Image} from 'react-native';
//import AnimatedLoader from 'react-native-animated-loader'

import {firebase} from 'App/firebase/config';
import DynImage from './DynImage';

const window = Dimensions.get('window');
const imageWidth = window.width / 2;
const imageHeight = window.width / 2;
export default class Brochures extends Component {
  state = {brochuresData: [], visible: false};

  test() {
    fetch('http://rallycoding.herokuapp.com/api/music_albums')
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          brochuresData: [
            ...responseData,
            {
              image:
                'https://live.staticflickr.com/8856/28393192301_dcbece8118_b.jpg',
            },
          ],
        });
      });
  }
  componentDidMount() {
    const ar = [];
    var counter = 0;
    firebase
      .firestore()
      .collection('posts')
      .get()
      .then((querySnapshot) => {
        const n = querySnapshot.size;
        querySnapshot.forEach((doc) => {
          const entity = doc.data();

          ar.push(entity);
          counter = counter + 1;
          console.log(counter);
          if (counter == n) {
            console.log(ar);
            console.log('reach end');
            this.setState({brochuresData: [...ar]});
            this.setState({visible: false});
            //console.log(this.state.brochuresData)
          }
        });
      });

    this.setState({visible: true});

    //this.setState({ brochuresData: [...this.state.brochuresData, ar] })

    // <AnimatedLoader
    // visible={this.state.visible}
    // overlayColor="rgba(255,255,255,0.75)"
    // animationStyle={styles.lottie}
    // source={require('App/Assets/floating_duck.json')}
    // speed={1}
    // style={{ height: '50%', width: '50%' }}
    // />
  }

  render() {
    //console.log(this.state.brochuresData)
    const brochuresView = this.state.brochuresData.map(Brochure);
    return (
      <View>
        <ScrollView contentContainerStyle={styles.container}>
          {brochuresView}
        </ScrollView>
      </View>
    );
  }
}

const Brochure = (data) => {
  const {child, image} = styles;
  return (
    <View key={data.title} style={child}>
      <DynImage source={{uri: data.image}} title={data.title} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  child: {
    width: window.width / 2,
    alignItems: 'center',
    height: undefined,
    marginTop: 5,
  },
  image: {
    width: imageWidth,
    height: imageHeight,
  },
});
