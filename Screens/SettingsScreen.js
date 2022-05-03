import * as React from 'react';
import {Text, View, TouchableOpacity, Dimensions, Image, Switch  } from 'react-native';
import 'react-native-gesture-handler';
import {Feather} from 'react-native-vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
const settingsstack = createStackNavigator();
import {styles} from '../Styles/style'
const { width, height } = Dimensions.get('screen');
import { Card, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';


const SettingsScreen = props => {
  return (

  <settingsstack.Navigator>
    <settingsstack.Screen name="Settings" component={Settings}

    options={({navigation})=>({

 headerLeft:() =>(
    <Feather name='menu' size={25} style={{marginLeft:14}}
    color={'#F60875'}  onPress={()=>navigation.openDrawer()}></Feather>

  )

    })} />
    </settingsstack.Navigator>
)
}


const Settings = (props) => {
  return (
    <View style={{ backgroundColor: "white", height: height, alignItems: "center"}}>
                <View style={{marginTop: "5%"}}>
                  </View>

                  <Card style={{width: width/1.2,  height: 140}}>
                  <View>

                    <Card.Title title="Newsletter"
                    left={
                      () => {
                    let LeftContent = props => <MaterialIcons name="email" size={40} color="#fb5b5a" />
                      return <LeftContent/>
        } }
                    />
                    <Card.Content>
                    <Paragraph style={{fontSize: 15}}>
                    <Text>Activate our newsletter </Text>
                    </Paragraph>
                    <Paragraph style={{fontSize: 15}}>
                    <Text>if you want to stay in touch</Text>
                    </Paragraph>
                    <View style={{marginLeft: width/1.5, marginTop: -50 }}>
                    <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            ios_backgroundColor="#3e3e3e"
                            //onValueChange={()=>setToggle([!toggle[0], toggle[1]])}
                            //value={toggle[0]}
                        />
                    </View>
                    <Paragraph style={{ marginTop: "5%" }}>
                    </Paragraph>
                    </Card.Content>
                  </View>
                </Card>


                <Card style={{width: width/1.2, marginTop: "5%", height: 180  }}
                >
                <View>

                  <Card.Title title="About"
                  left={
                    () => {
                  let LeftContent = props => <Ionicons name="ios-paper" size={40} color="#fb5b5a" />
                    return <LeftContent/>
      } }
                  />
                  <Card.Content>
                  <Paragraph  style={{fontSize: 15}}>
                  <Text>Terms of use</Text>
                  </Paragraph>
                  <View style={{marginTop: -20, marginLeft: "95%" }}>
                  <Ionicons name="ios-arrow-forward" size={20} color="black" />
                  </View>
                  <View
  style={{ borderBottomColor: 'grey', borderBottomWidth: 1, marginTop: 10}}/>
                  <Paragraph style={{marginTop: 10, fontSize: 15}}>
                  <Text>Privacy policy</Text>
                  </Paragraph>
                  <View style={{marginTop: -20, marginLeft: "95%" }}>
                  <Ionicons name="ios-arrow-forward" size={20} color="black" />
                  </View>
                  <Paragraph>
                  </Paragraph>
                  </Card.Content>
                </View>
              </Card>
              <View style={{alignItems: "center"}}>
              <Image style={{width:width/1.8, height: width/2.3, marginTop: "5%"}}  source={require('../assets/sett1.png')} />
              </View>

              <TouchableOpacity  onPress={() => props.navigation.navigate("Login")} style={styles.loginBtn}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
  );

}


export default SettingsScreen;
