import {View, Text, SafeAreaView, StyleSheet} from 'react-native';

export default function Schedule() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>일정 </Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
