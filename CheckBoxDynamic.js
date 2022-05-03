import * as React from 'react';
import { View, TextInput } from 'react-native';
import { CheckBox } from 'react-native-elements';
import {styles} from './Styles/style'
import * as firebase from 'firebase';
import 'firebase/firestore';

async function pushAddr(Addr) {
  const size = await getID();
  const newID = (size).toString();
  const docRef = firebase.firestore().collection('Restaurants').doc(newID);
  await docRef.update({
    Address: Addr
  });
}

async function getID(){
  const snapshot = await firebase.firestore().collection('Restaurants').get();
  return snapshot.size;
}

export const CheckBoxDynamic = () => {
  const [checked, setChecked] = React.useState(false);
  return (
    <View>
      <CheckBox
        checked={checked}
        onPress={() => setChecked(!checked)}
        title="The registered office address is the same of the one of the restaurant"
      />
   {checked &&

     <View style={{

    width:"80%",
     height:"40%",
     backgroundColor:"#d9d9d9",
     borderRadius:5,
     height:50,
     width: "90%",
     marginBottom:20,
     marginTop:20,
     marginLeft: "5%",
     justifyContent:"center",
     padding:20
 }} >
       <TextInput
         style={styles.inputText}
         placeholder="Registered office address..."
         placeholderTextColor="#003f5c"
         onChangeText={text => pushAddr(text)}
         />
     </View>

   }
        </View>
  );
}
