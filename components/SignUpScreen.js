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
  TouchableWithoutFeedback,
} from 'react-native';
import {auth} from './Firebase'; // Make sure to import the auth instance
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {firestore} from './Firebase'; // Make sure to import the firestore instance
import {doc, setDoc} from 'firebase/firestore';

const SignUpScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputClass, setInputClass] = useState('');
  const [inputJob, setInputJob] = useState('');
  const closeModal = () => {
    setModalVisible(false);
  };
  
  const handleSignUp = async () => {
    // 입력 값에 대한 유효성 검사
    if (!inputEmail.includes('@')) {
      Alert.alert('Error', 'Invalid email format');
      return;
    }
    if (inputPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (inputName.trim().length === 0) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    if (inputClass.trim().length === 0) {
      Alert.alert('Error', 'Class name is required');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        inputEmail,
        inputPassword,
      );
      const user = userCredential.user;
      await setDoc(doc(firestore, 'users', user.uid), {
        email: inputEmail,
        class: inputClass,
        name: inputName,
        job: inputJob,
      });
      Alert.alert('Success', 'User registered successfully');
      navigation.navigate('Intro');
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      Alert.alert('Error', errorCode + ': ' + errorMessage);
    }
  };

  const handleLoginPress = job => {
    setInputJob(job); // 직업 상태 설정
    setModalVisible(true); // 모달 열기
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{...styles.half, alignItems: 'flex-end'}}>
        <View style={styles.quadrant}>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => handleLoginPress('선생님')}>
            <Image
              source={require('../image/선생님.png')}
              style={styles.image}
            />
            <Text style={styles.label}>선생님 로그인</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quadrant}>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => handleLoginPress('학생')}>
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
            onPress={() => handleLoginPress('학부모')}>
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
            onPress={() => handleLoginPress('버스기사')}>
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
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.input}
                onChangeText={setInputEmail}
                value={inputEmail}
                placeholder="이메일"
                placeholderTextColor="#C7C7CD"
                keyboardType="default"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                onChangeText={setInputPassword}
                value={inputPassword}
                placeholder="비밀번호"
                placeholderTextColor="#C7C7CD"
                secureTextEntry={true} // 비밀번호 가리기 활성화
                keyboardType="default" // 기본 키보드 사용
                autoCapitalize="none" // 자동 대문자 변환 비활성화
              />
              <TextInput
                style={styles.input}
                onChangeText={setInputName}
                value={inputName}
                placeholder="이름"
                placeholderTextColor="#C7C7CD"
                keyboardType="default"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                onChangeText={setInputClass}
                value={inputClass}
                placeholder="반 이름"
                placeholderTextColor="#C7C7CD"
                keyboardType="default"
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={handleSignUp}>
                <View
                  style={{
                    width: 150,
                    height: 30,
                    borderRadius: 8,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text>회원가입</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
  },
  modalView: {
    width: 320,
    height: 400,
    backgroundColor: 'rgba(255,255,255,0)',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 200,
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
