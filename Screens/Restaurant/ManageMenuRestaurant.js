import React, {useState, useEffect, useContext} from 'react';
import { Text, View, Image, Dimensions, ScrollView, Alert } from 'react-native';
import 'react-native-gesture-handler';
import * as firebase from 'firebase';
import {createStackNavigator} from '@react-navigation/stack'
import {IdRestaurant} from '../../Context'
import 'firebase/firestore';
import { Card, Paragraph } from 'react-native-paper';
import {styles} from '../../Styles/style'
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const db = firebase.firestore();

const MenuScreen = () => {
  const Stack = createStackNavigator();
  return(
      <Stack.Navigator initialRouteName="Menu">
        <Stack.Screen name="Menu"component={ManageMenu}
          options={({navigation})=>({
            headerLeft:() =>(
              <Feather name='menu' size={25} style={{marginLeft:14}}
              color={'#F60875'}  onPress={()=>navigation.openDrawer()}></Feather>
            )
          })}/>
      </Stack.Navigator>
  )
}


const ManageMenu = ({ navigation}) => {
  const [dishes, setDishes] = useState([]);
  const [idRest, setIdRest] = useContext(IdRestaurant);
  const [veganDishes, setVeganDishes] = useState([]);
  const [veggieDishes, setVeggieDishes] = useState([]);
  const [fishDishes, setFishDishes] = useState([]);
  const [lactoseDishes, setLactoseDishes] = useState([]);
  const [glutineDishes, setGlutineDishes] = useState([]);
  const [dryFruitDishes, setDryFruitDishes] = useState([]);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [p, setP] = useState();
  const [d, setD] = useState();
  const [o, setO] = useState();
  const [no, setNo] = useState(false);


  useEffect(() => {
    start();
  }, []);

  const start = () => {
    db.collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').collection('Payments').get().then(pay => {
      setP(pay.docs.length);
    });
    db.collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').collection('OpeningHours').get().then(op => {
      setO(op.docs.length);
    })
  }

  useEffect(() => {
    if (p && o) {
      db.collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').get().then(user => {
        if (user.data().Name == undefined) {
          Alert.alert(
            'You have to complete the registration first'
          ); navigation.navigate('Restaurant');
        } else if (user.data().Address == undefined) {
          Alert.alert(
            'You have to complete the registration first'
          ); navigation.navigate('Email');
        } else if (user.data().Photo == undefined){
          Alert.alert(
            'You have to complete the registration first'
          ); navigation.navigate('RestaurantProfilePicture');
        } else if (p == 0){
          Alert.alert(
            'You have to complete the registration first'
          ); navigation.navigate('PaymentMethod');
        } else if (o == 0){
          Alert.alert(
            'You have to complete the registration first'
          ); navigation.navigate('OpeningDays');
        } else if (user.data().LinkInstagram == undefined) {
          Alert.alert(
            'You have to complete the registration first'
          ); navigation.navigate('InsertSocials');
        } else {
          query();
        }
    })
  }
}, [p,o]);

  const query = () => {
    setDishes([]);
    const x = db.collection('Restaurants').doc(idRest.toString()).collection('Dishes').onSnapshot(docDish => {
      if (docDish.docs.length == 0) {
        setNo(true)
      } else {
        setNo(false);
        docDish.docChanges().map(dish => {
          setDishes(d => [...d, dish.doc]);
        })
        setVeganDishes([]);
        setVeggieDishes([]);
        setDryFruitDishes([]);
        setFishDishes([]);
        setGlutineDishes([]);
        setLactoseDishes([]);
        db.collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').collection('Category').get().then(catDish => {
          catDish.docs.map(cat => {
            db.collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').collection('Category').doc(cat.id).collection('Dishes').get().then(docdish => {
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
    })
  }

  return (
        <ScrollView>
        <View style={{marginTop: windowHeight/30, alignItems: "center"}}>
          <Text style={styles.loginText}> Here you can find our dishes! </Text>
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

          <Card style={{width: windowWidth/1.1, marginTop: 10, height: 75}}
          onPress={() => navigation.navigate("ManageDish")}>
          <Card.Title title="Add new dish here" color="white" left={
            () => {
          let LeftContent = props =><MaterialCommunityIcons name="plus-circle" size={30} color="#fb5b5a" />
            return <LeftContent/>
    } }/>
          </Card>

          {no == true && (
              <Text style={styles.loginText}>You have no dishes yet</Text>
          )}

          </View>
          <Text>{dishes && veggieDishes && dishes.map((dish, i) => {
            return (
              <View style={{alignItems: "center", justifyContent: "center"}}>
              <Card style={{width: windowWidth/1.1, marginTop: 10, marginLeft:(windowWidth/100)*4.5, height: 200}}>
              <View>
                <Card.Content>
                  <Image style={{height: 150,  width: 150, borderRadius: 5,marginTop:35, marginLeft: -11}} source={{uri: dish.data().Photo }}/>
                  <Paragraph style={{  fontSize: 17, fontWeight: "bold", marginTop: -175, marginLeft: -7}}>
                    <Text>{dish.data().Name}</Text>
                  </Paragraph>
                  <Paragraph style={{ marginLeft: 145,  fontSize: 14, marginTop: -3, fontWeight: "bold"}}>
                    <Text>{dish.data().Price}€</Text>
                  </Paragraph>
                  <Paragraph style={{marginLeft: 145,  fontSize: 14}}>
                    <Text style={{fontWeight: "bold"}}>Ingredients: </Text><Text>{dish.data().Description}</Text>
                  </Paragraph>
                  <Paragraph style={{marginLeft: 145,  fontSize: 14}}>
                    <Text style={{fontWeight: "bold"}}>Course:</Text><Text> {dish.data().Course}</Text>
                  </Paragraph>
                  <Paragraph style={{marginLeft: 145,  fontSize: 14}}>
                    <Text style={{fontWeight: "bold"}}>Kcal:</Text><Text> {dish.data().Kcal}</Text>
                  </Paragraph>
                  <Paragraph style={{marginLeft: 145,  fontSize: 14}}>
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
