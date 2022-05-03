import React from 'react';
import {Text, View,  Dimensions, Image } from 'react-native';
import {createStackNavigator} from '@react-navigation/stack'
import   {Feather}  from  "react-native-vector-icons";
import * as firebase from 'firebase';
import 'firebase/firestore';
const db = firebase.firestore();
import { Card, Paragraph } from 'react-native-paper';
import {styles} from '../Styles/style'
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
const { height } = Dimensions.get('screen');

const ContactUs = () => {
    const Stack = createStackNavigator();
    return(
        <Stack.Navigator initialRouteName="ContactUsPage">
          <Stack.Screen name="ContactUsPage"component={ContactUsPage}
            options={({navigation})=>({
              headerLeft:() =>(
                <Feather name='menu' size={25} style={{marginLeft:14}}
                color={'#F60875'}  onPress={()=>navigation.openDrawer()}></Feather>
              )
            })}/>
        </Stack.Navigator>
    )
}

const ContactUsPage = props => {
    const windowWidth = Dimensions.get('window').width;

    return (
      <View style={{ backgroundColor: "white", height: height}}>
                  <View style={{marginTop: "10%"}}>
                    <Text style={styles.loginText}> Do you need our help? Contact Us! </Text>
                    </View>

                    <Card style={{width: windowWidth/1.2, marginTop: "8%", marginLeft:(windowWidth/100)*8 }}>
                    <View>

                      <Card.Title title="FAQ"
                      left={
                        () => {
                      let LeftContent = props => <AntDesign name="questioncircle" size={40} color="#fb5b5a" />
                        return <LeftContent/>
          } }
                      />
                      <Card.Content>
                      <Paragraph>
                      <Text style={{fontSize: 15}}>Answers to the most frequent questions.</Text>
                      </Paragraph>
                      <Paragraph>
                      </Paragraph>
                      </Card.Content>
                    </View>
                  </Card>


                  <Card style={{width: windowWidth/1.2, marginTop: "5%", marginLeft:(windowWidth/100)*8,  }}
                  onPress={() => props.navigation.navigate("EmailFormat")}
                  >
                  <View>

                    <Card.Title title="Email"
                    left={
                      () => {
                    let LeftContent = props => <MaterialIcons name="email" size={40} color="#fb5b5a" />
                      return <LeftContent/>
        } }
                    />
                    <Card.Content>
                    <Paragraph>
                    <Text style={{fontSize: 15}}>Send us a message and we will answer as soon as possible.</Text>
                    </Paragraph>
                    <Paragraph>
                    </Paragraph>
                    </Card.Content>
                  </View>
                </Card>
                <View style={{alignItems: "center", height: "90%"}}>
                <Image style={{width:"50%", height: "35%", marginTop: "5%"}} source={require('../assets/faq1.png')} />
                </View>
              </View>
    );
}

export default ContactUs;
