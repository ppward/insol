import * as React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import {Button, TextInput, Provider as PaperProvider} from 'react-native-paper';
export default function Intro() {
  const chartHeight = Dimensions.get('window').height;
  const chartWidth = Dimensions.get('window').width;
  const [modalVisible, setModalVisible] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: 'rgb(177,168,235)',
      }}>
      <TouchableOpacity
        onPressIn={() =>
          modalVisible ? setModalVisible(false) : setModalVisible(true)
        }>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.header}>인솔</Text>
          <Text style={{top: 50, fontSize: 28}}>[ insol ]</Text>
          <Image
            source={require('../assets/7605994.jpg')}
            style={{top: '20%', width: chartWidth, height: chartWidth}}
          />
        </View>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.container}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              width: '80%',
              borderRadius: 25,
            }}>
            <TextInput
              label="+82)10-0000-0000"
              value={username}
              onChangeText={setUsername}
              style={styles.modalText}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.modalText}
            />

            {/* Submit Button */}
            <Button
              mode="contained"
              onPress={() => {
                // Here you can handle the login logic
                console.log(username);
                console.log(password);

                // Close the modal after login
                setModalVisible(false);
              }}>
              로그인
            </Button>

            {/* Cancel Button */}
            <Button
              onPress={() => {
                // Clear input fields when canceling
                setUsername('');
                setPassword('');

                // Close the modal
                setModalVisible(false);
              }}>
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    top: 30,
    fontSize: 60,
    fontWeight: 'bold',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  modalText: {
    borderRadius: 4,
    margin: 5,
  },
});
