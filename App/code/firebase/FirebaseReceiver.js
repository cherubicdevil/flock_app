
import React, {useEffect} from 'react';
import {firebase, db} from './config';

const getData = (path, data) => {
	const {collection, doc} = path;
	db.collection(collection).doc(doc).update(data);
}

const FirebaseReceiver = ({path, data, setData, setHook=(x)=>{}}) => {
	useEffect(()=>{
		setHook(()=>{
			getData(path, data);
		});
	}, [])
 
	useEffect(()=> {
		getData(path, data);
	}, [data]);
}

export default FirebaseReceiver;