import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker'; // Make sure this line is included
import auth from '@react-native-firebase/auth';
import { database } from '@react-native-firebase/database';
import { ref, set } from 'firebase/database';


export default function Intro() {
  const [modalVisible, setModalVisible] = useState(false);
  const [signUpModalVisible, setSignUpModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const chartWidth = Dimensions.get('window').width;
  const [role, setRole] = useState('');
  

  const signInWithEmail = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      setModalVisible(false);
      // Post authentication success actions
    } catch (error) {
      console.error('Login failed', error);
      // Handle login error (e.g., show an alert or update the UI)
    }
  };
  const signUpWithEmail = async () => {
    if (!role) {
      alert('역할을 선택해주세요.');
      return;
    }
  
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const userId = userCredential.user.uid;
      console.log('Saving user data:', { email, role });
  
      await set(ref(database, 'users/' + userId), {
        email: email,
        role: role,
      });
  
      console.log('User data saved successfully');
      setSignUpModalVisible(false);
    } catch (error) {
      console.error('Signup failed', error);
    }
  };
  
  

  return (
    <View style={{ ...styles.container, backgroundColor: 'rgb(177,168,235)' }}>
      <TouchableOpacity onPressIn={() => setModalVisible(true)}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.header}>인솔</Text>
          <Text style={{ top: 50, fontSize: 28 }}>[ insol ]</Text>
          <Image
            source={require('../assets/7605994.jpg')}
            style={{ top: '20%', width: chartWidth, height: chartWidth }}
          />
        </View>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.container}>
          <View style={styles.modalView}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.modalText}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.modalText}
            />
            <Button mode="contained" onPress={signInWithEmail}>
              로그인
            </Button>
            <Button onPress={() => setSignUpModalVisible(true)}>회원가입</Button>
            <Button onPress={() => setModalVisible(false)}>Cancel</Button>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={signUpModalVisible}>
        <View style={styles.container}>
          <View style={styles.modalView}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.modalText}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.modalText}
            />
            <Picker
              selectedValue={role}
              onValueChange={(itemValue, itemIndex) => setRole(itemValue)}
            >
              <Picker.Item label="선생님" value="teacher" />
              <Picker.Item label="학생" value="student" />
              <Picker.Item label="학부모" value="parent" />
              <Picker.Item label="버스기사" value="busDriver" />
            </Picker>

            <Button mode="contained" onPress={signUpWithEmail}>
              회원가입
            </Button>
            <Button onPress={() => setSignUpModalVisible(false)}>Cancel</Button>
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
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 25,
  },
  modalText: {
    borderRadius: 4,
    margin: 5,
  },
});
