import 'react-native-gesture-handler';
import { Text, View, ScrollView, Dimensions, Alert} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import * as firebase from 'firebase';
import 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import   {Feather}  from  "react-native-vector-icons";
import { Button, Card, Paragraph } from 'react-native-paper';
import { IdContext } from '../Context';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Progress from 'react-native-progress'

const db = firebase.firestore();

const GoalScreen = () => {
  const Stack = createStackNavigator();
  return(
      <Stack.Navigator initialRouteName="Goals">
        <Stack.Screen name="Goals"component={GoalPage}
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


const GoalPage = (props) => {

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const pushStatus = (idMission) => {
    db.collection('Clients').doc(id.toString()).collection('Missions').get().then(docMiss => {
      docMiss.docs.map(miss => {
        if (miss.data().ID_Mission == '/Missions/'+idMission) {
          db.collection('Clients').doc(id.toString()).collection('Missions').doc(miss.id).update({
            Status: 'In Progress'
          })
          db.collection('Clients').doc(id.toString()).collection('Missions').get().then(dM => {
            dM.docs.map(data => {
              setStatus(s => [...s, data.data().Status])
            })
          })
        }
      })
    })
  }

  const pushPoints = (missionID) => {
    db.collection('Clients').doc(id.toString()).collection('Missions').get().then(docMiss => {
      docMiss.docs.map(miss => {
        if (miss.data().ID_Mission == '/Missions/'+missionID) {
          db.collection('Clients').doc(id.toString()).collection('Missions').doc(miss.id).update({
            Status: 'Completed'
          })
          db.collection('Clients').doc(id.toString()).collection('Missions').get().then(dM => {
            dM.docs.map(data => {
              setStatus(s => [...s, data.data().Status])
            })
          })
          db.collection('Missions').doc(missionID.toString()).get().then(m => {
            const newPoints = points + m.data().Points;
            db.collection('Clients').doc(id.toString()).update({
              Points: newPoints
            })
          })
        }
      })
    })
  }

  const MyComponent = () => {
    return(
      <Text> {missions && status && missions.map((mission, i) => {
        return (
          <Card style={{width: windowWidth}}>
          <View>
          <View key={i}>
          <Card.Cover source = {{ uri: mission.Photo }}/>
            <Card.Content>
              <Paragraph>{mission.Description}</Paragraph>
              <Paragraph style={{alignItems:"center"}}>
                {mission.Name === 'Più siamo meglio è' && (
                  <View>
                  <Progress.Bar progress={count1/tot1} width={windowWidth-30} height={10} color={col1} key={1}/>
                  {col1 === 'orange' && status[i] == 'To Do' ? pushStatus(1) : null }
                  {col1 === 'green' && (status[i] == 'In Progress' || status[i] == 'To Do') ? pushPoints(1) : null }
                  </View>
                )}
                {mission.Name === 'Dove andiamo oggi?' && (
                  <View>
                  <Progress.Bar progress={count2/tot2} width={windowWidth-30} height={10} color={col2} key={2}/>
                  {col2 === 'orange' && status[i] == 'To Do' ? pushStatus(2) : null }
                  {col2 === 'green' && points && (status[i] == 'In Progress' || status[i] == 'To Do') ? pushPoints(2) : null }
                  </View>
                )}
                {mission.Name === 'Ho voglia di cambiare!' &&(
                  <View>
                  <Progress.Bar progress={count3/tot3} width={windowWidth-30} height={10} color={col3} key={3}/>
                  {col3 === 'orange' && status[i] == 'To Do' ? pushStatus(3) : null }
                  {col3 === 'green' && (status[i] == 'In Progress' || status[i] == 'To Do') ? pushPoints(3) : null }
                  </View>
                )}
                {mission.Name === 'Attento al portafoglio!' &&(
                  <View>
                  <Progress.Bar progress={count4/tot4} width={windowWidth-30} height={10} color={col4} key={4}/>
                  {col4 === 'orange' && status[i] == 'To Do' ? pushStatus(4) : null }
                  {col4 === 'green' && (status[i] == 'In Progress' || status[i] == 'To Do') ? pushPoints(4) : null }
                  </View>
                )}

              </Paragraph>
            </Card.Content>
            <Card.Actions>
            <Button><FontAwesome5 name="coins" size={24} color="orange" /></Button>
            <Text>{mission.Points}</Text>
            </Card.Actions>
          </View>
        </View>
        </Card>
        )
  })} </Text>
    )

}

  const [id, setId] = useContext(IdContext);
  const [points, setPoints] = useState(0);
  const [missions, setMissions] = useState([]);
  const [status, setStatus] = useState([]);
  const [count1, setCount1] = useState(0);
  const [col1, setCol1] = useState('grey');
  const [tot1, setTot1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [col2, setCol2] = useState('grey');
  const [tot2, setTot2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [col3, setCol3] = useState('grey');
  const [tot3, setTot3] = useState(0);
  const [count4, setCount4] = useState(0);
  const [col4, setCol4] = useState('grey');
  const [tot4, setTot4] = useState(0);
  const [missionID, setMissionID] = useState();

  const mission1 = () => {
    //Effettua 5 prenotazioni con almeno 4 commensali per ogni prenotazione
    setTot1(5);
    setCount1(0);
    setCol1('grey');
    var c = 0;
    db.collection('Bookings').onSnapshot(data => {
        data.docChanges().map(doc => {
            if (doc.doc.data().ID_Client === id && doc.doc.data().People >= 4){
              c = c + 1;
              setCol1('orange')
              if (c >= 5) setCol1('green');
              setCount1(c);
            }
        });
    });
  }

  const mission2 = () => {
    //Effettua 10 prenotazioni in 10 ristoranti diversi
    setTot2(10);
    setCount2(0);
    setCol2('grey');
    const temp = [];
    db.collection('Bookings').onSnapshot(doc => {
        doc.docChanges().map((bookDoc) => {
            if (bookDoc.doc.data().ID_Client == id) {
                const branchName = bookDoc.doc.data().ID_Branch;
                if (!temp.includes(branchName)){
                    temp.push(branchName);
                    setCol2('orange');
                    if (temp.length >= 10) setCol2('green')
                    setCount2(c => temp.length);
                }
            }
        });
    });
  }

  const mission3 = () => {
    //Effettua 10 prenotazioni
    setTot3(10);
    setCol3('grey');
    setCount3(0);
    var c = 0;
    db.collection('Bookings').onSnapshot(data => {
        data.docChanges().map(doc => {
            if (doc.doc.data().ID_Client == id) {
              c = c + 1;
              setCol3('orange');
              if (c>=10) setCol3('green');
              setCount3(c => c + 1)
            };
        });
    });
  }

  const mission4 = () => {
    //Spendi un totale di 200€ tra tutte le prenotazioni
    setTot4(200);
    setCount4(0);
    setCol4('grey');
    var c = 0;
    db.collection('Bookings').onSnapshot(doc => {
        doc.docChanges().map((bookDoc) => {
            if (bookDoc.doc.data().ID_Client == id) {
              c = c + bookDoc.doc.data().Price;
              setCol4('orange');
              if (c>=200) setCol4('green')
              setCount4(c)
            }
        });
    });
  }

  useEffect(() => {
    if (id) {
      db.collection('Clients').doc(id.toString()).get().then(user => {
        if (!user.data().FirstName) {
          Alert.alert(
            'You have to complete the registration first'
          ); props.navigation.navigate('UserNameSurname');
        } else if (!user.data().ID_Type) {
          Alert.alert(
            'You have to complete the registration first'
          ); props.navigation.navigate('ChooseCategory');
        } else {
          handlClick();
          mission1();
          mission2();
          mission3();
          mission4();
          userPoints();
      }});
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
  }, []);

  const userPoints = () => {
    db.collection('Clients').doc(id.toString()).onSnapshot(user => {
      setPoints(user.data().Points);
    })
  }

  const handlClick = () => {
    setMissions([]);
      db.collection('Clients/' + id + '/Missions').get().then(data => {
          data.docs.map(doc => {
              const s = doc.data().Status;
              setStatus(sts => [...sts, s]);
              db.doc(doc.data().ID_Mission).get().then(missionsData => {
                  setMissions(msns => [...msns, missionsData.data()]);
              });
          });
      });
  }

  return (
    <ScrollView>
    <View>

    <Card style={{width: windowWidth/1.1, marginLeft: windowWidth/24, marginTop: windowHeight/35, borderRadius: 60}}>
      <Card.Content>
        <View style={{alignItems: "center"}}>
        <Text style={{fontSize: 17, fontWeight: "bold"}}> Scores available to be used:   {points} <FontAwesome5 name="coins" size={24} color="orange" /></Text>
        </View>
      </Card.Content>
      <Card.Actions>
      </Card.Actions>
  </Card>
      <MyComponent/>
    </View>
    </ScrollView>
  );
}


export default GoalScreen;
