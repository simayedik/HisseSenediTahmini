import React from 'react';
import { View, FlatList, Text } from 'react-native';

export default function TableCard({ tableData }) {
  const tableData1 = [
    {
      tarih: '05 Temmuz',
      tahmin: '64.20',
      gerceklesen: '63.85',
      fark: '0.35',
      dogruluk: '%99',
    },
    {
      tarih: '04 Temmuz',
      tahmin: '63.10',
      gerceklesen: '63.50',
      fark: '0.40',
      dogruluk: '%98',
    },
    {
      tarih: '03 Temmuz',
      tahmin: '62.75',
      gerceklesen: '62.80',
      fark: '0.05',
      dogruluk: '%99',
    },
  ];

  return (
    <View
      style={{
        backgroundColor: '#ffff',
        borderRadius: 10,
        marginVertical: 10,
        padding: 10,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: '600', marginVertical: 8 }}>
        Geçmiş Tahminler
      </Text>

      <FlatList
        data={tableData.reverse()}
        nestedScrollEnabled={true}
        ListEmptyComponent={
          <View style={{padding:50}}>
            <Text style={{ textAlign: 'center', color: 'gray' }}>
              Veri henüz yüklenmedi veya bulunamadı.
            </Text>
          </View>
        }
        ListHeaderComponent={
          <View
            style={{
              marginVertical: 8,
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingVertical: 10,
              backgroundColor: 'rgb(240, 240, 240)',
              borderRadius: 4,
              borderBottomWidth: 0.2,
              borderColor: 'gray',
            }}
          >
            <Text style={{ flex: 1, textAlign: 'center' }}>Tarih</Text>
            <Text style={{ flex: 1, textAlign: 'center' }}>Tahmin</Text>
            <Text style={{ flex: 1.1, textAlign: 'center' }}>Gerçekleşen</Text>
            <Text style={{ flex: 1, textAlign: 'center' }}>Fark</Text>
            <Text style={{ flex: 1, textAlign: 'center' }}>Doğruluk</Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const isLast = index === tableData.length - 1;
          return (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                paddingVertical: 12,
                borderBottomWidth: isLast ? 0 : 0.2,
                borderColor: 'gray',
              }}
            >
              <Text style={{ flex: 1, textAlign: 'center' }}>{item.tarih}</Text>
              <Text style={{ flex: 1, textAlign: 'center' }}>
                {item.tahmin}
              </Text>
              <Text style={{ flex: 1, textAlign: 'center' }}>
                {item.gerceklesen}
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: 'center',
                  color: `${item.color}`,
                }}
              >
                {item.fark}
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: 'center',
                  borderRadius: 20,
                  backgroundColor: 'rgba(38, 117, 28, 0.26)',
                }}
              >
                {item.dogruluk}
              </Text>
            </View>
          );
        }}
        keyExtractor={(item, index) => `${item.tarih}-${index}`}
      />
    </View>
  );
}
