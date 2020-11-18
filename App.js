import React from 'react';
import {View, Alert} from 'react-native';
import AnimatedSplash from 'react-native-animated-splash-screen';
import {firebase} from 'App/firebase/config';
import {Provider} from 'react-redux';
import {createStore} from 'redux';

import AppNavigator from 'App/navigators/AppNavigator';
import AuthNavigator from 'App/navigators/AuthNavigator';
import reducers from 'App/redux/reducers';

class App extends React.Component {
  state = {
    isLoaded: false,
    loggedIn: null,
  };

  componentDidMount() {
    //firebase.firestore().collection('post').get();
    this.setState({isLoaded: true});
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
        return (
          <Provider store={createStore(reducers)}>
            <AppNavigator />
          </Provider>
        );
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
