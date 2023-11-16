import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

export default function Intro({ navigation }) {
  const chartWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.header}>인솔</Text>
          <Text style={{ top: 50, fontSize: 28 }}>[ insol ]</Text>
          <Image
            source={require('../assets/7605994.jpg')}
            style={{ top: '20%', width: chartWidth, height: chartWidth }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(177,168,235)',
  },
  header: {
    top: 30,
    fontSize: 60,
    fontWeight: 'bold',
  },
});