import React from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'

const SideScroll = () => {
	const cats = ['For you', 'Shoes', 'Clothes', 'Baby', 'Cat2', 'Cat3', 'Cat4']
	return (
		<FlatList
			keyExtractor={(item) => item}
			showsHorizontalScrollIndicator={false}
			data={cats}
			horizontal
			style={{}}
			renderItem={({ item }) => {
				return <Text style={{ paddingLeft: 20 }}>{item}</Text>
			}}
		/>
	)
}

const styles = StyleSheet.create({})

export default SideScroll
