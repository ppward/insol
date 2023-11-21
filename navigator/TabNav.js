import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Map from '../screen/Parents';
import Schedule from '../components/Schedule';

const Tab = createBottomTabNavigator();

export default function TabNav() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen name="Schedule" component={Schedule} />
    </Tab.Navigator>
  );
}
