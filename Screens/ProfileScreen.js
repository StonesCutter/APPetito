import React, {useState, useContext, useEffect} from 'react';
import { StyleSheet, Dimensions, ScrollView, Alert, Image, ImageBackground, TouchableOpacity} from 'react-native';
import { Block, Text, theme} from 'galio-framework';
import { Images, nowTheme } from '../constants';
import {IdContext } from '../Context';
import { createStackNavigator } from '@react-navigation/stack';
import   {Feather}  from  "react-native-vector-icons";
import { MaterialIcons } from '@expo/vector-icons';
import * as firebase from 'firebase';

const db = firebase.firestore();

const ProfileScreen = () => {
  const Stack = createStackNavigator();
  return(
      <Stack.Navigator initialRouteName="Profile">
        <Stack.Screen name="Profile"component={Profile}
          options={({navigation})=>({
            headerLeft:() =>(
              <Feather name='menu' size={25} style={{marginLeft:14}}
              color={'#F60875'}  onPress={()=>navigation.openDrawer()}></Feather>
            )
          })}/>
      </Stack.Navigator>
  )
}

const { width, height } = Dimensions.get('screen');

const thumbMeasure = (width - 48 - 32) / 3;

const Profile  = ({route, navigation}) => {
  const [profileData, setProfileData] = useState(null);
  const [id, setID] = useContext(IdContext);
  const [typeData, setTypeData] = useState({
    Name: '',
    Description: ''
  });

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
          ); navigation.navigate('UserProfilePicture')
        } else {
            db.collection('Clients').doc(id.toString()).onSnapshot({includeMetadataChanges: true}, (user) => {
              const client = user.data();
              setProfileData(client);
              db.collection('Types').doc(client.ID_Type.toString()).get().then(type => {
                setTypeData(type.data())
              })
            });
          }
        });
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
  }, [])

  return (
    <Block style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
    }} >
      <Block flex={0.6} >
        <ImageBackground
          source={Images.ProfileBackground}
          style={styles.profileContainer}
          imageStyle={styles.profileBackground}
        >
          <Block flex style={styles.profileCard}>
            <Block style={{ position: 'absolute', width: width, zIndex: 5, paddingHorizontal: 20 }}>
              <Block middle style={{ top: height * 0.15 }}>
              <TouchableOpacity onPress={() => navigation.navigate("Upload")}>
                {profileData &&
                <Image source={{uri: profileData.Photo}} style={styles.avatar} />
                }
                </TouchableOpacity>
              </Block>
              <Block style={{ top: height * 0.2 }}>
                <Block middle >
                  <Text
                    style={{
                      marginBottom: theme.SIZES.BASE / 2,
                      fontWeight: '900',
                      fontSize: 26
                    }}
                    color='#ffffff'
                    >
                    {profileData && profileData.FirstName} {profileData && profileData.LastName}
                  </Text>

                  <Text
                    size={16}
                    color="white"
                    style={{
                      marginTop: 5,
                      lineHeight: 20,
                      fontWeight: 'bold',
                      fontSize: 18,
                      opacity: .8
                    }}
                  >
                    {typeData && typeData.Name}
                  </Text>
                </Block>

              </Block>

            </Block>


            <Block
              middle
              row
              style={{ position: 'absolute', width: width, top: height * 0.08 - 22, zIndex: 99, marginLeft: "80%" }}
            >

            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <MaterialIcons name="settings" size={40} color="white" />
            </TouchableOpacity>

            </Block>
          </Block>
        </ImageBackground>


      </Block>
      <Block />
      <Block flex={0.30} style={{ padding: theme.SIZES.BASE}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Block flex >
            <Block middle>
              <Text
                style={{
                  color: '#2c2c2c',
                  fontWeight: 'bold',
                  fontSize: 19,
                  marginBottom: "5%",
                  zIndex: 2
                }}
              >
              Description of the role
              </Text>
              <Text
                size={16}
                muted
                style={{
                  textAlign: 'center',
                  zIndex: 2,
                  lineHeight: 25,
                  color: '#9A9A9A',
                  paddingHorizontal: 15
                }}
              >
               {typeData && typeData.Description}
                  </Text>
            </Block>
          </Block>
        </ScrollView>
      </Block>
    </Block>

  )
}


const styles = StyleSheet.create({

  profileContainer: {
    width,
    height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width,
    height: height * 0.5
  },

  info: {
    marginTop: 30,
    paddingHorizontal: 10,
    height: height * 0.8
  },
  avatarContainer: {
    position: 'relative',
    marginTop: -80
  },
  avatar: {
    width: thumbMeasure,
    height: thumbMeasure,
    borderRadius: 50,
    borderWidth: 0
  },
  nameInfo: {
    marginTop: 35
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure
  },
  social: {
    width: nowTheme.SIZES.BASE * 3,
    height: nowTheme.SIZES.BASE * 3,
    borderRadius: nowTheme.SIZES.BASE * 1.5,
    justifyContent: 'center',
    zIndex: 99,
    marginHorizontal: 5
  }
});

export default ProfileScreen;
