import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Maps from '../components/screens/Maps';
import StudentList from '../components/screens/StudentList';
const Tab = createBottomTabNavigator();
export default function TabNav() {
  return (
    <Tab.Navigator screenOptions={{headerShown:false}}>
      <Tab.Screen name="Map" component={Maps} />
      <Tab.Screen name="StudentList" component={StudentList} />
    </Tab.Navigator>
  );
}
