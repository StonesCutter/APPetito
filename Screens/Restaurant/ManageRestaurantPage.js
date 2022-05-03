import 'react-native-gesture-handler';
import { Text, View, Image, TouchableOpacity, ScrollView, Dimensions, Alert} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import * as firebase from 'firebase';
import 'firebase/firestore';
import React, { useEffect, useState, useContext } from 'react';
import   {Feather}  from  "react-native-vector-icons";
import { Card, Paragraph } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import {IdRestaurant} from '../../Context'
import { AntDesign } from '@expo/vector-icons';
import { Block, Button as GaButton, } from 'galio-framework';

const db = firebase.firestore();
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ManageRestaurant = (props) => {
  const Stack = createStackNavigator();
  return(
      <Stack.Navigator initialRouteName="Restaurant">
        <Stack.Screen name="Restaurant"component={RestaurantPage}
          options={({navigation})=>({
            headerLeft:() =>(
              <Feather name='menu' size={25} style={{marginLeft:14}}
              color={'#F60875'}  onPress={()=>navigation.openDrawer()}></Feather>
            )
          })}/>
      </Stack.Navigator>
  )
}


const RestaurantPage = ({navigation}) => {
  const [restContext, setRestContext] = useContext(IdRestaurant);
  //const restContext = 1; //temp
  const [restaurant, setRestaurant] = useState();
  const [mon, setMon] = useState();
  const [tue, setTue] = useState();
  const [wed, setWed] = useState();
  const [thu, setThu] = useState();
  const [fri, setFri] = useState();
  const [sat, setSat] = useState();
  const [sun, setSun] = useState();
  const [p, setP] = useState();
  const [o, setO] = useState();
  const [creditCard, setCreditCard] = useState(false);
  const [paypal, setPaypal] = useState(false);
  const [tickets, setTickets] = useState(false);
  const [satispay, setSatispay] = useState(false);


  useEffect(() => {
    start();
  }, []);

  const start = () => {
    db.collection('Restaurants').doc(restContext.toString()).collection('Branch').doc('1').collection('Payments').onSnapshot(pay => {
      setP(pay.docs.length);
    });
    db.collection('Restaurants').doc(restContext.toString()).collection('Branch').doc('1').collection('OpeningHours').onSnapshot(op => {
      setO(op.docs.length);
    })
  }

  useEffect(() => {
      db.collection('Restaurants').doc(restContext.toString()).collection('Branch').doc('1').onSnapshot(user => {
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
        } else if (p && p == 0){
          Alert.alert(
            'You have to complete the registration first'
          ); navigation.navigate('PaymentMethod');
        } else if (o && o == 0){
          Alert.alert(
            'You have to complete the registration first'
          ); navigation.navigate('OpeningDays');
        } else if (user.data().LinkInstagram == undefined) {
          Alert.alert(
            'You have to complete the registration first'
          ); navigation.navigate('InsertSocials');
        } else {
          handlClick();
        }
    })
}, [p,o]);


  const handlClick = () => {
    var i = 0;
    db.collection('Restaurants').doc(restContext.toString()).collection('Branch').doc('1').onSnapshot((data) => {
        const branchData = data.data();
        setRestaurant(branchData);
        db.collection('Restaurants').doc(restContext.toString()).collection('Branch').doc('1').collection('OpeningHours').get().then(doc => {
          doc.docs.map(op => {
            if (op.id == 'Mon') setMon(op.data());
            if (op.id == 'Tue') setTue(op.data());
            if (op.id == 'Wen') setWed(op.data());
            if (op.id == 'Thu') setThu(op.data());
            if (op.id == 'Fri') setFri(op.data());
            if (op.id == 'Sat') setSat(op.data());
            if (op.id == 'Sun') setSun(op.data());
          })
        })
        db.collection('Restaurants').doc(restContext.toString()).collection('Branch').doc('1').collection('Payments').get().then(paym => {
          paym.docs.map(p => {
            if (p.id == 'Paypal') setPaypal(true);
            if (p.id == 'Satispay') setSatispay(true);
            if (p.id == 'CartaDiCreditoDebito') setCreditCard(true);
            if (p.id == 'TicketRestaurant') setTickets(true);
          })
        })
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.0)' }} >
    <ScrollView>
    <ScrollView  horizontal={true} pagingEnabled={true}>
    {restaurant && (
        <TouchableOpacity onPress={() => navigation.navigate('ManagePhotoRest')}>
        <Image
        style={{
          height: windowHeight/4,
          width: windowWidth
        }}
        source={{uri: restaurant.Photo }}/>
        </TouchableOpacity>
      )
    }
    </ScrollView>

    <Block flex={0.5} row middle space="between" style={{ marginLeft: windowWidth/1.3, marginTop: -35}}>
                      <GaButton
                        round
                        onlyIcon
                        shadowless
                        icon="pencil"
                        iconFamily="Font-Awesome"
                        iconColor={"black"}
                        iconSize={20}
                        color={"white"}
                        onPress={() => navigation.navigate('ManagePhotoRest')}
                      />
      </Block>


      <View style={{marginLeft: windowWidth/19, marginTop: -20 }}>
        <TouchableOpacity onPress={() => navigation.navigate('ManageAddr')}>
          <View>
          <Text style={{fontSize: 30}}>{restaurant && restaurant.Name}  <FontAwesome name="pencil" size={20} color="black" /> </Text>
          <Text style={{fontSize: 15}}><Feather name="map-pin" size={17} color="black" />  {restaurant && restaurant.Address} </Text>
          </View>
        </TouchableOpacity>


        {restaurant && restaurant.rate > 0 && (
        <Card style={{width: windowWidth/1.12, marginTop: "2%" }}>
        <View>
        <Card.Title title="Average rate"/>
        <Card.Content>
        <Text style={{fontSize: 15, fontWeight: "bold", marginTop: -5, marginBottom: 20}}>
        <AntDesign name="star" size={25} color={restaurant.rate > 0 ? "orange" : "white"}/>
        <AntDesign name="star" size={25} color={restaurant.rate > 1 ? "orange" : "white"}/>
        <AntDesign name="star" size={25} color={restaurant.rate > 2 ? "orange" : "white"}/>
        <AntDesign name="star" size={25} color={restaurant.rate > 3 ? "orange" : "white"}/>
        <AntDesign name="star" size={25} color={restaurant.rate > 4 ? "orange" : "white"}/>
        </Text>
        </Card.Content>
        </View>
        </Card>

        )}

        <Card style={{width: windowWidth/1.12, marginTop: "2%" }}>
        <View>
        <Card.Title title="Average price"/>
        <Card.Content>
        <Paragraph style={{marginTop: -32.5}}>
        <Text style={{fontSize: 15}}>                                   </Text>
        <FontAwesome name="euro" size={15} color="black" /><Text style={{fontSize: 15}}> {restaurant && restaurant.price}</Text>
        </Paragraph>
        <Paragraph style={{marginTop: -5}}>
        </Paragraph>
        </Card.Content>
        </View>
        </Card>

        <Card style={{width: windowWidth/1.12, marginTop: "2%" }} onPress ={() => navigation.navigate('ManageOpeningHours')}>
        <View>
        <Card.Title title="Opening hours"/>
        <Card.Content>
        <View style={{marginBottom: -20, marginLeft: -5}}><FontAwesome name="clock-o" size={17} color="black" /></View>
        {mon && (
          <View>
            {mon.MidOpening && (
              <View flexDirection="row">

                 <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
                 <Text style={{fontSize: 15}}>Monday:</Text>
                 </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 6}}>
              <Text style={{fontSize: 15}}>{mon.Opening} - {mon.MidClosing}</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 90}}>
              <Text style={{fontSize: 15}}>{mon.MidOpening} - {mon.Closing}</Text>
              </View>

              </View>
            )}
            {!mon.MidOpening && (

            <View flexDirection="row">

               <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
               <Text style={{fontSize: 15}}>Monday:</Text>
               </View>

            <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 7}}>
            <Text style={{fontSize: 15}}>{mon.Opening} - {mon.Closing}</Text>
            </View>

            </View>
            )}
          </View>
        )}{tue && (
          <View>
            {tue.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Tuesday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 7}}>
              <Text style={{fontSize: 15}}>{tue.Opening} - {tue.MidClosing}</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 90}}>
              <Text style={{fontSize: 15}}>{tue.MidOpening} - {tue.Closing}</Text>
              </View>

              </View>
            )}
            {!tue.MidOpening && (

              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Tuesday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100, marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{tue.Opening} - {tue.Closing}</Text>
              </View>

              </View>
            )}
          </View>
        )}
        {wed && (
          <View>
            {wed.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Wednesday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{wed.Opening} - {wed.MidClosing}</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 90}}>
              <Text style={{fontSize: 15}}>{wed.MidOpening} - {wed.Closing}</Text>
              </View>

              </View>
            )}
            {!wed.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Wednesday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100, marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{wed.Opening} - {wed.Closing}</Text>
              </View>

              </View>
            )}
          </View>
        )}
        {thu && (
          <View>
            {thu.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Thursday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{thu.Opening} - {thu.MidClosing}</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 90}}>
              <Text style={{fontSize: 15}}>{thu.MidOpening} - {thu.Closing}</Text>
              </View>

              </View>
            )}
            {!thu.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Thursday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{thu.Opening} - {thu.Closing}</Text>
              </View>

              </View>
            )}
          </View>
        )}
        {fri && (
          <View>
            {fri.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Friday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{fri.Opening} - {fri.MidClosing}</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 90}}>
              <Text style={{fontSize: 15}}>{fri.MidOpening} - {fri.Closing}</Text>
              </View>

              </View>
            )}
            {!fri.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Friday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{fri.Opening} - {fri.Closing}</Text>
              </View>

              </View>
            )}
          </View>
        )}
        {sat && (
          <View>
            {sat.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Saturday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{sat.Opening} - {sat.MidClosing}</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 90}}>
              <Text style={{fontSize: 15}}>{sat.MidOpening} - {sat.Closing}</Text>
              </View>

              </View>
            )}
            {!sat.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Saturday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{sat.Opening} - {sat.Closing}</Text>
              </View>

              </View>
            )}
          </View>
        )}
        {sun && (
          <View>
            {sun.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Sunday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{sun.Opening} - {sun.MidClosing}</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 90}}>
              <Text style={{fontSize: 15}}>{sun.MidOpening} - {sun.Closing}</Text>
              </View>

              </View>
            )}
            {!sun.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Sunday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{sun.Opening} - {sun.Closing}</Text>
              </View>

              </View>
            )}
          </View>
        )}

        <Paragraph>
        </Paragraph>
        </Card.Content>
        </View>
        </Card>

        <Card style={{width: windowWidth/1.12, marginTop: "2%" }} onPress={() => navigation.navigate('ManageSocialLinks')}>
        <View>
        <Card.Content>
        <Paragraph style={{marginTop: 25 }}>
        <FontAwesome name="instagram" size={21} color="black" /> <Text style={{fontSize: 15}}> {restaurant && restaurant.LinkInstagram}</Text>
        </Paragraph>
        <Paragraph>
        </Paragraph>
        <View style={{marginLeft: 250, marginTop: -44, marginBottom: 30}}>
        <FontAwesome name="pencil" size={20} color="black" />
        </View>
        </Card.Content>
        </View>
        </Card>

        <Card style={{width: windowWidth/1.12, marginTop: "2%", height: 90 }} onPress={() => navigation.navigate('ManagePaym')}>
        <View>
        <Card.Title title="Payment Methods"/>
        <Card.Content>
<View style={{marginTop: -5, flexDirection: "row"}}>
          {paypal && paypal && (
          <Text><FontAwesome name="paypal" size={24} color="darkblue" />    </Text>
          )}
          {creditCard && creditCard && (
          <Text><FontAwesome name="credit-card" size={24} color="black" />    </Text>
          )}
          {tickets && tickets && (
          <Text><FontAwesome name="ticket" size={24} color="black" />    </Text>
          )}
          {satispay && satispay && (
            <Image style={{width:25, height:25}} source={require('../../assets/satispay.png')} />
          )}
        </View>
        <View style={{marginBottom: 10}}></View>
        </Card.Content>
        </View>
        </Card>

        <View style={{ height: 80 }}></View>
        </View>
        </ScrollView>
    </View>
  )
}


export default ManageRestaurant;
