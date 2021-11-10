import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';

const RemoveFromGroupFunction = ({path, splits, user, setHook}) => {
	const [fireData, updateFirebase] = useState(splits);

	useEffect(()=> {
		setHook(()=> {
			updateFirebase({splits: {...splits, [user.uid]: .04}});
		})
	}, []);
	
	return <>
		<FirebaseUpdater path = {path} data={fireData} />
	</>;
}

const RemoveFromGroupComponent = (props) => {
	const {path, splits, user} = props;
	const [hookFunction, setHookFunction] = useState(()=>{});

	return <>
		<RemoveFromGroupFunction ...props setHook={setHookFunction} />
		<Button title="Asdfadfa" onPress={hookFunction} />
	</>;

}

export default RemoveFromGroup;