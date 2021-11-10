import React, {useEffect} from 'react';
import {TouchableOpacity} from 'react-native';

const AddToGroupFunction = ({path, splits, user, setHook}) => {

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


const AddToGroupComponent = (props) => {
	// {path, splits, user}
	const [action, setAction] = useState(()=> {});

	return <>
		<View>
			<Button title="asfasd" onPress={action} />
		</View>
		<AddToGroupFunction ...props setHook={setAction} />
	</>;
}

export {AddToGroupComponent, AddToGroupFunction};