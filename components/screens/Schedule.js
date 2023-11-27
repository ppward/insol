import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const itWidth = Dimensions.get('window').width;

export default function Schedule() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>일정 </Text>
      </View>
      <View style={styles.calendarContainer}>
        <Calendar style={{padding: 0, margin: 0, borderRadius: 15}} />
      </View>
      <View
        style={{
          margin: 15,
          width: itWidth * 0.8,
          height: 80,
          borderRadius: 15,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'lightgrey',
        }}>
        <Text>일정 리스트</Text>
      </View>
      <View
        style={{
          width: itWidth * 0.8,
          height: 80,
          borderRadius: 15,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'lightgrey',
        }}>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#B1A8EB',
  },
  headerContainer: {
    width: 150,
    height: 55,
    borderRadius: 15,
    backgroundColor: '#8C7FE1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 26,
  },
  calendarContainer: {
    width: itWidth * 0.8,
    height: 290,
    marginTop: 30,
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'center',
  },
});
