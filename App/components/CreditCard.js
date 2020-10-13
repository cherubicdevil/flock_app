import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const cardPath = 'App/Assets/Images/';
const brands = {
	Visa: require('App/Assets/Images/visa_card.png'),
	Master: require('App/Assets/Images/master_card.png'),
	'American Express': require('App/Assets/Images/american_expr.png'),
	Discover: require('App/Assets/Images/discover_card.png'),
};
const CreditCard = ({brand, last4, expMonth, expYear}) => {
	return (
		<View style={styles.container}>
			<Image source={brands[brand]} style={styles.imageStyle} />
			<View style={styles.textContainer}>
				<Text>Ending in {last4}</Text>
				<Text>
					Expires {expMonth}/{expYear % 100}
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 40,
		marginLeft: 20,
		marginRight: 20,
		flexDirection: 'row',
		height: 100,

		paddingLeft: 20,
		paddingRight: 20,
		borderRadius: 5,
		borderColor: '#999',
		borderWidth: 1,
	},
	imageStyle: {
		width: 50,
		height: 30,
		flex: 1,
		alignSelf: 'center',
	},
	textContainer: {
		height: '100%',
		paddingLeft: 20,
		flex: 6,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});

export default CreditCard;
