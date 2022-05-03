import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Booking1Screen from '../Screens/Booking/Booking1Screen';
import MakeReservationScreen from '../Screens/Booking/MakeReservationScreen';
import SearchToolScreen from '../Screens/Booking/SearchToolScreen';
import MenuScreen from '../Screens/Restaurant/MenuRestaurant';
import UserNameSurnameScreen from '../Screens/Registration/UserNameSurnameScreen';
import ChooseCategoryScreen from '../Screens/Registration/ChooseCategoryScreen';
import UserProfilePictureScreen from '../Screens/Registration/UserProfilePictureScreen';
import SearchScreen from '../Screens/SearchScreen';
import StatsScreen from '../Screens/StatsScreen';
import GoalScreen from '../Screens/GoalsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileScreen from '../Screens/ProfileScreen';
import SettingsScreen from '../Screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';
import UploadScreen from '../Components/Upload';
import MyReviews from '../Screens/Client/MyReviews'
import MyFavourites from '../Screens/Client/MyFavourites'
import MyBookings from '../Screens/Client/MyBookings'
import RestaurantPage from '../Screens/Restaurant/RestaurantPage'
import ContactUs from '../Screens/ContactUsScreen';
import EmailFormat from '../Screens/EmailFormatScreen';
import Friend from '../Screens/Client/Friends';
import MenuBook from '../Screens/Booking/MenuBook';
import MakeReview from '../Screens/Client/MakeReview';
import FriendProfile from '../Screens/FriendProfile';

const ClientNavigator = () => {
    const Stack = createStackNavigator();

    return(
        <Stack.Navigator initialRouteName="Skip">
          <Stack.Screen name="MenuBook"component={MenuBook} />
          <Stack.Screen name="MakeReview"component={MakeReview} />
          <Stack.Screen name="Upload"component={UploadScreen} />
          <Stack.Screen name="Menu"component={MenuScreen} />
          <Stack.Screen name='Skip' component = {DrawerNavigator} options={{headerShown: false}}/>
          <Stack.Screen name="UserNameSurname"component={UserNameSurnameScreen} options={{headerShown: false}}/>
          <Stack.Screen name="ChooseCategory"component={ChooseCategoryScreen}/>
          <Stack.Screen name="FriendProfile"component={FriendProfile}/>
          <Stack.Screen name="SearchTool"component={SearchToolScreen}/>
          <Stack.Screen name="Booking"component={Booking1Screen}/>
          <Stack.Screen name="Settings"component={SettingsScreen}/>
          <Stack.Screen name="UserProfilePicture"component={UserProfilePictureScreen} />
          <Stack.Screen name="RestaurantPage"component={RestaurantPage} />
          <Stack.Screen name="EmailFormat"component={EmailFormat} />
          <Stack.Screen name="MakeReservation"component={MakeReservationScreen} />
        </Stack.Navigator>
    )
}

const TabNav = () => {
    const Tab = createBottomTabNavigator();
    return(
        <Tab.Navigator

        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
         let iconName;
         if (route.name === 'Search') {
            iconName = focused
            ? 'ios-search'
            : 'ios-search';
          } else if (route.name === 'Goals') {
            iconName = focused
            ? 'md-locate'
            : 'md-locate';
          }

          else if (route.name === 'Profile') {
            iconName = focused
            ? 'md-contact'
            : 'md-contact';
          }
          else if (route.name === 'Future Develop') {
            iconName = focused
            ? 'md-git-branch'
            : 'md-git-branch';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
                  },
                })}
                tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
                }}

        initialRouteName="Search">

          <Tab.Screen name="Search"component={SearchScreen}/>
          <Tab.Screen name="Future Develop"component={StatsScreen}/>
          <Tab.Screen name="Goals"component={GoalScreen} />
          <Tab.Screen name="Profile"component={ProfileScreen} />
        </Tab.Navigator>
    )
}

const DrawerNavigator = () => {
  const Drawer = createDrawerNavigator();
  return(
    <Drawer.Navigator>
    <Drawer.Screen name="HomeScreen"component={TabNav}/>
    <Drawer.Screen name="ContactUs"component={ContactUs}/>
    <Drawer.Screen name="MyBookings"component={MyBookings}/>
    <Drawer.Screen name="MyReviews"component={MyReviews}/>
    <Drawer.Screen name="MyFavourites"component={MyFavourites}/>
    <Drawer.Screen name="InviteAFriend"component={Friend}/>
  </Drawer.Navigator>
  )
}


export default ClientNavigator;
