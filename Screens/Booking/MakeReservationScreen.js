import * as React from 'react';
import { Text, View, Dimensions, Alert, ScrollView, Button, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import {styles} from '../../Styles/style'
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Card, Paragraph } from 'react-native-paper';
import NumericInput from 'react-native-numeric-input'
import { FontAwesome } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useState, useEffect, useContext, setState } from "react";
import Menu from './MenuBook'
import { AntDesign } from '@expo/vector-icons';
import { IdContext, restNameContext } from '../../Context';
import RBSheet from "react-native-raw-bottom-sheet";
import { useRef } from "react";

const db = firebase.firestore();
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MakeReservationScreen = () => {
        const Stack = createStackNavigator();
        return(
            <Stack.Navigator initialRouteName="MakeReservation">
              <Stack.Screen name="MakeReservation"component={MakeReservation}/>
              <Stack.Screen name="Menu" component={Menu}/>
            </Stack.Navigator>
        )
}

const MakeReservation = ({route, navigation}) => {
  const [points, setPoints] = useState(0);
  const [people, setPeople] = useState(1);
  const [dishData, setDishData] = useState([]);
  const [maxPoints, setMaxPoints] = useState();
  const [total, setTotal] = useState(0);
  const [idRest, setIdRest] = useContext(restNameContext);
  const [totalNoSconto, setTotalNoSconto] = useState(0);
  const [contatore, setContatore] = useState(0);
  const [date, setDate] = useState();
  const [hour, setHour] = useState();
  const [branch, setBranch] = useState();
  const [id, setId] = useContext(IdContext);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const refRBSheetMakeReservation = useRef();

  const pushReservation = async() => {
    var temp;
    if (branch.length < 23){
      temp = branch + "/Branch/1";
      setIdRest(temp);
    } else {
      temp = branch;
      setIdRest(temp);
    }
    const bookRef = db.collection('Bookings');
    const bookSize = (await bookRef.get()).size +1;
    const bookDate = date + ' - ' + hour
    await bookRef.doc(bookSize.toString()).set({
      ID_Client: parseInt(id),
      ID_Branch: temp,
      BookingDate: bookDate,
      People: people,
      Price: total,
      Status: 'Pending'
    })
    navigation.navigate('MyBookings', {bookID: bookSize});
  }

  useEffect(() => {
    if (id) {
      db.collection('Clients').doc(id.toString()).get().then(user => {
        if (!user.data().FirstName) {
          Alert.alert(
            'You have to complete the registration first'
          ); navigation.navigate('UserNameSurname');
        } else if (!user.data().ID_Type) {
          Alert.alert(
            'You have to complete the registration first'
          ); navigation.navigate('ChooseCategory');
        } else if (!user.data().Photo) {
          Alert.alert(
            'You have to complete the registration first'
          ); navigation.navigate('UserProfilePicture');
        } else {
      //to add dishes
      if (route.params?.dishName) {
          db.doc(idRest).collection('Dishes').get().then(docsDish => {
              docsDish.docs.map(dish => {
                  if (dish.data().Name == route.params?.dishName) {
                      setDishData(d => [...d, dish.data()]);
                      setTotal(d => d + dish.data().Price);
                      setTotalNoSconto(d => d + dish.data().Price);
                  }
              })
          })
      } else {
          setBranch(idRest);
          setDishData([]);
      }
      db.collection('Clients').doc(id.toString()).get().then(usData => {
        setMaxPoints(usData.data().Points);
      })}})
    } else {
      Alert.alert(    
        "Login needed",
        'You have to do the login first',  
        [  
            {  
                text: 'Login', onPress: () => navigation.navigate("Login")
            },  
            {text: 'Go Back', onPress: () => navigation.goBack()},  
        ]  
    );  
    }
  }, [route.params?.dishName]);


  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };
  const handleTimeConfirm = (time) => {
    var x = time.toString();
    x = x.substring(16,21);
    setHour(x);
    hideTimePicker();
  };

  const handleDateConfirm = (date) => {
    var x = date.toString();
    x = x.substring(4, 15)
    setDate(x);
    setDatePickerVisibility(false);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const resetContextWithRestID = () => {
    const x = idRest.substring(0,14);
    setIdRest(x);
  }

  useEffect(() => {
    if (branch) {
      console.log(branch);
    }
  }, [branch])

  useEffect(() => {
    if (points) {
      const x = totalNoSconto - (totalNoSconto*(points/10)/100)
      setTotal(x);
    }
  }, [points])

  return (
    <ScrollView>
    <View style={{marginTop: windowHeight/15}}>
    <Text style={styles.loginText}> Make your reservation </Text>

    <View style={{alignItems: "center", justifyContent: "center"}}>
    <Card style={{width: windowWidth/1.1, marginTop: 20, height: 70}}>
    <View>
      <Card.Content>
      <Paragraph style={{ fontSize: 17,   marginLeft: -7, marginTop: 25}}>
      <Text>N° of people</Text>
      </Paragraph>
      <View style={{ fontSize: 17,   marginLeft: windowWidth/3, marginTop: -34}}>
      <NumericInput
                  value={people}
                  onChange={value => setPeople(value)}
                  onLimitReached={(isMax,msg) => console.log(isMax,msg)}
                  totalWidth={180}
                  totalHeight={45}
                  iconSize={25}
                  step={1}
                  valueType='real'
                  rounded
                  textColor='#B0228C'
                  iconStyle={{ color: 'white' }}
                  rightButtonBackgroundColor='#EA3788'
                  leftButtonBackgroundColor='#E56B70'
                  minValue={1}
                  maxValue={6}
                  />
      </View>
      </Card.Content>
    </View>
    </Card>

    <Card style={{width: windowWidth/1.1,  height: 100, marginTop: 10}}>
    <View>
      <Card.Content style={{ height: 100}}>
      <Paragraph style={{ fontSize: 17,   marginLeft: -7, marginTop: 25}}>
      <Text>When</Text>
      </Paragraph>


      <Text style={{marginLeft: windowWidth/2.68, marginTop: -30}}  onPress={() => setDatePickerVisibility(true)}>
      <FontAwesome name="calendar" size={30} color="black"/> {isDatePickerVisible && ( <View>
        <DateTimePickerModal
         isVisible={isDatePickerVisible}
         mode="date"
         onConfirm={handleDateConfirm}
         onCancel={hideDatePicker}
       />
      </View>
        )}
        <Text>   {date && date}  </Text>
        </Text>

    <Text style={{marginLeft: windowWidth/2.68, marginTop: 10}} onPress={() => setTimePickerVisibility(true)}>
      <FontAwesome name="clock-o" size={30} color="black"/>
      {isTimePickerVisible && (
        <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />
      )}
      <Text>    {hour && hour}</Text>
      </Text>
      </Card.Content>
    </View>
    </Card>

    <Card style={{width: windowWidth/1.1,  height: 30*(contatore) +70, marginTop: 10}}>
    <View>
      <Card.Content>
      <Paragraph style={{ fontSize: 17,   marginLeft: -7, marginTop: 25}}>
      <Text>Add dish</Text>
      </Paragraph>
      <View style={{alignItems: "center"}}>
      <AntDesign name="pluscircleo" size={30} color="black"
      style = {{ marginTop: -30}} onPress = {() => {resetContextWithRestID(); navigation.navigate('Menu'); setContatore(contatore+1)}} />
      {dishData && dishData.map((dish, i) => {
                return (
                    <View>
                        <Text style={{ marginTop: 10 }}>{dish.Name}    {dish.Price}€</Text>
                        <Text style={{ marginTop: -15 }}></Text>
                    </View>
                )
            })}
      </View>

      </Card.Content>
    </View>
    </Card>

    <Card style={{width: windowWidth/1.1,  height: 70, marginTop: 10}}>
    <View>
      <Card.Content>
      <Paragraph style={{ fontSize: 17,   marginLeft: -7, marginTop: 25}}>
      <Text>Use points</Text>
      </Paragraph>
      <View style={{ fontSize: 17, marginLeft: windowWidth/3, marginTop: -37}}>
      <NumericInput
                value={points}
                onChange={value => setPoints(value)}
                onLimitReached={(isMax,msg) => console.log(isMax,msg)}
                totalWidth={180}
                totalHeight={45}
                iconSize={25}
                step={100}
                valueType='real'
                rounded
                textColor='#B0228C'
                iconStyle={{ color: 'white' }}
                rightButtonBackgroundColor='#EA3788'
                leftButtonBackgroundColor='#E56B70'
                minValue={0}
                maxValue={maxPoints}
                />

      </View>
      </Card.Content>
    </View>
    </Card>

    <Card style={{width: windowWidth/1.1,  height: 70, marginTop: 10}}>
    <View style={{width: windowWidth/1.1,  height: 70, marginTop: 10}}>
      <Card.Content>
      <Paragraph style={{ fontSize: 17,   marginLeft: -7, marginTop: 15}}>
      <Text>Total      € {total}</Text>
      </Paragraph>
      </Card.Content>
    </View>
    </Card>

    <TouchableOpacity
       onPress={() =>{
        if (!date || !hour) {
          Alert.alert('Please insert a valid date/time')
        } else if (dishData.length == 0) {
          Alert.alert('Please insert at least one dish')
        } else {
          refRBSheetMakeReservation.current.open(); pushReservation();
        }
        }}
       style={styles.loginBtn}>
      <Text style={styles.buttonText}>Continue</Text>
    </TouchableOpacity>

    <RBSheet
      ref={refRBSheetMakeReservation}
      height={windowHeight}
      closeOnDragDown={true}
      closeOnPressMask={false}
      customStyles={{
        wrapper: {
        backgroundColor: 'rgba(52, 52, 52, 0.8)'
        },
        draggableIcon: {
          backgroundColor: "#000"
        }
      }}
    >
    <View style={styles.container}>
    <AntDesign name="checkcircle" size={100} color="green" />
    <Text style={{
        fontSize:20,
        fontWeight: "bold",
        color:"green",
        alignItems:"center",
        textAlign: 'center',
        marginTop: "10%"}}>Your reservation is completed!</Text>
    <TouchableOpacity
       onPress={() => navigation.navigate('MyBookings')}
       style={{
         width:300,
         backgroundColor:"green",
         borderRadius:5,
         height:50,
         alignItems:"center",
         justifyContent:"center",
         marginTop:40,
         marginBottom:10
       }}>
    <Text style={styles.buttonText}>Continue</Text>
    </TouchableOpacity>
    </View>

    </RBSheet>

</View>
</View>
</ScrollView>
)}

export default MakeReservationScreen;
