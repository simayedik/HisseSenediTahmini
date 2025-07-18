import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { View } from 'react-native';

export default function CustomDropDown({
  items = [],
  value,
  onChangeValue,
  placeholder,
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{}}>
      <DropDownPicker
        style={{
           
            borderWidth:open ? 2 : 1,
            borderColor:open?'rgb(125, 51, 148)':'gray',
        }}
        dropDownContainerStyle={{
          borderColor:'gray',
        }}
        listParentLabelStyle={{
         fontWeight:'400',
         marginLeft:10
        }}
        selectedItemLabelStyle={{
            color:'white'
        }}
        listItemContainerStyle={{
        //   borderBottomWidth: 0.2,
        }}
        selectedItemContainerStyle={{
            backgroundColor: 'rgb(158, 155, 155)'
        }}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={onChangeValue}
        setItems={() => {}} // Gerekli, yoksa hata verir
        placeholder={placeholder}
      />
    </View>
  );
}
