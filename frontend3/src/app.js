import {
  Dimensions,
  FlatList,
  Image,
  processColor,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { use, useEffect, useState } from 'react';
import DropDownPicker from './components/DropDownPicker';
import ButtonComponent from './components/Button';
import Card from './components/Card';
import LineCard from './components/LineCard';
// import { LineChart } from 'react-native-chart-kit';
import { LineChart } from 'react-native-charts-wrapper';
import TableCard from './components/TableCard';
const screenWidth = Dimensions.get('window').width;

export default function App() {
  const [allData, setAllData] = useState([]);
  const [selectedStock, setSelectedStock] = useState('SISE.IS');
  const [selectedPeriyod, setSelectedPeriyod] = useState('1');

  // Card Component değişkenleri
  const [price, setPrice] = useState('₺---.--');
  const [targetPrice, setTargetPrice] = useState('₺---.--');
  const [change, setChange] = useState('₺---.--↑');
  const [targetChange, setTargetChange] = useState('---.--');
  const [lastUpdate, setLastUpdate] = useState('--:--');
  const [recommendation, setRecommendation] = useState('----');
  const [changeColor, setChangeColor] = useState('');
  const [targatChangeColor, setTargetChangeColor] = useState('');

  const [tableData, setTableData] = useState([]);

  const stockList = [
    { label: 'Şise Cam', value: 'SISE.IS' },
    { label: 'Garanti Bankası', value: 'GARAN.IS' },
  ];
  const periyod = [
    { label: '1 Gün', value: '1' },
    { label: '3 Gün', value: '3' },
    { label: '1 Hafta', value: '7' },
  ];

  useEffect(() => {
    if (allData && Object.keys(allData).length > 0) {
      cardFunc();
    }
  }, [allData]);

  async function tahminEt() {
    console.log(selectedStock);

    const response = await fetch('http://10.0.2.2:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ticker: selectedStock }),
    });
    const data = await response.json();
    setAllData(data);
  }

  function cardFunc() {
    try {
      if (!allData.data || !allData.predictions) return;

      const parsedData = JSON.parse(allData.data);
      const predictions = allData.predictions;

      let now = new Date();
      console.log(now);
      let hours = now.getHours().toString().padStart(2, '0');
      let minutes = now.getMinutes().toString().padStart(2, '0');

      setLastUpdate(`${hours}:${minutes}`);

      const sLastItem = parsedData[parsedData.length - 2];
      const lastItem = parsedData[parsedData.length - 1];

      if (lastItem && sLastItem && lastItem.price && sLastItem.price) {
        const lastPrice = lastItem.price;
        const prevPrice = sLastItem.price;
        const percentChange = ((lastPrice - prevPrice) / prevPrice) * 100;
        const formattedChange = `₺${percentChange.toFixed(2)}${
          percentChange >= 0 ? '↑' : '↓'
        }`;
        // 'rgb(25, 163, 20)'
        let color;
        if (percentChange < 0) {
          color = 'rgb(157, 53, 4)';
        } else {
          color = 'rgb(6, 157, 4)';
        }
        setChangeColor(color);
        setPrice(`₺${lastPrice.toFixed(2)}`);
        setChange(formattedChange);
      }

      // Tahmin ve öneri hesaplama
      const targetItem = predictions[predictions.length - 1].elastic_pred;
      const lastPrice = parsedData[parsedData.length - 1].price;
      const percentChangeTarget = ((lastPrice - targetItem) / targetItem) * 100;
      const formattedTargetChange = `₺${percentChangeTarget.toFixed(2)}${
        percentChangeTarget >= 0 ? '↑' : '↓'
      }`;

      setTargetPrice(`₺${targetItem.toFixed(4)}`);
      setTargetChange(formattedTargetChange);
      let color;
      if (percentChangeTarget < 0) {
        color = 'rgb(157, 53, 4)';
      } else {
        color = 'rgb(6, 157, 4)';
      }
      setTargetChangeColor(color);

      if (percentChangeTarget > 5) {
        setRecommendation('Al');
      } else if (percentChangeTarget < 0) {
        setRecommendation('Sat');
      } else {
        setRecommendation('Tut');
      }

      const last3Data = parsedData.slice(-3);
      const last3Predictions = predictions.slice(-3);

      const table = last3Data.map((item, index) => {
        const tarih = new Date(item.Date).toLocaleDateString('tr-TR', {
          day: '2-digit',
          month: 'long',
        });
        const gerceklesen = item.price;
        const tahmin = last3Predictions[index]?.elastic_pred ?? 0;
        const fark = gerceklesen - tahmin;
        const dogruluk = 100 - Math.abs(fark / gerceklesen) * 100;

        return {
          tarih,
          tahmin: tahmin.toFixed(2),
          gerceklesen: gerceklesen.toFixed(2),
          fark: `${fark > 0 ? '+' : ''}${fark.toFixed(2)}`,
          dogruluk: `%${dogruluk.toFixed(2)}`,
          color: `${fark > 0 ? 'rgb(6, 157, 4)' : 'rgb(157, 53, 4)'}`,
        };
      });

      setTableData(table);
    } catch (error) {
      console.error('cardFunc hatası:', error);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: 'rgb(240, 240, 240)' }}
      // contentContainerStyle={{ paddingBottom: 50 }} // alttan boşluk
    >
      <View
        style={{
          backgroundColor: 'rgb(111, 108, 207)',
          paddingVertical: 60,
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            color: 'rgb(240, 240, 240)',
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          Al Hisse Tahmini
        </Text>
        <Text style={{ color: 'rgba(240, 240, 240, 0.62)' }}>
          Yapay zeka destekli hisse kapanış fiyatı tahmin sistemi
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 10,
          backgroundColor: 'rgb(240, 240, 240)',
        }}
      >
        <View
          style={{
            backgroundColor: '#ffff',
            borderWidth: 0.2,
            borderColor: '#ffff',
            borderRadius: 10,
            padding: 15,
            marginVertical: 8,
            marginTop: -10,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: '600', marginVertical: 5 }}>
            Hisse Seçimi
          </Text>
          <View style={{ zIndex: 2 }}>
            <Text style={{ marginVertical: 5 }}>Hisse Kodu</Text>
            <DropDownPicker
              items={stockList}
              value={selectedStock}
              onChangeValue={setSelectedStock}
              placeholder={'Hisse Seçiniz'}
            />
          </View>
          <View style={{ zIndex: 1 }}>
            <Text style={{ marginVertical: 5 }}>Tahmin Periyodu</Text>
            <DropDownPicker
              items={periyod}
              value={selectedPeriyod}
              onChangeValue={setSelectedPeriyod}
              placeholder={'Hisse Seçiniz'}
            />
          </View>
          <ButtonComponent onPress={tahminEt} />
        </View>
        <Card
          label={'Güncel Fiyat'}
          price={price}
          change={change}
          lastUpdate={lastUpdate}
          changeColor={changeColor}
        />
        <Card
          label={'1 Gün Tahmini'}
          price={targetPrice}
          change={targetChange}
          icon={require('./data/robot.png')}
          changeColor={targatChangeColor}
        />
        <Card
          label={'Al Önerisi'}
          price={recommendation}
          icon={require('./data/light.png')}
        />
        <LineCard data={allData?.data ? JSON.parse(allData.data) : []} />
        <TableCard tableData={tableData} />
      
      </View>
      <View
        style={{
          backgroundColor: 'rgb(31 41 55)',
          paddingVertical: 60,
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            color: 'rgb(240, 240, 240)',
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          Al Hisse Tahmini
        </Text>
        <Text style={{ color: 'rgba(240, 240, 240, 0.62)' }}>
          Yapay zeka destekli hisse senedi fiyat tahmin platformu
        </Text>
        <Text  style={{
            color: 'rgb(240, 240, 240)',
            fontSize: 16,
            fontWeight: 'bold',
            marginTop:20
          }}>İletişim</Text>
          <View style={{flexDirection:'row', marginVertical:10,marginLeft:5}}>
             <Image
          style={{width:20,height:20}}
          source={require('./data/email.png')}/>
         <Text style={{ color: 'rgba(240, 240, 240, 0.62)',marginHorizontal:10}}>ediksimay@gmail.com</Text>
     
          </View>
          </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
