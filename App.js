import React from 'react';
import {View, Alert} from 'react-native';
import AnimatedSplash from 'react-native-animated-splash-screen';

class App extends React.Component {
  state = {
    isLoaded: false,
  };

  componentDidMount() {
    this.setState({isLoaded: true});
  }

  render() {
    return (
      <AnimatedSplash
        translucent={true}
        isLoaded={this.state.isLoaded}
        logoImage={require('./App/Assets/Images/flockicon3.png')}
        backgroundColor={'#262626'}
        logoHeight={150}
        logoWidth={150}>
        <View />
      </AnimatedSplash>
    );
  }
}

export default App;
