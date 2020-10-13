import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import ProductStyles from './ProductStyle';
import ModalSelector from 'react-native-modal-selector';

const styles = StyleSheet.create({...ProductStyles});
let index = 0;

const data = [
	{
		key: index++,
		section: true,
		label:
			'HOW IT WORKS \n\n You choose the desired discount amount. We present your request to the retailer along with requests of other FLOCKERS when the countdown ends. \n\n If the retailer accepts the request, we’ll charge your credit card and submit the order. Your credit card will NOT be charged unless we can get this for you.',
	},
	{key: index++, label: '-10%'},
	{key: index++, label: '-20%'},
	{key: index++, label: '-30%'},
	{key: index++, label: '-40%'},
];

const Flockit = () => {
	const [showOptions, setShowOptions] = useState(false);

	return (
		<View style={{flex: 1, height: '100%', zIndex: 10}}>
			<ModalSelector
				data={data}
				initValue="FLOCK IT"
				initValueTextStyle={{
					height: '100%',
					fontSize: 24,
					paddingTop: 7,
					color: '#fff',
				}}
				selectTextStyle={{
					height: '100%',
					fontSize: 24,
					paddingTop: 7,
					color: '#fff',
				}}
				onChange={(option) => {}}
			/>
		</View>
	);
	// const renderButton = () => {
	// 	if (!showOptions) {
	// 		return (
	// 			<Accordion
	// 				activeSections={[0]}
	// 				sections={['Section 1']}
	// 				renderSectionTitle={() => {
	// 					<Text>Hello</Text>;
	// 				}}
	// 				renderHeader={() => {
	// 					<Text>Hello</Text>;
	// 				}}
	// 				renderContent={() => {
	// 					<Text>COntent</Text>;
	// 				}}
	// 			/>
	// 		);
	// 	} else {
	// 		return (
	// 			<TouchableOpacity style={styles.buttonFooter}>
	// 				<Text style={styles.textFooter}>FLOCK IT</Text>
	// 			</TouchableOpacity>
	// 		);
	// 	}
	// };
	// return <View style={{flex: 1}}>{renderButton()}</View>;
};

export default Flockit;
