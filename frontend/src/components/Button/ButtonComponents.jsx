import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function ButtonComponents({onPress}) {
  return (
    <TouchableOpacity
   style={{
          backgroundColor: 'rgb(111, 108, 207)',
          padding:8,
          borderRadius:10,
          marginVertical:12
        }}
    onPress={onPress}>
         <Text style={{color:'white',textAlign:'center'}}>Tahmin Et</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({})