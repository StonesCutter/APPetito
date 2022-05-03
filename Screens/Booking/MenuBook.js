import React, {useState, useEffect, useContext} from 'react';
import { Text, View, Image, Dimensions, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Card, Paragraph } from 'react-native-paper';
import {styles} from '../../Styles/style'
import { restNameContext} from '../../Context';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const db = firebase.firestore();

const MenuScreen = (props) => {
  const [dishes, setDishes] = useState([]);
  const [idRestaurant, setIDRestaurant] = useContext(restNameContext);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [veganDishes, setVeganDishes] = useState([]);
  const [veggieDishes, setVeggieDishes] = useState([]);
  const [fishDishes, setFishDishes] = useState([]);
  const [lactoseDishes, setLactoseDishes] = useState([]);
  const [glutineDishes, setGlutineDishes] = useState([]);
  const [dryFruitDishes, setDryFruitDishes] = useState([]);

  useEffect(() =>{
    query();
  }, []);

  const query = () => {
    setDishes([]);
    setDishes([]);
    setVeganDishes([]);
    setVeggieDishes([]);
    setDryFruitDishes([]);
    setFishDishes([]);
    setGlutineDishes([]);
    setLactoseDishes([]);
    db.doc(idRestaurant).collection('Dishes').get().then(docDish => {
      docDish.docs.map(dish => {
        setDishes(d => [...d, dish]);
      })
    })
    db.doc(idRestaurant).collection('Branch').doc('1').collection('Category').get().then(catDish => {
      catDish.docs.map(cat => {
        db.doc(idRestaurant).collection('Branch').doc('1').collection('Category').doc(cat.id).collection('Dishes').get().then(docdish => {
          docdish.docs.map(dish => {
            if (cat.id == 'Vegan') setVeganDishes(d => [...d, dish.data().ID_Dish]);
            if (cat.id == 'Vegetarian') setVeggieDishes(d => [...d, dish.data().ID_Dish]);
            if (cat.id == 'Pesce') setFishDishes(d => [...d, dish.data().ID_Dish]);
            if (cat.id == 'Gluten Free') setGlutineDishes(d => [...d, dish.data().ID_Dish]);
            if (cat.id == 'Senza Lattosio') setLactoseDishes(d => [...d, dish.data().ID_Dish]);
            if (cat.id == 'Senza Frutta Secca') setDryFruitDishes(d => [...d, dish.data().ID_Dish]);
          })
        })
      })
    })
  }

  return (

    <ScrollView>
    <View style={{marginTop: windowHeight/30, alignItems: "center", marginLeft: windowWidth/20}}>
      <Text style={styles.loginText}> Tap on the dish to select it </Text>
      </View>
      <View style={{alignItems: "center", justifyContent: "center"}}>
      <Card style={{width: windowWidth/1.1, marginTop: 10,  height: 60}}>
      <View style={{marginTop: 5, alignItems: "center",justifyContent: "center"}}>
        <Card.Content>
        <Text style={{fontWeight: "bold"}}> Vegan <Entypo name="leaf" size={17} color="green"/>  Vegetarian <Entypo name="leaf" size={17} color="purple"/>  No Lactose <MaterialCommunityIcons name="cow" size={20} color="red" />
                    </Text>
        <Paragraph style={{fontWeight: "bold"}}> Dry fruit <MaterialCommunityIcons name="food-apple" size={17} color="brown" />  Fish <FontAwesome5 name="fish" size={17} color="blue" />  Gluten free <FontAwesome5 name="bread-slice" size={17} color="orange" />
                    </Paragraph>
        </Card.Content>
      </View>
      </Card>
      </View>
      <Text>{dishes && dishes.map((dish, i) => {
        return (
          <View style={{alignItems: "center", justifyContent: "center"}}>
          <Card style={{width: windowWidth/1.1, marginTop: 10, marginLeft:(windowWidth/100)*4.5, height: 180}}
           onPress={() => props.navigation.navigate('MakeReservation', {dishName: dish.data().Name})}>
          <View>
            <Card.Content>
              <Image style={{height: 135,  width: 135, borderRadius: 5,marginTop:40, marginLeft: -11}} source={{uri: dish.data().Photo }}/>
              <Paragraph style={{ marginTop: 10,  fontSize: 17, fontWeight: "bold", marginTop: -165, marginLeft: -7}}>
                <Text>{dish.data().Name}</Text>
              </Paragraph>
              <Paragraph style={{ marginLeft: 140,  fontSize: 17, fontWeight: "bold", marginTop: 10}}>
                <Text>{dish.data().Price}€</Text>
              </Paragraph>
              <Paragraph style={{marginLeft: 140,  fontSize: 14}}>
                <Text style={{fontWeight: "bold"}}>Ingredients: </Text><Text>{dish.data().Description}</Text>
              </Paragraph>
              <Paragraph style={{marginLeft: 140,  fontSize: 14}}>
                <Text style={{fontWeight: "bold"}}>Course:</Text><Text> {dish.data().Course}</Text>
              </Paragraph>
              <Paragraph style={{marginLeft: 140,  fontSize: 14}}>
                <Text style={{fontWeight: "bold"}}>Kcal:</Text><Text> {dish.data().Kcal}</Text>
              </Paragraph>
              <Paragraph style={{marginLeft: 140,  fontSize: 14}}>
               <Text style={{fontWeight: "bold"}}>Category:</Text>
               {veggieDishes && veggieDishes.map((veg, j) => {
                 if (veg == dish.id) {
                   return (
                    <Text> <Entypo name="leaf" size={17} color="purple"/></Text>
                   )
                 }
               })}
               {veganDishes && veganDishes.map((veg,j) => {
                 if (veg == dish.id) {
                  return (
                    <Text> <Entypo name="leaf" size={17} color="green"/></Text>
                  )
                }
               })}
               {glutineDishes && glutineDishes.map((veg,j) => {
                 if (veg == dish.id) {
                  return (
                    <Text> <FontAwesome5 name="bread-slice" size={17} color="orange" /> </Text>
                  )
                }
               })}
               {lactoseDishes && lactoseDishes.map((veg,j) => {
                 if (veg == dish.id) {
                  return (
                    <Text> <MaterialCommunityIcons name="cow" size={20} color="red" /></Text>
                  )
                }
               })}
               {dryFruitDishes && dryFruitDishes.map((veg,j) => {
                 if (veg == dish.id) {
                  return (
                    <Text> <MaterialCommunityIcons name="food-apple" size={17} color="brown" /></Text>
                  )
                }
               })}
               {fishDishes && fishDishes.map((veg,j) => {
                 if (veg == dish.id) {
                  return (
                    <Text> <FontAwesome5 name="fish" size={17} color="blue" /></Text>
                  )
                }
               })}
              </Paragraph>
            </Card.Content>
          </View>
          </Card>
          </View>

        )
      })}</Text>
      </ScrollView>

  )
}


export default MenuScreen;
