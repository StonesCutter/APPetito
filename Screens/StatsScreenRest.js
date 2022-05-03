import * as React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, TextInput, Dimensions, ScrollView} from 'react-native';
const searchstack=createStackNavigator();
import { createStackNavigator } from '@react-navigation/stack';
import   {Feather}  from  "react-native-vector-icons";
const { width, height } = Dimensions.get('screen');
import { Card, Paragraph } from 'react-native-paper';

const StatsScreen = props => {
  return (

  <searchstack.Navigator>
    <searchstack.Screen name="Stats" component={StatScreen}

    options={({navigation})=>({

 headerLeft:() =>(
    <Feather name='menu' size={25} style={{marginLeft:14}}
    color={'#F60875'}  onPress={()=>navigation.openDrawer()}></Feather>

  )

    })} />
    </searchstack.Navigator>
)
}

function StatScreen({navigation}){
  const [name, SetName] = React.useState("default");
    return (
      <ScrollView>

      <Card style={{width: width-40 ,marginTop: "5%", backgroundColor: "white", marginLeft: 20, marginRight: 20}}>
      <Card.Title title="Reputation system "/>
      <Image style={{
      width: width-40,
      height: height/6}}
      source={require('../assets/reputation.png')} />
      <View  horizontal={true} pagingEnabled={false}>
      <Card.Content>
          <View style={{width: width }}>
          <Text style={{fontSize: 17, marginLeft: 5, marginTop: 10, width: width-40, marginBottom: 30}}>
          To improve client experience with:</Text>

    <View style={ styles.row }>
    <View style={ styles.bullet }>
    <Text>{'\u2022' + " "}</Text>
    </View>
    <View style={ styles.bulletText }>
    <Text style={{fontSize: 17}}>reputation points</Text>
    </View>
    </View>

    <View style={ styles.row }>
    <View style={ styles.bullet }>
    <Text>{'\u2022' + " "}</Text>
    </View>
    <View style={ styles.bulletText }>
    <Text style={{fontSize: 17}}>trust badges</Text>
    </View>
    </View>

    <View style={ styles.row }>
    <View style={ styles.bullet }>
    <Text>{'\u2022' + " "}</Text>
    </View>
    <View style={ styles.bulletText }>
    <Text style={{fontSize: 17, marginBottom: 30}}>priority customer</Text>
    </View>
    </View>

      </View>
      </Card.Content>
      </View>
      </Card>

      <Card style={{width: width-40 ,marginTop: "5%", backgroundColor: "white", marginLeft: 20, marginRight: 20}}>
      <Card.Title title="Social networks "/>
      <Image style={{
      width: width-40,
      height: height/6}}
      source={require('../assets/social-media.jpg')} />
      <View  horizontal={true} pagingEnabled={false}>
      <Card.Content>
          <View style={{width: width }}>
          <Text style={{fontSize: 17, marginLeft: 5, marginTop: 10, width: width-40, marginBottom: 30}}>
        Connecting more socials to the app:</Text>

    <View style={ styles.row }>
    <View style={ styles.bullet }>
    <Text>{'\u2022' + " "}</Text>
    </View>
    <View style={ styles.bulletText }>
    <Text style={{fontSize: 17}}>To share contents easier</Text>
    </View>
    </View>

    <View style={ styles.row }>
    <View style={ styles.bullet }>
    <Text>{'\u2022' + " "}</Text>
    </View>
    <View style={ styles.bulletText }>
    <Text style={{fontSize: 17}}>To invite more people to join</Text>
    </View>
    </View>

    <View style={ styles.row }>
    <View style={ styles.bullet }>
    <Text>{'\u2022' + " "}</Text>
    </View>
    <View style={ styles.bulletText }>
    <Text style={{fontSize: 17, marginBottom: 30}}>Increase visibility of restaurants</Text>
    </View>
    </View>


      </View>
      </Card.Content>
      </View>
      </Card>


      <Card style={{width: width-40 ,marginTop: "5%",marginBottom: "5%", backgroundColor: "white", marginLeft: 20, marginRight: 20}}>
      <Card.Title title="Choose the seat "/>
      <Image style={{
      width: width-40,
      height: height/6}}
      source={require('../assets/360.jpg')} />
      <View  horizontal={true} pagingEnabled={false}>
      <Card.Content>
          <View style={{width: width }}>
          <Text style={{fontSize: 17, marginLeft: 5, marginTop: 10, width: width-40, marginBottom: 30}}>
        Allows the user to choose a seat:</Text>

    <View style={ styles.row }>
    <View style={ styles.bullet }>
    <Text>{'\u2022' + " "}</Text>
    </View>
    <View style={ styles.bulletText }>
    <Text style={{fontSize: 17}}>Upload 360° pictures of halls</Text>
    </View>
    </View>

    <View style={ styles.row }>
    <View style={ styles.bullet }>
    <Text>{'\u2022' + " "}</Text>
    </View>
    <View style={ styles.bulletText }>
    <Text style={{fontSize: 17,  marginBottom: 30}}>Choose place to reserve</Text>
    </View>
    </View>

      </View>
      </Card.Content>
      </View>
      </Card>

      </ScrollView>
    );
  }

export default StatsScreen;
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    flex: 1,
    marginLeft: 20,
  },
  bullet: {
    width: 10
  },
  bulletText: {
    flex: 1
  }
});
