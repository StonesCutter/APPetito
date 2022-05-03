import React, {useState, useContext, useEffect} from 'react';
import { Text, View, TouchableOpacity, Image, Alert, Dimensions, ScrollView} from 'react-native';
import 'react-native-gesture-handler';
import {styles} from '../../Styles/style'
import {IdRestaurant} from '../../Context'
import { Card, Paragraph } from 'react-native-paper';
import firebase from 'firebase';
const db = firebase.firestore();

const InsertMenuScreen = ({navigation, route}) => {
  const[dishData, setDishData] = useState([]);
  const[idRest, setIdRest] = useContext(IdRestaurant);
  const [sum, setSum] = useState();
  const [count, setCount] = useState();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    //to add dishes
    if (route.params?.dishName) {
        db.collection('Restaurants').doc(idRest.toString()).collection('Dishes').get().then(docsDish => {
            docsDish.docs.map(dish => {
              if (dish.data().Name == route.params?.dishName) {
                setDishData(d => [...d, dish.data()]);
              }
            })
        })
    }
  }, [route.params?.dishName]);

  useEffect(() => {
    if (dishData.length > 0){
      var s = 0;
      var c = 0;
      db.collection('Restaurants').doc(idRest.toString()).collection('Dishes').get().then(doc => {
        doc.docs.map(dish => {
          const pr = dish.data().Price;
          c = c + 1
          s = s + pr;
          setCount(c);
          setSum(s);
        })
      })
    }
  }, [dishData])

  useEffect(() => {
    if (count && sum) {
      const avarage = sum/count;
      db.collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').update({
        price: avarage
      })
    }
  }, [count, sum])

  return (
    <View style={styles.container}>

    <View style={{marginBottom: 40}}>
    <Text style={styles.loginText}>Create your menu</Text>
    </View>

              <View style={{flexDirection: "row"}}>
              <Text style={{marginTop: 10, color: "black", fontSize: 20}}>Add a new dish   </Text>
              <TouchableOpacity onPress={() => navigation.navigate("InsertDish")}>
              <Image style={{marginTop: 10}} source={require('../../assets/plus.png')} />
              </TouchableOpacity>
              </View>

              {dishData && dishData.map((dish,i) => {
                return (

<View>
                  <Card style={{width: windowWidth/1.1, marginTop: 10,  height: 60}}>
                  <View style={{marginTop: 10}}>
                    <Card.Content>
                    <Text style={{fontWeight: "bold"}}> Name: {dish.Name} </Text>
                    <Text style={{fontWeight: "bold"}}> Price: {dish.Price} €</Text>
                    </Card.Content>
                  </View>
                  </Card>
                  </View>
                )
              })}

              <TouchableOpacity
                 onPress={() => {
                   if (!dishData || dishData.length==0) {
                      Alert.alert("You have to push at least one dish")
                   } else {
                    navigation.navigate("Skip")}}
                   }
                 style={styles.loginBtn}>
                <Text style={styles.buttonText}>Finish</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("Skip")}>
              <Text style={styles.skip}>Skip</Text>
              </TouchableOpacity>
    </View>
  );
}


export default InsertMenuScreen;
