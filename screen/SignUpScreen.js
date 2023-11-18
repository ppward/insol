import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import {Button} from 'react-native-paper';
import {auth} from '../components/Firebase'; // Make sure to import the auth instance
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {firestore} from '../components/Firebase'; // Make sure to import the firestore instance
import {doc, setDoc} from 'firebase/firestore';

const SignUpScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputClass, setInputClass] = useState('');

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        inputEmail,
        inputPassword,
      );
      const user = userCredential.user;
      // Use Firestore's setDoc method to set the user document
      await setDoc(doc(firestore, 'users', user.uid), {
        email: inputEmail,
        class: inputClass,
        name: inputName,
      });
      Alert.alert('Success', 'User registered successfully');
      // Optional: navigate to the next screen
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      Alert.alert('Error', errorCode + ': ' + errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{...styles.half, alignItems: 'flex-end'}}>
        <View style={styles.quadrant}>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => setModalVisible(true)}>
            <Image
              source={require('../image/선생님.png')}
              style={styles.image}
            />
            <Text style={styles.label}>선생님 로그인</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quadrant}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={styles.signupButton}>
              <Image
                source={require('../image/학생.png')}
                style={styles.image}
              />
              <Text style={styles.label}>학생 로그인</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{...styles.half, alignItems: 'flex-start'}}>
        <View style={styles.quadrant}>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => setModalVisible(true)}>
            <Image
              source={require('../image/부모님.png')}
              style={styles.image}
            />
            <Text style={styles.label}>학부모 로그인</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quadrant}>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => setModalVisible(true)}>
            <Image source={require('../image/버스.png')} style={styles.image} />
            <Text style={styles.label}>버스기사 로그인</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.centeredView}>
          <TextInput
            style={styles.input}
            onChangeText={setInputEmail}
            value={inputEmail}
            placeholder="이메일"
            placeholderTextColor="#C7C7CD"
          />
          <TextInput
            style={styles.input}
            onChangeText={setInputPassword}
            value={inputPassword}
            placeholder="비밀번호"
            placeholderTextColor="#C7C7CD"
          />
          <TextInput
            style={styles.input}
            onChangeText={setInputName}
            value={inputName}
            placeholder="이름"
            placeholderTextColor="#C7C7CD"
          />
          <TextInput
            style={styles.input}
            onChangeText={setInputClass}
            value={inputClass}
            placeholder="반 이름"
            placeholderTextColor="#C7C7CD"
          />
          <Button onPress={handleSignUp}>회원가입</Button>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#B1A8EB',
  },
  half: {
    flex: 1,
    flexDirection: 'row',
  },
  quadrant: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  label: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signupButton: {
    width: 165,
    height: 260,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  input: {
    width: '50%',
    height: 50,
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 10,
    textAlign: 'center',
    backgroundColor: '#F7F7F7',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default SignUpScreen;
