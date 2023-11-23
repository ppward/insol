import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import {Calendar} from 'react-native-calendars';
export default function Schedule() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>일정 </Text>
      </View>
      <View style={styles.calendarContainer}>
        <Calendar />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
  calendarContainer: {width: 330, height: 265, marginTop: 30, borderRadius: 15},
});
