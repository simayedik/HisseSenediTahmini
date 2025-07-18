import React, { useEffect, useState } from 'react';
import { processColor, Text, View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-charts-wrapper';
import DropDownPicker from '../DropDownPicker';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function LineCard({ data = [] }) {
  const [selectedPeriyodLine, setSelectedPeriyodLine] = useState('30');

  const periyodLine = [
    { label: '7 Gün', value: '7' },
    { label: '30 Gün', value: '30' },
    { label: '90 Gün', value: '90' },
  ];
  const formatToTurkishDayMonth = dateStr => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
  };
  const filteredData = data.slice(-Number(selectedPeriyodLine));
  const yValues = filteredData.map((item, index) => ({
    x: index,
    y: item.price,
  }));

  const xAxis = {
    valueFormatter: filteredData.map(item =>
      formatToTurkishDayMonth(item.Date),
    ),
    position: 'BOTTOM',
    granularityEnabled: true,
    granularity: 1,
    drawGridLines: true,
    gridLineWidth: 0.5,
    gridColor: processColor('#e0e0e0'),
    textSize: selectedPeriyodLine =='90' ? 8 : 10
  };

  const yAxis = {
    left: {
      enabled: true,
      drawGridLines: true,
      gridLineWidth: 0.5,
      gridColor: processColor('#e0e0e0'),
      granularityEnabled: true,
      granularity: 0.001,
    },
    right: {
      enabled: false,
    },
  };
  const chartDescription = {
    text: '',
  };

  const legend = {
    enabled: false,
  };

  const marker = {
    enabled: true,
    markerColor: processColor('#2c3e50'),
    textColor: processColor('white'),
    markerFontSize: 14,
    valueFormatter: '##0.000', // ← ondalık basamaklı gösterim
    digits: 3,
  };
  const rawData = Array.from(
    { length: 31 },
    (_, i) => 100 + i + Math.random() * 5,
  );

  const chartData = {
    dataSets: [
      {
        values: yValues,
        label: '30 Günlük Fiyat',
        config: {
          color: processColor('rgb(139, 140, 140)'),
          drawValues: false,
          valueFormatter: '##0.00', // ← 2 basamaklı format
          lineWidth: 2,
          drawCircles: true,
          circleRadius: 3,
          circleHoleColor: processColor('rgb(180, 144, 210)'),
          circleColor: processColor('rgb(122, 37, 191)'),
          drawCircleHole: true,
        },
      },
    ],
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffff',
        borderRadius: 10,
        padding: 10,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 10,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '600', marginVertical: 5 }}>
          Fiyat Geçmişi
        </Text>
        <View style={{ width: 120 }}>
          <DropDownPicker
            items={periyodLine}
            value={selectedPeriyodLine}
            onChangeValue={setSelectedPeriyodLine}
            placeholder={'Hisse Seçiniz'}
          />
        </View>
      </View>
      {data && data.length > 0 ? (
        <LineChart
          style={{ height: screenHeight * 0.25 }}
          data={chartData}
          xAxis={xAxis}
          yAxis={yAxis}
          chartDescription={chartDescription}
          legend={legend}
          marker={marker}
          drawGridBackground={false}
          borderColor={processColor('teal')}
          borderWidth={0.2}
          drawBorders={true}
          touchEnabled={true}
          dragEnabled={true}
          scaleEnabled={true}
          scaleXEnabled={true}
          scaleYEnabled={false}
          pinchZoom={true}
          doubleTapToZoomEnabled={true}
        />
      ) : (
        <View
          style={{
            height: screenHeight * 0.25,
            borderWidth: 0.5,
            marginVertical: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text>Veri Yok</Text>
        </View>
      )}
    </View>
  );
}
