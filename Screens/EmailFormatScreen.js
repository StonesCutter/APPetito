import React, {useContext, useState, useEffect} from 'react';
import {Text, View, ScrollView, Dimensions, TextInput, TouchableOpacity,
         Alert } from 'react-native';
import {createStackNavigator} from '@react-navigation/stack'
import   {Feather}  from  "react-native-vector-icons";
import { IdContext } from '../Context';
import * as firebase from 'firebase';
import 'firebase/firestore';
const db = firebase.firestore();
import { Card, Paragraph } from 'react-native-paper';
import {styles} from '../Styles/style'
import { AntDesign } from '@expo/vector-icons';
const { width } = Dimensions.get('screen');
import RBSheet from "react-native-raw-bottom-sheet";
import { useRef } from "react";

const EmailFormat = () => {
    const Stack = createStackNavigator();
    return(
        <Stack.Navigator initialRouteName="EmailFormatPage">
          <Stack.Screen name="EmailFormatPage"component={EmailFormatPage}
            options={({navigation})=>({
              headerLeft:() =>(
                <Feather name='menu' size={25} style={{marginLeft:14}}
                color={'#F60875'}  onPress={()=>navigation.openDrawer()}></Feather>
              )
            })}/>
        </Stack.Navigator>
    )
}

const EmailFormatPage = props => {
    const [id, setID] = useContext(IdContext);
    const [message, setMessage] = React.useState('');
    const windowHeight = Dimensions.get('window').height;
    const refRBSheetSendEmail = useRef();
    const [user, setUser] = useState();

    useEffect(() => {
      query();
    }, []);

    const query = () => {
      if (id) {
        db.collection('Clients').doc(id.toString()).get().then(us => {
          setUser(us.data());
        })
      } else {
        Alert.alert(    
          "Login needed",
          'You have to do the login first',  
          [  
              {  
                  text: 'Login', onPress: () => props.navigation.navigate("Login")
              },  
              {text: 'Go Back', onPress: () => props.navigation.goBack()},  
          ]  
      );  
      }
    }

    return (

      <ScrollView style={{ backgroundColor:"white"}}>
      <View style={styles.container}>
              
              <View style={{alignItems: "center"}} >
              <Card style={{width: width/1.2, marginTop: "8%",  }}>
              <View>
                <Card.Content>
                <Paragraph style={{marginTop: "4%"}}>
                <Text style={{fontWeight: "bold"}}>Sender: </Text>
                <Text>    {user && user.FirstName} {user && user.LastName}</Text>
                </Paragraph>
                <Paragraph style={{marginBottom: "4%"}}>
                <Text style={{fontWeight: "bold"}}>Email: </Text>
                <Text>       {user && user.email}</Text>
                </Paragraph>
                </Card.Content>
              </View>
            </Card>
            </View>

                  <TextInput
                      style={{
                          height:200,
                          width: width/1.2,
                          color:"black",
                          textAlignVertical: "top",
                          backgroundColor:"#d9d9d9",
                          borderRadius:5,
                          padding:20,
                          marginTop: "5%"
                        }}
                      placeholder="Message... *"
                      placeholderTextColor="#003f5c"
                      onChangeText={text => setMessage(text)}
                      multiline={true}
                  />

                <TouchableOpacity
                   onPress={() =>{
                    if (message.length==0){
                      Alert.alert('You have to insert a message')
                    } else {
                      refRBSheetSendEmail.current.open()
                    }
                    }}
                   style={styles.loginBtn}>
                  <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>



                <RBSheet
                  ref={refRBSheetSendEmail}
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
                    marginTop: "10%"}}>Your email have been sent!</Text>
                <TouchableOpacity
                   onPress={() => { props.navigation.navigate("ContactUs"); }}
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
                <Text style={styles.buttonText}>continue</Text>
                </TouchableOpacity>
                </View>

                </RBSheet>

      </View>
</ScrollView>
    );
}

export default EmailFormat;
