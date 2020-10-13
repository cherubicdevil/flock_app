import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import CreditCard from 'App/components/CreditCard';
import {Header} from 'App/components/common';
import {firebase} from 'App/firebase/config';

const PaymentInfo = (props) => {
	var {title, price, useFlockPrice, flockPrice} = props.route.params;
	price = Number(price);
	const [discountState, setDiscount] = useState(0);
	const [discountText, setDiscountText] = useState('Find Coupon');
	const [lookForDiscount, setLookForDiscount] = useState(true);
	var shipping = Math.round((10 + 0.06 * price) * 100) / 100;
	var discount = 1.02;
	const flockitDiscount =
		Math.round((Number(flockPrice) / 100) * 100 * price) / 100;
	let finalPrice = (
		Math.round((price + shipping - discountState - flockitDiscount) * 100) / 100
	).toFixed(2);

	const renderFlockitDisclaimer = () => {
		//console.log(props.navigation.state.params);
		return (
			<View
				style={{
					borderRadius: 5,
					padding: 15,
					margin: 20,
					marginTop: 10,
					marginBottom: 5,
					backgroundColor: '#9c9',
				}}>
				<Text>
					Since you chose the Flock It price, clicking confirm below will not
					charge your credit card immediately.
				</Text>
			</View>
		);
	};
	const renderDiscount = () => {
		console.log(lookForDiscount, discountState);
		if (lookForDiscount) {
			console.log('HELLLOOOO BUTTON');
			return (
				<TouchableOpacity
					onPress={() => {
						let dtext = 'Looking';
						const myVar = setInterval(() => {
							setDiscountText(dtext + '.');
							dtext += '.';
						}, 500);
						setTimeout(() => {
							setLookForDiscount(false);
							setDiscount(0);
							clearInterval(myVar);
						}, 3000);
					}}
					style={{
						backgroundColor: '#aea',
						width: 150,
						paddingTop: 3,
						borderRadius: 3,
						borderWidth: 3,
						borderColor: '#9c9',
					}}>
					<Text style={styles.textStyle}>{discountText}</Text>
				</TouchableOpacity>
			);
		} else {
			return (
				<Text style={[styles.textStyle, {color: '#393'}]}>
					-${discountState}
				</Text>
			);
		}
	};

	renderFlockDiscount = () => {
		return (
			<View style={styles.textContainer}>
				<Text style={styles.textFirstStyle}>
					Flock It Discount: {flockPrice}%
				</Text>
				<Text style={[styles.textStyle, {color: '#393'}]}>
					-${flockitDiscount.toFixed(2)}
				</Text>
			</View>
		);
	};

	renderFlockPrice = () => {
		return (
			<View style={styles.textContainer}>
				<Text style={styles.textFirstStyle}>Flock Price: </Text>
				<Text style={styles.textStyle}>
					$
					{(
						Math.round((price - discountState - flockitDiscount) * 100) / 100
					).toFixed(2)}
				</Text>
			</View>
		);
	};

	renderShipping = () => {
		return (
			<View style={styles.textContainer}>
				<Text style={styles.textFirstStyle}>Shipping and Taxes: </Text>
				<Text style={styles.textStyle}>${shipping}</Text>
			</View>
		);
	};

	renderFinalPrice = () => {
		return (
			<View style={styles.textContainer}>
				<Text style={styles.textFirstStyle}>
					Price after Shipping and Taxes:{' '}
				</Text>
				<Text style={styles.textStyle}>
					$
					{(
						Math.round(
							(price + shipping - discountState - flockitDiscount) * 100,
						) / 100
					).toFixed(2)}
				</Text>
			</View>
		);
	};
	return (
		<View>
			<Header
				viewStyle={{backgroundColor: '#333'}}
				textStyle={{color: '#333'}}
				headerText="Your Purchase"
			/>
			<View style={styles.numbercontainer}>
				<View style={styles.textContainer}>
					<Text style={styles.textFirstStyle}>Original Price: </Text>
					<Text style={styles.textStyle}>${price}</Text>
				</View>
				{renderFlockDiscount()}
				{/*<View style={styles.textContainer}>
					<Text style={styles.textFirstStyle}>Coupon Finder: </Text>
					{renderDiscount()}
				</View>*/}
				{renderFlockPrice()}
				{renderShipping()}
				{renderFinalPrice()}
			</View>
			{renderFlockitDisclaimer()}
			<CreditCard
				brand={props.route.params.token.card.brand}
				last4={props.route.params.token.card.last4}
				expMonth={props.route.params.token.card.expMonth}
				expYear={props.route.params.token.card.expYear}
			/>
			<TouchableOpacity
				style={styles.submitStyle}
				onPress={() => {
					//console.log(props.navigation.actions);
					const data = {
						token: props.route.params.token,
						user: firebase.auth().currentUser.uid,
						date: new Date(),
						useFlockPrice: useFlockPrice,
						flockPrice: flockPrice,
						processed: false,
					};
					var db = firebase.firestore();

					db.collection('purchaseOrders').add(data);

					if (true) {
						const token = props.route.params.token.tokenId;
						const endpoint = `https://protected-thicket-47492.herokuapp.com/?price=${
							finalPrice * 100
						}&token=${token}`;
						fetch(endpoint);
					} else {
					}
					props.navigation.navigate('Success');
				}}>
				<Text style={{color: '#fff', fontSize: 18, textAlign: 'center'}}>
					Confirm
				</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	textContainer: {
		flexDirection: 'row',
		height: 30,
		justifyContent: 'space-between',
	},

	numbercontainer: {
		paddingLeft: 20,
		paddingTop: 20,
		alignItems: 'flex-end',
	},
	textFirstStyle: {
		height: 30,
		flex: 6,
		paddingRight: 20,
		paddingBottom: 10,
		alignItems: 'flex-end',
	},
	textStyle: {
		flex: 2,
		height: 30,
		paddingRight: 20,
		paddingBottom: 10,
		alignItems: 'flex-end',
		textAlign: 'right',
	},
	submitStyle: {
		alignSelf: 'center',
		marginTop: 30,
		width: 100,
		height: 50,
		backgroundColor: '#7ab',
		color: '#fff',
		borderRadius: 5,
		borderWidth: 1,
		justifyContent: 'center',
		borderColor: '#777',
	},
});

export default PaymentInfo;
