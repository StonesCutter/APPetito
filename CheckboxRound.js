import * as React from 'react';
import { View, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';

 export const Radio = () => {
  const [checked, setChecked] = React.useState('first');

  return (
    <View style={{marginTop:20}}>

      <View style={{flexDirection: "row"}}>
      <RadioButton
        value="first"
        status={ checked === 'first' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('first')}
      />
      <Text style={{margin: 8,  color:"black"}}>Categoria 1</Text>
      </View>

      <View style={{flexDirection: "row"}}>
      <RadioButton
        value="first"
        status={ checked === 'second' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('second')}
      />
      <Text style={{margin: 8,  color:"black"}}>Categoria 2</Text>
      </View>

      <View style={{flexDirection: "row"}}>
      <RadioButton
        value="first"
        status={ checked === 'third' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('third')}
      />
      <Text style={{margin: 8,  color:"black"}}>Categoria 3</Text>
      </View>

      <View style={{flexDirection: "row"}}>
      <RadioButton
        value="first"
        status={ checked === 'fourth' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('fourth')}
      />
      <Text style={{margin: 8,  color:"black"}}>Categoria 4</Text>
      </View>

    </View>

    /*const styles = StyleSheet.create({
    label: {
      margin: 8,
      color:"white"
    },
    checkboxContainer: {
    flexDirection: "row"
    },
  })*/
  );
};
