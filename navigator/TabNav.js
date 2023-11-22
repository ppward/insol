import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Maps from '../components/screens/Maps';
import Schedule from '../components/screens/Schedule';
const Tab = createBottomTabNavigator();
export default function TabNav() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Map" component={Maps} />
      <Tab.Screen name="Schedule" component={Schedule} />
    </Tab.Navigator>
  );
}
