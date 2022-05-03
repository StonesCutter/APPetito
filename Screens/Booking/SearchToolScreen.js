import React, {useState, useEffect} from 'react';
import {SafeAreaView, Text, View, TouchableOpacity, Dimensions, Image} from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {createStackNavigator} from '@react-navigation/stack'
import {styles} from '../../Styles/style'
import {Keyboard, TouchableWithoutFeedback} from 'react-native'
import firebase from 'firebase'
const db = firebase.firestore();
const { width, height } = Dimensions.get('screen');

const SearchScreenTool = () => {
  const Stack = createStackNavigator();
  return(
      <Stack.Navigator initialRouteName="Search">
        <Stack.Screen name="Search"component={SearchScreen}
          //drawer button
          options={({navigation})=>({
            headerLeft:() =>(
              <Feather name='menu' size={25} style={{marginLeft:14}}
              color={'#F60875'}  onPress={()=>navigation.openDrawer()}></Feather>
            )
          })}/>
      </Stack.Navigator>
  )
}

const SearchScreen = props => {
  const [addr, setAddr] = useState([]);
  const [name, setName] = useState([]);

  useEffect(() => {
      query();
  }, []);

  const query = () => {
    var id=0;
    const nam = '';
    setAddr([]);
    setName([]);
    db.collection('Restaurants').get().then(docRes => {
      docRes.docs.map(res => {
        const docRest = res.id;
        db.collection('Restaurants').doc(docRest).collection('Branch').get().then(docBr => {
          docBr.docs.map(branch => {
            const b = branch.data().Address;
            const n = branch.data().Name;
            id = id+1;
            setAddr(ald => [...ald, {name: b, id}]);
            setName(nam => [...nam, {name: n, id}]);
          })
        })
      })
    })
  }

  return (

    <SafeAreaView style={styles.container}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{flex: 1}} onPress={Keyboard.dismiss}>
      <View style={styles.containerBar}>
      <View style={{marginTop: "10%"}}>
        <Text style={styles.loginText}>
          Search a specific restaurant
        </Text>
        </View>
        <SearchableDropdown
          onTextChange={(text) => console.log(text)}
          onItemSelect={(item) => {Keyboard.dismiss; props.navigation.navigate('Booking', {filter: item})}}
          containerStyle={{padding: 5}}
          // Suggestion container style
          textInputStyle={{
            // Inserted text style
            padding: 8,
            borderWidth: 1,
            borderColor: '#ccc',
            backgroundColor: '#FAF7F6',
            borderRadius: 5
          }}
          itemStyle={{
            // Single dropdown item style
            padding: 8,
            marginTop: 2,
            backgroundColor: '#FAF9F8',
            borderColor: '#bbb',
            borderWidth: 1,
          }}
          itemTextStyle={{
            // Text style of a single dropdown item
            color: '#222',
          }}
          itemsContainerStyle={{
            // Items container style you can pass maxHeight
            // To restrict the items dropdown hieght
            maxHeight: '100%',
          }}
          items={name && name}
          // Mapping of item array
          placeholder="What..."
          // Place holder for the search input
          resetValue={false}
          // Reset textInput Value with true and false state
          underlineColorAndroid="transparent"
          // To remove the underline from the android input
        />
        <Text style={styles.loginText}>
        Search by area
        </Text>
        <SearchableDropdown
          onTextChange={(text) => console.log(text)}
          // onItemSelect={(item) => {Keyboard.dismiss; props.navigation.navigate('Booking1')}}
            onItemSelect={(item) => {Keyboard.dismiss; props.navigation.navigate('Booking', {filter: item})}}

          // Called after the selection from the dropdown
          containerStyle={{padding: 5}}
          // Suggestion container style
          textInputStyle={{
            // Inserted text style
            padding: 12,
            borderWidth: 1,
            borderColor: '#ccc',
            backgroundColor: '#FAF7F6',
            borderRadius: 5
          }}
          itemStyle={{
            // Single dropdown item style
            padding: 10,
            marginTop: 2,
            backgroundColor: '#FAF9F8',
            borderColor: '#bbb',
            borderWidth: 1,
          }}
          itemTextStyle={{
            // Text style of a single dropdown item
            color: '#222',
          }}
          itemsContainerStyle={{
            // Items container style you can pass maxHeight
            // To restrict the items dropdown hieght
            maxHeight: '100%',
          }}
          items={addr && addr}
          // Mapping of item array
          placeholder="Where..."
          // Place holder for the search input
          resetValue={false}
          // Reset textInput Value with true and false state
          underlineColorAndroid="transparent"
          // To remove the underline from the android input
        />
        < View style={{alignItems: "center"}}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("Booking")}
          style={styles.loginBtn}>
          <Text style={styles.buttonText}>Search all</Text>
        </TouchableOpacity>
        </View>

<Image style={{width:width/1.2, height: width/1.8, marginTop: "15%"}} source={require('../../assets/searchFood.png')} />

      </View>
      </View>
    </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};



export default SearchScreenTool;
