/**
 * @format
 */

import React, {Component} from 'react';
import {AppRegistry, View} from 'react-native';
import App from './App';
//import App from './App.js';
import AnimatedSplash from 'react-native-animated-splash-screen';
import Share from './Share';
// import React from 'react';
// import {Text} from 'react-native';
import {name as appName} from './app.json';
import {LogBox} from 'react-native';


import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducers from 'App/redux/reducers';


LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

// const w = console.warn;
// const e = console.error;
// console.warn = () => { console.log('warning');}
// console.error = () => { console.log('error')}


// const App = () => {
// 	return <Text>Hello world</Text>;
// };

// class AppWithSplash extends Component {
// 	state = {isLoaded: false};
// 	componentDidLoad() {
// 		this.setState({isLoaded: true});
// 	}
// 	render() {
// 		return (
// <AnimatedSplash
// 	translucent={true}
// 	isLoaded={this.state.isLoaded}
// 	logoImage={require('./App/Assets/Images/flockicon3.png')}
// 	backgroundColor={'#262626'}
// 	logoHeight={150}
// 	logoWidth={150}>
// 				<View />
// 			</AnimatedSplash>
// 		);
// 	}
// }
AppRegistry.registerComponent(appName, () => App);
//AppRegistry.registerComponent('share', () => Share);
