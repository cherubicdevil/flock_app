import React, {useEffect} from 'react';
import {db} from 'App/firebase/config';

const FirebaseListener = ({path, setData}) => {

    useEffect(()=> {
        const unsub = db.collection(path.collection).doc(path.doc).onSnapshot(docSnapshot => {
          setData(docSnapshot.data());
        }, err => {
          console.log(`Encountered error: ${err}`);
        });

        return ()=>{
          unsub();
        }
    }, []);
};

export default FirebaseListener;