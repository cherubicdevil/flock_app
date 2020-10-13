import React from 'react';
import {View, Text} from 'react-native';
import NavButton from './NavButton';
import {constants} from 'App/constants';

const navOptions = {
	Home: {
		name: 'Home',
		vidVisible: true,
		icon: require('App/Assets/Images/Play.png'),
		coloredIcon: require('App/Assets/Images/colored-play.png'),
		index: 0,
		text: 'watch',
	},

	Video: {
		name: 'VideoMasonry',
		vidVisible: false,
		icon: require('App/Assets/Images/Happy_Shopping_Icon.png'),
		coloredIcon: require('App/Assets/Images/colored_happy_shopping.png'),
		index: 1,
		text: 'discover',
	},

	CamScreen: {
		name: 'CamScreen',
		vidVisible: false,
		icon: require('App/Assets/Images/Add_Icon.png'),
		coloredIcon: require('App/Assets/Images/colored-add-icon.png'),
		index: 2,
		text: 'post',
	},

	Products: {
		name: 'Products',
		vidVisible: false,
		icon: require('App/Assets/Images/Search_Discount_Icon.png'),
		coloredIcon: require('App/Assets/Images/colored_search_discount.png'),
		index: 3,
		text: 'coupons',
	},

	Egg: {
		name: 'Egg',
		vidVisible: false,
		icon: require('App/Assets/Images/egg-outline.png'),
		coloredIcon: require('App/Assets/Images/colored-egg-outline.png'),
		index: 4,
		text: 'save',
	},
};

const NavBar = ({style, route, navigation}) => {
	const routeName = route.name; // navigation.state.routeName
	const {navigate} = navigation;

	const renderNavButton = (navItem) => {
		if (routeName === navItem.name) {
			return (
				<NavButton
					navFunc={() =>
						navigate(navItem.name, {vidVisible: navItem.vidVisible})
					}
					icon={navItem.coloredIcon}
				/>
			);
		} else {
			return (
				<NavButton
					navFunc={() =>
						navigate(navItem.name, {vidVisible: navItem.vidVisible})
					}
					icon={navItem.icon}
				/>
			);
		}
	};
	return (
		<View style={[styles.navStyle, style]}>
			{renderNavButton(navOptions.Home)}
			{renderNavButton(navOptions.Video)}
			{renderNavButton(navOptions.CamScreen)}
			{renderNavButton(navOptions.Products)}
			{renderNavButton(navOptions.Egg)}
		</View>
	);
};

const styles = {
	navStyle: {
		paddingTop: 15,
		backgroundColor: '#ff9933',
		width: '100%',
		height: constants.NAVBARHEIGHT,
		flexDirection: 'row',
		position: 'absolute',
		bottom: 0,
		zIndex: 20,
		paddingBottom: 30,
		zIndex: 50,
	},
};
export default NavBar;
