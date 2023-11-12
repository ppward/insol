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
import { auth } from './Firebase';



export default function Intro() {
  const [modalVisible, setModalVisible] = useState(false);
  const [signUpModalVisible, setSignUpModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const chartWidth = Dimensions.get('window').width;

  const sendVerificationCode = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setVerificationId(confirmation.verificationId);
    } catch (error) {
      console.error('Verification code send failed', error);
    }
  };

  const confirmVerificationCode = async () => {
    try {
      const credential = auth.PhoneAuthProvider.credential(verificationId, verificationCode);
      await auth().signInWithCredential(credential);
      setSignUpModalVisible(false);
      // 회원가입 성공 후 처리
    } catch (error) {
      console.error('Verification code confirmation failed', error);
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
              label="Username"
              value={phoneNumber}  // 이 부분은 원래대로 username 상태를 사용해야 합니다
              onChangeText={setPhoneNumber}  // 이 부분도 원래대로 setUsername 함수를 사용해야 합니다
              style={styles.modalText}
            />
            <TextInput
              label="Password"
              secureTextEntry
              style={styles.modalText}
            />
            <Button mode="contained" onPress={() => setModalVisible(false)}>
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
              label="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              style={styles.modalText}
            />
            {verificationId ? (
              <TextInput
                label="Verification Code"
                value={verificationCode}
                onChangeText={setVerificationCode}
                style={styles.modalText}
              />
            ) : null}
            <Button mode="contained" onPress={sendVerificationCode}>
              인증코드 보내기
            </Button>
            {verificationId ? (
              <Button mode="contained" onPress={confirmVerificationCode}>

                인증코드 확인
              </Button>
            ) : null}
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
