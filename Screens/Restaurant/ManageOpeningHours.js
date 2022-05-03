import * as React from 'react';
import { Text, View, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import 'react-native-gesture-handler';
import { CheckBoxOpenings } from '../../CheckBoxOpenings';
import {styles} from '../../Styles/style'

const InsertEmailAddress = props => {
  return (

    <SafeAreaView style={styles.container}>
    <ScrollView style={{width: 330}}>


              <View style={{marginTop:40}}>
              <Text style={styles.loginText}>Tell us when would you like to open</Text>
              </View>

                 <CheckBoxOpenings/>

              <View style={{justifyContent:"center",alignItems:"center",}}>
              <TouchableOpacity
                 onPress={() => props.navigation.goBack()}
                 style={styles.loginBtn}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Text style={styles.skip}>Go Back</Text>
              </TouchableOpacity>
              </View>

    </ScrollView>
    </SafeAreaView>
  );
}


export default InsertEmailAddress;
