import React, {useState, useContext, useEffect} from 'react';
import { StyleSheet, Dimensions, ScrollView, Image, ImageBackground} from 'react-native';
import { Block, Text, theme} from 'galio-framework';
import { Images, nowTheme } from '../constants';
import {IdFriend} from '../Context';
import { createStackNavigator } from '@react-navigation/stack';
import   {Feather}  from  "react-native-vector-icons";
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
  const [id, setId] = useContext(IdFriend);
  const [typeData, setTypeData] = useState({
    Name: '',
    Description: ''
  });

  useEffect(() => {
    db.collection('Clients').doc(id.toString()).get().then(user => {
        const client = user.data();
        setProfileData(client);
        db.collection('Types').doc(client.ID_Type.toString()).get().then(type => {
          setTypeData(type.data())
        })
    });
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
                {profileData &&
                <Image source={{uri: profileData.Photo}} style={styles.avatar} />
                }
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
