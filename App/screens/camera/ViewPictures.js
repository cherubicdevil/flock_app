import React, {Component} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  Button,
} from 'react-native';
import Video from 'react-native-video';
//import ListView from 'deprecated-react-native-listview';

//import SelectedPicture from './SelectedPicture';

class ViewPictures extends Component {
  state = {
    // ds: new ListView.DataSource({
    //   rowHasChanged: (r1, r2) => r1 !== r2,
    // }),
    showSelectedPicture: false,
    uri: '',
  };

  renderRow(rowData) {
    console.log('THIS IS NODE: ', rowData.node);
    const {uri} = rowData.node.image;
    return (
      <TouchableHighlight
        onPress={() => {
          this.setState({showSelectedPicture: true, uri: uri});
          console.log('This is where uri gets dropped: ', uri);
          this.props.selectImage(uri);
          this.props.showFunc();
        }}>
        <Image muted source={{uri: uri}} style={styles.image} />
      </TouchableHighlight>
    );
  }

  renderItem(it) {
    //console.log(it);
    const {uri} = it.item.node.image;
    console.log('item', it.item.node);
    return (
      <TouchableHighlight
        onPress={() => {
          this.setState({showSelectedPicture: true, uri: uri});
          console.log('This is where uri gets dropped: ', uri);
          this.props.selectImage(uri);
          this.props.showFunc();
        }}>
        <Image style={styles.image} source={{uri: it.item.node.image.uri}} />
      </TouchableHighlight>
    );
  }
  renderFireItem(it) {
    console.log('fireitem', it.item.video);
    const uri = it.item.video;
    return (
      <TouchableHighlight
        onPress={() => {
          this.setState({showSelectedPicture: true, uri: uri});
          console.log('This is where uri gets dropped: ', uri);
          this.props.selectImage(uri);
          this.props.showFunc();
        }}>
        <Video muted style={styles.image} source={{uri: uri}} />
      </TouchableHighlight>
    );
  }
  keyExtractor(item) {
    //console.log('this is item node:', item);
    item.node.image.filename;
    //item.node.name;
  }
  fireKeyExtractor(item) {
    item.title;
  }

  render() {
    const {showSelectedPicture, uri} = this.state;

    // if (showSelectedPicture) {
    //   return (
    //     <SelectedPicture
    //       showFunc={() => {
    //         this.setState({showSelectedPicture: false});
    //       }}
    //       uri={uri}
    //     />
    //   );
    // }
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 0.1,
            alignItems: 'flex-start',
            backgroundColor: '#ff8009',
          }}>
          <Text
            style={{
              fontSize: 25,
              color: '#fff',
              fontWeight: 'bold',
              paddingLeft: 25,
              paddingTop: 40,
            }}>
            Your Clucks
          </Text>
        </View>
        {/*<ListView
          contentContainerStyle={styles.list}
          dataSource={this.state.ds.cloneWithRows(this.props.pictureArray)}
          renderRow={(rowData) => this.renderRow(rowData)}
          enableEmptySections={true}
        />*/}
        <FlatList
          style={{flex: 0.9}}
          data={this.props.pictureArray}
          keyExtractor={
            this.props.fire
              ? this.fireKeyExtractor.bind(this)
              : this.keyExtractor.bind(this)
          }
          numColumns={3}
          horizontal={false}
          renderItem={
            this.props.fire
              ? this.renderFireItem.bind(this)
              : this.renderItem.bind(this)
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  video: {
    //width: Dimensions.get('window') / 3 - 5,
    paddingLeft: 15,
  },
  image: {
    width: Dimensions.get('window').width / 4 - 5,
    height: 130,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#efefef',
  },
});

export default ViewPictures;
