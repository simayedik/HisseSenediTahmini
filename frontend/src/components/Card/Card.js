import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';

export default function Card({
  label,
  price = '₺---.--',
  change ,
  changeColor = 'rgb(25, 163, 20)',
  lastUpdate  ,
  icon = require('../../data/coin.png'),
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderWidth: 0.2,
        borderColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 8,
      }}
    >
      <View>
        <Text style={{ color: 'rgb(112, 112, 112)' }}>{label}</Text>
        <View style={{marginHorizontal:8 }}>
           <Text style={{ fontWeight: '900', fontSize: 18 ,marginVertical:2}}>{price}</Text>
        {change &&
         (<Text style={{ color: changeColor }}>{change}</Text>)
         }
        {lastUpdate &&
        (
          <Text style={{ fontSize: 11, color: 'rgb(112, 112, 112)' }}>
            Son güncelleme: {lastUpdate}
          </Text>
        )}
        </View>
      </View>
      <Image style={{ width: 25, height: 25, margin: 10 }} source={icon} />
    </View>
  );
}
