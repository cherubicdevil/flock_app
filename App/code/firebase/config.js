import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
// import firebase from 'firebase/compat/app';
// import firestore from 'firebase/compat/firestore';
// import auth from 'firebase/compat/auth';
import {DEBUG} from 'App/constants';
// import {signInWithPhoneNumber} from 'firebase/auth';
// import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
// import { getAuth, connectAuthEmulator } from "firebase/auth";
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
  console.log("new app", firebase.apps)
  if (!DEBUG) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.initializeApp(firebaseConfig)
  }
} else {
  console.log("old app", firebase.apps)
  firebase.app();
}



// firebaseApps previously initialized using initializeApp()
const db = firebase.firestore();
db.settings({
  persistence: false,
 // same ip as in firebase.json
  host: 'localhost:8080',
  ssl: false,
}).then(() => {
  console.log('done setting');
});

const au = firebase.auth();
// au.useEmulator("http://localhost:9099");


export {firebase, db, au};
