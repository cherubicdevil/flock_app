// import * as firebase from 'firebase';
// import '@firebase/auth';
import auth from '@react-native-firebase/auth';
// import '@firebase/firestore';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import {firebaseConfig} from 'App/debug_consts';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// firebase.initializeApp(firebaseConfig, {name: 'Flock'});

const db = firestore();
const au = auth();

export {firebase, db, au};
