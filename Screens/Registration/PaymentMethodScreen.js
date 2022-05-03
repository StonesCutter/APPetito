import * as React from 'react';
import { Text, View, TouchableOpacity, CheckBox, Alert} from 'react-native';
import 'react-native-gesture-handler';
import {styles} from '../../Styles/style'
import * as firebase from 'firebase';
import {IdRestaurant} from '../../Context'
import 'firebase/firestore';

const PaymentMethodScreen = props => {
  const [isSelected1, setSelection1] = React.useState(false);
  const [isSelected2, setSelection2] = React.useState(false);
  const [isSelected3, setSelection3] = React.useState(false);
  const [isSelected4, setSelection4] = React.useState(false);
  const [idRest, setIdRest] = React.useContext(IdRestaurant);
  //const idRest = 10;

    async function pushPay(satispay, paypal, creditcard, ticket){
      if (satispay) {
        const payRef = firebase.firestore().collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').collection('Payments').doc('Satispay');
        await payRef.set({})
      }
      if (paypal) {
        const payRef = firebase.firestore().collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').collection('Payments').doc('Paypal');
        await payRef.set({})
      }
      if (creditcard) {
        const payRef = firebase.firestore().collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').collection('Payments').doc('CartaDiCreditoDebito');
        await payRef.set({})
      }
      if (ticket) {
        const payRef = firebase.firestore().collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').collection('Payments').doc('TicketRestaurant');
        await payRef.set({})
      }
    }

  return (

    <View style={styles.container}>

    
              <Text style={styles.loginText}>Insert the payment method</Text>

              <View style={{marginTop:20, flexDirection: 'column', marginTop: 20, marginLeft: "20%", marginRight: 80}}>

                <View style={{flexDirection: "row", alignItems:"center"}}>
                <CheckBox
                          value={isSelected1}
                          onValueChange={setSelection1}
                          style={styles.checkbox}
                        />
                <Text style={{margin: 8,  color:"black"}}>Satispay</Text>
                </View>

                <View style={{flexDirection: "row", alignItems:"center"}}>
                <CheckBox
                          value={isSelected2}
                          onValueChange={setSelection2}
                          style={styles.checkbox}
                        />
                <Text style={{margin: 8,  color:"black"}}>Paypal</Text>
                </View>

                <View style={{flexDirection: "row", alignItems:"center"}}>
                <CheckBox
                          value={isSelected3}
                          onValueChange={setSelection3}
                          style={styles.checkbox}
                        />
                <Text style={{margin: 8,  color:"black"}}>Credit Card</Text>
                </View>

                <View style={{flexDirection: "row", alignItems:"center"}}>
                <CheckBox
                          value={isSelected4}
                          onValueChange={setSelection4}
                          style={styles.checkbox}
                        />
                <Text style={{margin: 8,  color:"black"}}>Ticket Restaurant</Text>
                </View>

                </View>
              <TouchableOpacity
                 onPress={() => {
                  if (!isSelected1 && !isSelected2 && !isSelected3 && !isSelected4) {
                    Alert.alert('You have to choose at least one payment method')
                  } else {
                    pushPay(isSelected1, isSelected2, isSelected3, isSelected4); props.navigation.navigate("OpeningDays")}}
                  }
                 style={styles.loginBtn}>
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => props.navigation.navigate("Skip")}>
              <Text style={styles.skip}>Skip</Text>
              </TouchableOpacity>

    </View>
  );
}

export default PaymentMethodScreen;
