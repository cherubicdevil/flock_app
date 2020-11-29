import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD3celqNOwXBr_5MArkv4ccgSeYJsDEqFo',
  authDomain: 'flock-46ffc.firebaseapp.com',
  databaseURL: 'https://flock-46ffc.firebaseio.com',
  projectId: 'flock-46ffc',
  storageBucket: 'flock-46ffc.appspot.com',
  messagingSenderId: '510453859520',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

export {firebase, db};
