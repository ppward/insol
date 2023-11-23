import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';
import Maps from '../components/screens/Maps';
import Schedule from '../components/screens/Schedule';
import StudentList from '../components/screens/StudentList';
const Tab = createBottomTabNavigator();
export default function TabNav() {
  return (
    <Tab.Navigator initialRouteName="Map" screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="StudentsList"
        component={StudentList}
        options={{
          tabBarIcon: () => (
            <Image
              style={{width: 30, height: 30}}
              source={require('../assets/customer.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={Maps}
        options={{
          tabBarIcon: () => (
            <Image
              style={{width: 30, height: 30}}
              source={require('../assets/boy.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={Schedule}
        options={{
          tabBarIcon: () => (
            <Image
              style={{width: 30, height: 30}}
              source={require('../assets/calendar.png')}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
