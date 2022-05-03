import React, {useState, useEffect} from 'react';
import { Text, View, TextInput, TouchableOpacity, SafeAreaView, Image, Platform, ScrollView, CheckBox, Picker, Alert, Dimensions} from 'react-native';
import 'react-native-gesture-handler';
import {styles} from '../../Styles/style'
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import * as Progress from 'react-native-progress';
import 'firebase/firestore';
import NumericInput from 'react-native-numeric-input'
import {IdRestaurant} from '../../Context'
import RBSheet from "react-native-raw-bottom-sheet";
import { useRef } from "react";
const db = firebase.firestore();



const InsertDishScreen = props => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [isSelected1, setSelection1] = React.useState(false);
  const [isSelected2, setSelection2] = React.useState(false);
  const [isSelected3, setSelection3] = React.useState(false);
  const [isSelected4, setSelection4] = React.useState(false);
  const [isSelected5, setSelection5] = React.useState(false);
  const [isSelected6, setSelection6] = React.useState(false);
  const [course, setCourse] = useState('Choose the course');
  const [calories, setCalories] = React.useState(0);
  const [amount, setAmount] = React.useState(0);
  const [idRest, setIdRest] = React.useContext(IdRestaurant);
  const refRBSheetInsertPic = useRef();
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert(
        'You have to choose an image first'
      );
    } else {
      const uri = image;
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      setUploading(true);
      setTransferred(0);
      const response = await fetch(uploadUri)
      const blob = await response.blob()
      const task = firebase.storage()
        .ref(filename)
        .put(blob);
      // set progress state
      task.on('state_changed', snapshot => {
        setTransferred(
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
        );
      });
      try {
        await task;
        const dish = db.collection('Restaurants').doc(idRest.toString()).collection('Dishes')
        const dishSize = (await dish.get()).size +1;
        firebase.storage().ref(filename).getDownloadURL().then((url)=>{
          firebase.firestore().collection('Restaurants').doc(idRest.toString()).collection('Dishes').doc(dishSize.toString()).update({
              Photo: url
            })
            refRBSheetInsertPic.current.close();
        })

      } catch (e) {
        console.error(e);
      }
      setUploading(false);
      Alert.alert(
        'Photo uploaded!',
        'Your photo has been uploaded to Firebase Cloud Storage!'
      );
      }
};

  async function pushDish(vegan, noLactose, vegetarian, glutenFree, dryFruit, fish) {
    const dish = db.collection('Restaurants').doc(idRest.toString()).collection('Dishes')
    const dishSize = (await dish.get()).size +1;
    await dish.doc(dishSize.toString()).set({
      Name: name,
      Description: description,
      Course: course,
      Kcal: calories,
      Price: amount,
    })

    const x = dishSize;

    if (vegan) {
      const d = db.collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').collection('Category').doc('Vegan')
      const veg = d.collection('Dishes');
      const vegSize = (await veg.get()).size+1;
      await veg.doc(vegSize.toString()).set({
        ID_Dish: x
      })
      await d.set({
        T: "a"
      })
    }
    if (noLactose){
      const d = db.collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').collection('Category').doc('Senza Lattosio')
      const noLact = d.collection('Dishes');
      const noLactSize = (await noLact.get()).size+1;
      await noLact.doc(noLactSize.toString()).set({
        ID_Dish: x
      })
      await d.set({
        T: "a"
      })
    }
    if (vegetarian) {
      const d = db.collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').collection('Category').doc('Vegetarian')
      const veg = d.collection('Dishes');
      const vegSize = (await veg.get()).size+1;
      await veg.doc(vegSize.toString()).set({
        ID_Dish: x
      })
      await d.set({
        T: "a"
      })
    }
    if (glutenFree) {
      const d = db.collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').collection('Category').doc('Gluten Free')
      const gluFree = d.collection('Dishes');
      const gluFreeSize = (await gluFree.get()).size+1;
      await gluFree.doc(gluFreeSize.toString()).set({
        ID_Dish: x
      })
    }
    if (dryFruit) {
      const d = db.collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').collection('Category').doc('Senza Frutta Secca')
      const dryFru = d.collection('Dishes');
      const dryFruSize = (await dryFru.get()).size+1;
      await dryFru.doc(dryFruSize.toString()).set({
        ID_Dish: x
      })
      await d.set({
        T: "a"
      })
    }
    if (fish) {
      const d = db.collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').collection('Category').doc('Pesce')
      const fish = d.collection('Dishes');
      const fishSize = (await fish.get()).size+1;
      await fish.doc(fishSize.toString()).set({
        ID_Dish: x
      })
      await d.set({
        T: "a"
      })
    }
    props.navigation.navigate('InsertMenu', {dishName:name});
  }



  return (

    <SafeAreaView style={styles.container}>
    <ScrollView style={ styles.boxOne }>

    <View style={styles.container}>
    <View style={{height: "100%" ,alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
              <Text style={styles.loginText}>Insert the name of the dish *</Text>
              <View style={styles.inputView} >

                <TextInput
                  style={styles.inputText}
                  placeholder="Name of the dish... *"
                  placeholderTextColor="#003f5c"
                  onChangeText={text => setName(text)}
                  />
              </View>

              <Text style={styles.loginText}>Insert the description of the dish *</Text>
              <View style={styles.inputView} >

                <TextInput
                  style={styles.inputText}
                  placeholder="Description of the dish... *"
                  placeholderTextColor="#003f5c"
                  onChangeText={text => setDescription(text)}
                  />
              </View>
             <Text style={styles.loginText}>Choose the course *</Text>
              <Picker
                      selectedValue={course}
                      style={{ height: 50, width: 180 }}
                      onValueChange={(itemValue, itemIndex) => setCourse(itemValue)}
                    >
                      <Picker.Item label="Choose course" value="js"/>
                      <Picker.Item label="Starter course" value="Starter course"/>
                      <Picker.Item label="First course" value="First course" />
                      <Picker.Item label="Second course" value="Second course" />
                      <Picker.Item label="Single dish" value="Single dish" />
                      <Picker.Item label="Side dish" value="Side dish" />
                      <Picker.Item label="Dessert" value="Dessert" />

              </Picker>


              <Text style={styles.loginText}> What category is it?</Text>
                <View style={{alignItems:"center", marginTop: 20, marginBottom: 20}}>
                <View style={styles.itemColumns}>

                <View style={{flexDirection: "row", alignItems:"center"}}>
                <CheckBox
                          value={isSelected1}
                          onValueChange={setSelection1}
                          style={styles.checkbox}
                        />
                <Text style={{margin: 8,  color:"black"}}>Vegan        </Text>
                <CheckBox
                          value={isSelected4}
                          onValueChange={setSelection4}
                          style={styles.checkbox}
                        />
                <Text style={{margin: 8,  color:"black"}}>Gluten Free</Text>

                </View>

                <View style={{flexDirection: "row", alignItems:"center"}}>
                <CheckBox
                          value={isSelected2}
                          onValueChange={setSelection2}
                          style={styles.checkbox}
                        />
                <Text style={{margin: 8,  color:"black"}}>No lactose</Text>
                <CheckBox
                          value={isSelected5}
                          onValueChange={setSelection5}
                          style={styles.checkbox}
                        />
                <Text style={{margin: 8,  color:"black"}}>Dry Fruit</Text>
                </View>

                <View style={{flexDirection: "row", alignItems:"center"}}>
                <CheckBox
                          value={isSelected3}
                          onValueChange={setSelection3}
                          style={styles.checkbox}
                        />
                <Text style={{margin: 8,  color:"black"}}>Vegetarian</Text>
                           <CheckBox
                          value={isSelected6}
                          onValueChange={setSelection6}
                          style={styles.checkbox}
                        />
                <Text style={{margin: 8,  color:"black"}}>Fish</Text>
                </View>
                </View>
              </View>

                <Text style={styles.loginText}>Choose the price *</Text>

                  <View style={{marginBottom: 20, marginTop: 20}}>
                  <NumericInput
                              value={amount}
                              onChange={value => setAmount(value)}
                              onLimitReached={(isMax,msg) => console.log(isMax,msg)}
                              totalWidth={360}
                              totalHeight={50}
                              iconSize={50}
                              step={50}
                              valueType='real'
                              rounded
                              textColor='#B0228C'
                              iconStyle={{ color: 'white' }}
                              rightButtonBackgroundColor='#EA3788'
                              leftButtonBackgroundColor='#E56B70'
                              minValue={1}
                              maxValue={10000}
                              />
                    <View style={{backgroundColor: "white", height: 50, width: 108, marginTop: -50}} ></View>
                    <View style={{backgroundColor: "white", height: 50, width: 108, marginTop: -50, marginLeft: 252}}>
                    <Text style={{
                      fontSize:20,
                      color:"black",
                      alignItems:"center",
                      marginTop: 10,
                      marginLeft: 10
                    }}>€</Text>
                    </View>
                </View>

                <Text style={styles.loginText}>Insert the kcal of the dish *</Text>
                <View style={{marginTop: 20}}>
                <NumericInput
                            value={calories}
                            onChange={value => setCalories(value)}
                            onLimitReached={(isMax,msg) => console.log(isMax,msg)}
                            totalWidth={240}
                            totalHeight={50}
                            iconSize={25}
                            step={50}
                            valueType='real'
                            rounded
                            textColor='#B0228C'
                            iconStyle={{ color: 'white' }}
                            rightButtonBackgroundColor='#EA3788'
                            leftButtonBackgroundColor='#E56B70'
                            minValue={1}
                            maxValue={10000}
                            />
                  </View>

                  <TouchableOpacity
                  onPress={() => refRBSheetInsertPic.current.open()} style={styles.loginBtn}>
                  <Text style={styles.buttonText}>Add a picture</Text>
                  </TouchableOpacity>

              <View style={{marginTop: -20}}>
              <TouchableOpacity
              onPress={() => {
                if (!name) {
                  Alert.alert("You have to choose a Name")
                } else if (!description){
                  Alert.alert("You have to choose a Description")
                } else if (course=='Choose the course'){
                  Alert.alert("You have to choose a Course")
                } else if (amount == 0) {
                  Alert.alert("You have to insert Price")
                } else if (calories == 0) {
                  Alert.alert("You have to insert Calories")
                } else if (!image) {
                  Alert.alert("You have to choose an Image")
                } else {
                pushDish(isSelected1, isSelected2, isSelected3, isSelected4, isSelected5, isSelected6)}}} style={styles.loginBtn}>
              <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
              <View style={{marginTop: 50}}></View>
              </View>

        </View>
        </View>

        <RBSheet
          ref={refRBSheetInsertPic}
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
        <View style={{marginTop: "19%"}}>
          <Text style={styles.loginText}>Choose a picture</Text>
        </View>
        <View style={{marginTop: "5%", alignItems: "center"}}>
        <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick an image</Text>
        </TouchableOpacity></View>
        <View style={styles.imageContainer}>
          {image !== null ? (
            <Image source={{ uri: image }} style={styles.imageBox} />
          ) : null}
          <Text> </Text>
          {uploading ? (
            <View style={styles.progressBarContainer}>
              <Progress.Bar progress={transferred} width={300} />
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={() => uploadImage()}>
              <Text style={styles.buttonText}>Upload image</Text>
            </TouchableOpacity>

          )}
          <TouchableOpacity onPress={() => refRBSheetInsertPic.current.close()}>
          <Text style={styles.skip}>Go Back</Text>
          </TouchableOpacity>
          <Image style={{width:windowWidth/2, height: windowHeight/3.2, marginTop: "26%"}} source={require('../../assets/RestaurantPic.png')} />
        </View>
        </RBSheet>

        </ScrollView>
        </SafeAreaView>
  );
}

export default InsertDishScreen;
