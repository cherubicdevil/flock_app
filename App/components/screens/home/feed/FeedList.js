/* 
* Made by Kevin Gao, for Flock Shopping.
* All rights reserved.
* Flock © 2020
*
*
			 _______  ___        ______    ______   __   ___  
			/"     "||"  |      /    " \  /" _  "\ |/"| /  ") 
			(: ______)||  |     // ____  \(: ( \___)(: |/   /  
			\/    |  |:  |    /  /    ) :)\/ \     |    __/   
			// ___)   \  |___(: (____/ // //  \ _  (// _  \   
			(:  (     ( \_|:  \\        / (:   _) \ |: | \  \  
			\__/      \_______)\"_____/   \_______)(__|  \__)
*
*/
/*
 * FeedList.js
 *
 * This file contains code for the FeedList of flock the app.
 * It resides on the HomePage, in a masonry format to show both
 * clucks and products.
 *
 *
 */

import React from 'react';
import {Dimensions, ScrollView, View} from 'react-native';
import FeedItem from './FeedItem';
import HalfProduct from './HalfProduct';
import {constants} from 'App/constants';
import {fetchAlbums, fetchProducts, mergeArrays} from 'App/utils';
import LinearGradient from 'react-native-linear-gradient';

class FeedList extends React.Component {
  state = {album1: [], album2: [], myAr: [], visible: true, inInView: false};

  constructor(props) {
    super(props);
  }

  checkVisible(isVisible) {
    this.setState({isInView: isVisible});
  }

  renderClucks(album) {
    return album.map((al) => {
      if (al.price) {
        return <HalfProduct navigation={this.props.navigation} album={al} />;
      } else {
        return (
          <FeedItem
            mute={true}
            repeat={true}
            ar={this.state.myAr}
            videoAr={this.props.route.params.videoData}
            index={this.state.myAr.indexOf(al)}
            navigation={this.props.navigation}
            data={al}
            source={{uri: al.image || al.video}}
            title={al.title}
            type={al.type}
            key={al.title + Math.random()}
          />
        );
      }
    });
  }

  render() {
    const ar = mergeArrays(this.props.route.params.videoData, []);
    const album1 = ar.slice(0, ar.length / 2);
    const album2 = ar.slice(ar.length / 2, ar.length);
    console.log(this.props.route.params.videoData[0].title);
    return (
      <View>
        <LinearGradient
          colors={[constants.LIGHTGREY, 'rgba(0,0,0,0)']}
          style={{
            height: 70,
            width: '100%',
            position: 'absolute',
            top: 0,
            zIndex: 40,
          }}></LinearGradient>
        <ScrollView
          style={{
            paddingLeft: 15,
            paddingRight: 15,

            // marginLeft: 10,
            // marginRight: 10,
          }}
          contentContainerStyle={{
            justifyContent: 'space-around',
            flexDirection: 'row',
          }}
          onScrollEndDrag={(event) => {
            if (
              event.nativeEvent.contentOffset.y + 400 >
              0.8 * event.nativeEvent.contentSize.height
            ) {
              console.log('should be fetching albums');
              //this.props.fetchAlbums();
            }

            console.log(
              event.nativeEvent.contentOffset.y,
              0.8 * event.nativeEvent.contentSize.height,
            );
          }}>
          <View
            key="0"
            style={{
              flexDirection: 'row',
              flex: 1,
            }}>
            <View style={styles.columnStyle}>{this.renderClucks(album1)}</View>
            <View key="1" style={styles.columnStyle}>
              {this.renderClucks(album2)}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  columnStyle: {flex: 1, alignItems: 'center'},
};

export default FeedList;
