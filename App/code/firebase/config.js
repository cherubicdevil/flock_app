import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

// import {firebaseConfig} from 'App/debug_consts';

const firebaseConfig = {
    appId: 'flock-46ffc',
    apiKey: 'AIzaSyD3celqNOwXBr_5MArkv4ccgSeYJsDEqFo',
    // authDomain: 'flock-46ffc.firebaseapp.com',
    authDomain: 'shopwithflock.com',
    databaseURL: 'https://flock-46ffc.firebaseio.com',
    projectId: 'flock-46ffc',
    storageBucket: 'flock-46ffc.appspot.com',
    messagingSenderId: '510453859520',
  };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firestore();
const au = auth();

export {firebase, db, au};
