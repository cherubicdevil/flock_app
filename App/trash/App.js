import React, {Component, useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
//import firebase from 'firebase'
import AnimatedSplash from 'react-native-animated-splash-screen';
import {firebase} from 'App/firebase/config';
import reducers from 'App/redux/reducers';
import AppNavigator from 'App/navigators/AppNavigator';
import AuthNavigator from 'App/navigators/AuthNavigator';
import {constants} from 'App/constants';

class App extends Component {
  state = {loggedIn: null};
  collectUrls() {
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
          //console.log(entity.image)
          counter += 1;
          ar.push(entity.image);
          if (counter == n) {
            this.preloadImages(ar);
          }
        });
      });
  }
  preloadImages(urlOfImages) {
    // an array of urls of images
    let preFetchTasks = [];
    urlOfImages.forEach((url) => {
      preFetchTasks.push(Image.prefetch(url));
    });

    Promise.all(preFetchTasks).then((results) => {
      try {
        let downloadedAll = true;
        results.forEach((result) => {
          if (!result) {
            //error occurred downloading a pic
            downloadedAll = false;
          }
        });
      } catch (e) {}
    });
  }

  componentDidMount() {
    fetch(constants.HEROKU + 'setup');
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({loggedIn: true});
      } else {
        this.setState({loggedIn: false});
      }
    });
  }

  renderContent() {
    switch (this.state.loggedIn) {
      case true:
        return <AppNavigator />;
      case false:
        return (
          <Provider store={createStore(reducers)}>
            <View style={{flex: 1}}>
              <AuthNavigator />
            </View>
          </Provider>
        );
      default:
        return <View style={{height: '70%', justifyContent: 'center'}}></View>;
    }
  }

  render() {
    return (
      <AnimatedSplash
        translucent={true}
        isLoaded={this.state.isLoaded}
        logoImage={require('App/Assets/Images/flockicon3.png')}
        backgroundColor={'#262626'}
        logoHeight={150}
        logoWidth={150}>
        <View style={{flex: 1}}>{this.renderContent()}</View>
      </AnimatedSplash>
    );
  }
}

export default App;
