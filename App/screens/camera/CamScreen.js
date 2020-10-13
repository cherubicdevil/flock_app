import React, {Component} from 'react';
import {
  //TouchableOpacity,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableHighlight,
  View,
  ScrollView,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {firebase} from 'App/firebase/config';
import {Input} from 'App/components/common';
import CameraRoll from '@react-native-community/cameraroll';
import Video from 'react-native-video';
import ViewPictures from './ViewPictures';
import ProductChoose from 'App/screens/camera/ProductChoose';
import AlbumDetail from './AlbumDetail';

class CamScreen extends Component {
  state = {
    showPhotoGallery: false,
    firebase: false,
    pictureArray: [],
    selectedImage: null,
    showProducts: false,
    product: null,
    titleText: '',
    description: '',
    showSuccess: false,
  };
  getPicturesFromGallery() {
    console.log('about to get cameraroll');
    CameraRoll.getPhotos({first: 20, assetType: 'Videos'}).then((res) => {
      console.log(res, 'images data');
      let pictureArray = res.edges;
      this.setState({
        showPhotoGallery: true,
        pictureArray: pictureArray,
        firebase: false,
      });
    });
    console.log('got cameraroll');
  }
  getPicturesFromFirebase() {
    const ar = [];
    var counter = 0;
    firebase
      .firestore()
      .collection('posts')
      .where('type', '==', 'video')
      .limit(3)
      .get()
      .then((querySnapshot) => {
        const n = querySnapshot.size;
        querySnapshot.forEach((doc) => {
          const entity = doc.data();
          //console.log(Image.prefetch(entity.image))
          ar.push(entity);
          counter = counter + 1;
          //console.log(counter);
          if (counter == n) {
            //console.log(ar);
            this.setState({
              showPhotoGallery: true,
              pictureArray: ar,
              firebase: true,
            });
            // this.setState({
            //  myAr: ar,
            //  album1: ar.slice(0, ar.length / 2),
            //  album2: ar.slice(ar.length / 2, ar.length),
            // });
          }
        });
      });
  }
  renderSuccessBar() {
    if (this.state.showSuccess) {
      return (
        <View
          style={{
            height: 50,
            width: '80%',
            alignSelf: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 20,
            backgroundColor: '#1BDC00',
            color: '#fff',
          }}>
          <Text>Success!</Text>
        </View>
      );
    } else {
      return <View />;
    }
  }
  renderMedia() {
    if (true) {
      return (
        <Video
          repeat
          mute
          style={{width: 200, height: 200}}
          source={{uri: this.state.selectedImage}}
        />
      );
    } else {
      return (
        <Image
          style={{width: undefined, height: '95%'}}
          source={{uri: this.state.selectedImage}}
        />
      );
    }
  }
  renderSelectedImage() {
    if (this.state.selectedImage !== null) {
      console.log('selected image', this.state.selectedImage);
      return (
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity
            style={{
              width: '100%',
              height: '100%',
              paddingRight: 20,
              paddingTop: 10,
            }}
            onPress={() => {
              //this.setState({selectedImage: null});
              this.setState({showPhotoGallery: true});
            }}>
            {/*<Image
              style={{width: undefined, height: '95%'}}
              source={{uri: this.state.selectedImage}}
            />*/}
            {this.renderMedia.bind(this)()}
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{flex: 1, flexDirection: 'row', marginRight: 20}}>
          <TouchableHighlight
            style={{flex: 1, justifyContent: 'center'}}
            onPress={() => this.getPicturesFromGallery()}>
            <View View style={{alignItems: 'center'}}>
              <Image
                style={{
                  borderWidth: 1,
                  borderRadius: 3,
                  borderColor: '#888',
                  width: 150,
                  height: 150,
                  backgroundColor: '#bbb',
                }}
                source={require('App/Assets/Images/Plus_Icon.png')}
              />

              <Text style={{fontSize: 20, paddingBottom: 5}}>Camera Roll</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={{flex: 1, justifyContent: 'center'}}
            onPress={() => this.getPicturesFromFirebase()}>
            <View style={{alignItems: 'center'}}>
              <Image
                style={{
                  borderWidth: 1,
                  borderRadius: 3,
                  borderColor: '#888',
                  width: 150,
                  height: 150,
                  backgroundColor: '#bbb',
                }}
                source={require('App/Assets/Images/Plus_Icon.png')}
              />
              <Text style={{fontSize: 20, paddingBottom: 5}}>Posts</Text>
            </View>
          </TouchableHighlight>
        </View>
      );
    }
  }

  renderSelectedProduct() {
    if (this.state.product !== null) {
      return <AlbumDetail album={this.state.product} />;
    } else {
      return (
        <TouchableOpacity
          style={{
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',

            borderRadius: 3,
          }}
          onPress={() => this.setState({showProducts: true})}>
          <Text style={{fontSize: 20}}>Find Product</Text>
        </TouchableOpacity>
      );
    }
  }

  renderXBar() {
    return (
      <TouchableHighlight
        style={{
          color: '#000',
          width: 20,
          height: 20,
          position: 'absolute',
          right: 15,
          top: 45,
          zIndex: 5,
        }}
        onPress={() => this.props.navigation.pop()}>
        <Text>X</Text>
      </TouchableHighlight>
    );
  }
  renderTitleInput() {
    return (
      <View>
        <Text style={{fontSize: 20, paddingLeft: 20, paddingBottom: 5}}>
          title
        </Text>
        <Input
          label=""
          placeholder=""
          onChangeText={(word) => this.setState({titleText: word})}
          value={this.state.titleText}
          style={styles.input}
          conStyle={{
            padding: 0,
            paddingRight: 20,
            margin: 0,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}
          labStyle={{
            flex: 0,
          }}
        />
      </View>
    );
  }

  renderDescriptionInput() {
    return (
      <View>
        <Text style={{fontSize: 20, paddingLeft: 20, paddingBottom: 5}}>
          description
        </Text>
        <Input
          multiline
          numberOfLines={5}
          label=""
          placeholder=""
          onChangeText={(word) => this.setState({description: word})}
          value={this.state.description}
          style={styles.inputWide}
          conStyle={{
            padding: 0,
            paddingRight: 20,
            margin: 0,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}
          labStyle={{padding: 0, margin: 0, flex: 0}}
        />
      </View>
    );
  }

  renderPostButton() {
    return (
      <TouchableOpacity onPress={this.sendData.bind(this)}>
        <View
          style={{
            color: '#fff',
            height: '80%',
            width: 100,
            backgroundColor: '#f23567',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
          }}>
          <Text style={{fontSize: 30, color: '#fff'}}>Post</Text>
        </View>
      </TouchableOpacity>
    );
  }
  async sendData() {
    // this.props.navigation.navigate('Home');
    console.log('HELLOOOO', this.state.selectedImage);
    var storageRef = firebase.storage().ref();
    console.log(storageRef, this.state.selectedImage);
    var imageRef = storageRef.child(this.state.selectedImage);
    console.log('imageRef: ', imageRef);
    var imageBlob = await fetch(this.state.selectedImage).then((r) => r.blob());
    console.log(imageBlob);
    const downloadURL = await imageRef.put(imageBlob).then(function (snapshot) {
      console.log('UPLOADED');
      return snapshot.ref.getDownloadURL();
    });
    const data = {
      title: this.state.titleText,
      description: this.state.description,
      image: downloadURL,
      user: firebase.auth().currentUser.email,
      product: this.state.product,
    };
    this.setState({
      showPhotoGallery: false,
      selectedImage: null,
      showProducts: false,
      product: null,
      titleText: '',
      description: '',
      showSuccess: true,
    });
    setTimeout(
      (() => {
        this.setState({
          showSuccess: false,
        });
      }).bind(this),
      3000,
    );

    var db = firebase.firestore();
    db.collection('posts').add(data);
  }
  render() {
    if (this.state.showPhotoGallery) {
      return (
        <ViewPictures
          fire={this.state.firebase}
          selectImage={(image) => {
            this.setState({selectedImage: image});
          }}
          showFunc={() => {
            this.setState({showPhotoGallery: false});
          }}
          pictureArray={this.state.pictureArray}
        />
      );
    } else if (this.state.showProducts) {
      return (
        <ProductChoose
          showFunc={() => this.setState({showProducts: false})}
          setProduct={(album) => {
            this.setState({product: album});
          }}
        />
      );
    }
    return (
      <View style={{flex: 1}}>
        {this.renderXBar()}
        {this.renderSuccessBar()}
        <View style={{flex: 1}} />
        <View style={styles.container}>{this.renderSelectedImage()}</View>
        <ScrollView
          //keyboardShouldPersistTaps="handled"
          style={styles.container2}>
          {this.renderTitleInput()}
        </ScrollView>
        <ScrollView style={styles.container3}>
          {this.renderDescriptionInput()}
        </ScrollView>
        <View style={styles.container4}>{this.renderSelectedProduct()}</View>
        <View style={styles.container5}>{this.renderPostButton()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    paddingLeft: 20,
  },
  container2: {
    flex: 1,
    //justifyContent: 'flex-start',
    //alignItems: 'flex-start',
    marginTop: 5,
    marginLeft: 5,
  },
  container3: {
    flex: 2,
    //justifyContent: 'flex-start',
    marginLeft: 5,
    marginBottom: 5,
  },
  container4: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 25,
    marginRight: 20,
    resizeMode: 'contain',
  },
  container5: {
    flex: 1,
    alignItems: 'center',
    marginTop: 5,
  },
  input: {
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginLeft: 0,
    padding: 0,
  },
  inputWide: {
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
});

export default CamScreen;
