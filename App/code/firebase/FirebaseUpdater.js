import {firebase, db} from './config';
import React, {useEffect} from 'react';

const functions = {
	"INCREMENT": firebase.firestore.FieldValue.increment,
}

const updateData = (path, data) => {
	const {collection, doc} = path;
	for (const key in data) {
		const encoding = data[key];
		if (typeof(encoding) == "string" && encoding.startsWith("_")) {
			const [_, f, val] = encoding.split("_");
			data[key] = functions[f](val);
		}
	}
	db.collection(collection).doc(doc).update(data);
}

const FirebaseUpdater = ({path, data, setHook=(x)=>{}) => {

	useEffect(()=>{
		setHook(()=>{
			updateData(path, data);
		});
	}, [])

	useEffect(()=> {
		updateData(path, data);
	}, [data]);

	return <></>;
}

export default FirebaseUpdater;