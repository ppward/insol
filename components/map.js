import {View, Text, StyleSheet, Image, SafeAreaView} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
export default function Map() {
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: '80%',
          height: '80%',
          alignSelf: 'center',
          borderRadius: 15,
        }}>
        <MapView
          style={{flex: 1}}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}></MapView>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
