import * as React from 'react';
import { Text, View, CheckBox, TouchableOpacity, Alert } from 'react-native';
import { useState } from "react";
import {styles} from './Styles/style'
import { List } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as firebase from 'firebase';
import 'firebase/firestore';
import {IdRestaurant} from './Context';

export const CheckBoxOpenings = () => {
  const [idRest, setIdRest] = React.useContext(IdRestaurant);
  const [day, setDay] = useState();
  const [SecondOp, setSecondOp] = useState();
  const [SecondCl, setSecondCl] = useState();
  const [Opening, setOpening] = useState();
  const [Closing, setClosing] = useState();
  const [checked, setChecked] = useState(false); //se si allora spunta il secondo coso degli orari
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isTimePickerVisibleClos, setTimePickerVisibilityClos] = useState(false);
  const [isTimePickerVisible1, setTimePickerVisibility1] = useState(false);
  const [isTimePickerVisibleClos1, setTimePickerVisibilityClos1] = useState(false);

  async function pushHours(gg, Opening, Closing) {
    switch(gg){
      case "Monday": gg="Mon"; break;
      case "Tuesday": gg="Tue"; break;
      case "Wednesday": gg="Wed"; break;
      case "Thursday": gg="Thu"; break;
      case "Friday": gg="Fri"; break;
      case "Saturday": gg="Sat"; break;
      case "Sunday": gg="Sun"; break;
    }

    const docRef = firebase.firestore().collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').collection('OpeningHours').doc(gg);
    if (checked) {
      if (docRef.get().size > 0) {
        await docRef.update({
          Opening: Opening,
          MidClosing: Closing,
        });
      } else {
        await docRef.set({
          Opening: Opening,
          MidClosing: Closing,
        });
      }

    }  else {
      if (docRef.get().size > 0) {
        await docRef.update({
          Opening: Opening,
          Closing: Closing,
        });
      } else {
        await docRef.set({
          Opening: Opening,
          Closing: Closing,
        });
      }

    }
    Alert.alert('Successfull')
  }

    async function pushHours1(gg) {
      switch(gg){
        case "Monday": gg="Mon"; break;
        case "Tuesday": gg="Tue"; break;
        case "Wednesday": gg="Wed"; break;
        case "Thursday": gg="Thu"; break;
        case "Friday": gg="Fri"; break;
        case "Saturday": gg="Sat"; break;
        case "Sunday": gg="Sun"; break;
      }
      const docRef = firebase.firestore().collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').collection('OpeningHours').doc(gg);

      await docRef.update({
        MidOpening: SecondOp,
        Closing: SecondCl,
      });
      Alert.alert('Successfull')
    }

  const HourDate = () => {
    const showTimePicker = () => {
      setTimePickerVisibility(true);
    };
    const showTimePickerClos = () => {
      setTimePickerVisibilityClos(true);
    };
    const hideTimePickerOpening = () => {
      setTimePickerVisibility(false);
    };
    const hideTimePickerClosing = () => {
     setTimePickerVisibilityClos(false);
    };
    const hideTimePickerCancel = () => {
      setTimePickerVisibilityClos(false);
      setTimePickerVisibility(false);
      setOpening();
      setClosing();
     };
    const handleConfirmOpening = (time) => {
      setTimePickerVisibility(false);
      var x = time.toString();
      x = x.substring(16,21)
      setOpening(x);
      hideTimePickerOpening();
    };
    const handleConfirmClosing = (time) => {
     setTimePickerVisibilityClos(false);
     var x = time.toString();
      x = x.substring(16,21)
      setClosing(x);
    };

    //gli orari sono un'ora indietro rispetto a quello che selezioni
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 20, fontWeight: "bold", color: "black", marginLeft: -35}}>First time span</Text>
        <View flexDirection="row" style={{marginLeft: -30}}>
        <TouchableOpacity
           onPress={showTimePicker}
           style={{width:150,
             backgroundColor:"white",
             borderRadius:70,
             height:50,
             alignItems:"center",
             justifyContent:"center",
             borderWidth: 2,
             borderColor: '#fb5b5a',
           marginTop:10
         }}>
          <Text style={{fontSize: 17, fontWeight: "bold", color: "#fb5b5a"}}>From this hour</Text>
        </TouchableOpacity>
        <View
           onPress={showTimePicker}
           style={{width:100,
           backgroundColor:"white",
           borderRadius:5,
           height:50,
           alignItems:"center",
           justifyContent:"center",
           marginTop:10,
           marginLeft: 5
         }}>
          <Text style={{fontSize: 17, fontWeight: "bold", color: "black"}}>{Opening}</Text>
        </View>
     <DateTimePickerModal
       isVisible={isTimePickerVisible}
       mode="time"
       onConfirm={handleConfirmOpening}
       onCancel={hideTimePickerCancel}
     />
     </View>
     <View flexDirection="row" style={{marginLeft: -30, marginTop: 10}}>
      <TouchableOpacity
         onPress={showTimePickerClos}
         style={{width:150,
         backgroundColor:"white",
         borderRadius:70,
         height:50,
         alignItems:"center",
         justifyContent:"center",
         borderWidth: 2,
         borderColor: '#fb5b5a'
       }}>
        <Text style={{fontSize: 17, fontWeight: "bold", color: "#fb5b5a"}}>To this hour</Text>
      </TouchableOpacity>
      <View
         onPress={showTimePicker}
         style={{width:100,
         backgroundColor:"white",
         borderRadius:5,
         height:50,
         alignItems:"center",
         justifyContent:"center",
         marginLeft: 5
       }}>
        <Text style={{fontSize: 17, fontWeight: "bold", color: "black"}}>{Closing}</Text>
      </View>
      <DateTimePickerModal
      isVisible={isTimePickerVisibleClos}
      mode="time"
      onConfirm={handleConfirmClosing}
      onCancel={hideTimePickerCancel}
          />
      </View>
      <View  style={{marginTop: 10}}>
      <TouchableOpacity
         onPress={() => pushHours(day, Opening, Closing)}
         style={{width:255,
         backgroundColor:"#fb5b5a",
         borderRadius:70,
         height:50,
         alignItems:"center",
         justifyContent:"center",
         marginLeft: -30
       }}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
      </View>
   </View>
    );
   };

   const HourDate1 = () => {
    const showTimePicker = () => {
      setTimePickerVisibility1(true);
    };
    const showTimePickerClos = () => {
      setTimePickerVisibilityClos1(true);
    };
    const hideTimePickerOpening = () => {
      setTimePickerVisibility1(false);
    };
    const hideTimePickerClosing = () => {
     setTimePickerVisibilityClos1(false);
    };
    const hideTimePickerCancel = () => {
      setTimePickerVisibilityClos1(false);
      setTimePickerVisibility1(false);
      setSecondOp();
      setSecondCl();
     };
    const handleConfirmOpening = (time) => {
      setTimePickerVisibility1(false);
      var x = time.toString();
      x = x.substring(16,21)
      setSecondOp(x);
      hideTimePickerOpening();
    };
    const handleConfirmClosing = (time) => {
     setTimePickerVisibilityClos1(false);
     var x = time.toString();
      x = x.substring(16,21)
      setSecondCl(x);
    };

    return (
      <View style={styles.container}>
        <Text style={{fontSize: 20, fontWeight: "bold", color: "black", marginLeft: -35, marginTop: 20}}>Second time span</Text>
        <View flexDirection="row" style={{marginLeft: -30}}>
        <TouchableOpacity
           onPress={showTimePicker}
           style={{width:150,
             backgroundColor:"white",
             borderRadius:70,
             height:50,
             alignItems:"center",
             justifyContent:"center",
             borderWidth: 2,
             borderColor: '#fb5b5a',
           marginTop:10
         }}>
          <Text style={{fontSize: 17, fontWeight: "bold", color: "#fb5b5a"}}>From this hour</Text>
        </TouchableOpacity>
        <View
           onPress={showTimePicker}
           style={{width:100,
           backgroundColor:"white",
           borderRadius:5,
           height:50,
           alignItems:"center",
           justifyContent:"center",
           marginTop:10,
           marginLeft: 5
         }}>
          <Text style={{fontSize: 17, fontWeight: "bold", color: "black"}}>{SecondOp}</Text>
        </View>
     <DateTimePickerModal
       isVisible={isTimePickerVisible1}
       mode="time"
       onConfirm={handleConfirmOpening}
       onCancel={hideTimePickerCancel}
     />
     </View>
     <View flexDirection="row" style={{marginLeft: -30, marginTop: 10}}>
      <TouchableOpacity
         onPress={showTimePickerClos}
         style={{width:150,
         backgroundColor:"white",
         borderRadius:70,
         height:50,
         alignItems:"center",
         justifyContent:"center",
         borderWidth: 2,
         borderColor: '#fb5b5a'
       }}>
        <Text style={{fontSize: 17, fontWeight: "bold", color: "#fb5b5a"}}>To this hour</Text>
      </TouchableOpacity>
      <View
         onPress={showTimePicker}
         style={{width:100,
         backgroundColor:"white",
         borderRadius:5,
         height:50,
         alignItems:"center",
         justifyContent:"center",
         marginLeft: 5
       }}>
        <Text style={{fontSize: 17, fontWeight: "bold", color: "black"}}>{SecondCl}</Text>
      </View>
      <DateTimePickerModal
      isVisible={isTimePickerVisibleClos1}
      mode="time"
      onConfirm={handleConfirmClosing}
      onCancel={hideTimePickerCancel}
          />
      </View>
      <View  style={{marginTop: 10}}>
      <TouchableOpacity
         onPress={() => {pushHours1(day)}}
         style={{width:255,
         backgroundColor:"#fb5b5a",
         borderRadius:70,
         height:50,
         alignItems:"center",
         justifyContent:"center",
         marginLeft: -30
       }}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
      </View>
   </View>
    );
   };


  return (
    <View style={{marginTop: 20}}>
      <CheckBox
        disable={false}
        value={checked}
        onValueChange={(value) => setChecked(value)}
      />
      <Text style={{marginLeft: 30, marginTop: -25}}>Afternoon break</Text>
        <List.Section>
        <List.Accordion
          title="Sunday"
          theme={{ colors: { primary: '#fb5b5a' }}}
          onPress ={() => setDay('Sunday')}
          left={props => <List.Icon {...props} icon="calendar" />}>
          <Text>{HourDate(day)}</Text>
          {checked && (
            <Text>{HourDate1(day)}</Text>
          )}
        </List.Accordion>
      </List.Section>
  <Text></Text>
      <List.Section>
        <List.Accordion
          title="Monday"
          theme={{ colors: { primary: '#fb5b5a' }}}
          onPress ={() => setDay('Monday')}
          style={{marginTop: -30}}
          left={props => <List.Icon {...props} icon="calendar" />}>
          <Text>{HourDate(day)}</Text>
          {checked && (
            <Text>{HourDate1(day)}</Text>
          )}
        </List.Accordion>
      </List.Section>
      <Text></Text>
      <List.Section>
        <List.Accordion
          title="Tuesday"
          theme={{ colors: { primary: '#fb5b5a' }}}
          onPress ={() => setDay('Tuesday')}
          style={{marginTop: -30}}
          left={props => <List.Icon {...props} icon="calendar" />}>
          <Text>{HourDate(day)}</Text>
          {checked && (
            <Text>{HourDate1(day)}</Text>
          )}
        </List.Accordion>
      </List.Section>
      <Text></Text>
      <List.Section>
        <List.Accordion
          title="Wednesday"
          theme={{ colors: { primary: '#fb5b5a' }}}
          onPress ={() => setDay('Wednesday')}
          style={{marginTop: -30}}
          left={props => <List.Icon {...props} icon="calendar" />}>
          <Text>{HourDate(day)}</Text>
          {checked && (
            <Text>{HourDate1(day)}</Text>
          )}
        </List.Accordion>
      </List.Section>
      <Text></Text>
      <List.Section>
        <List.Accordion
          title="Thursday"
          theme={{ colors: { primary: '#fb5b5a' }}}
          onPress ={() => setDay('Thursday')}
          style={{marginTop: -30}}
          left={props => <List.Icon {...props} icon="calendar" />}>
          <Text>{HourDate(day)}</Text>
          {checked && (
            <Text>{HourDate1(day)}</Text>
          )}
        </List.Accordion>
      </List.Section>
      <Text></Text>
      <List.Section>
        <List.Accordion
          title="Friday"
          theme={{ colors: { primary: '#fb5b5a' }}}
          onPress ={() => setDay('Friday')}
          style={{marginTop: -30}}
          left={props => <List.Icon {...props} icon="calendar" />}>
          <Text>{HourDate(day)}</Text>
          {checked && (
            <Text>{HourDate1(day)}</Text>
          )}
        </List.Accordion>
      </List.Section>
      <Text></Text>
      <List.Section>
        <List.Accordion
          title="Saturday"
          theme={{ colors: { primary: '#fb5b5a' }}}
          onPress ={() => setDay('Saturday')}
          style={{marginTop: -30}}
          left={props => <List.Icon {...props} icon="calendar" />}>
          <Text>{HourDate(day)}</Text>
          {checked && (
            <Text>{HourDate1(day)}</Text>
          )}
        </List.Accordion>
      </List.Section>
      </View>
    );
}

export default CheckBoxOpenings;
